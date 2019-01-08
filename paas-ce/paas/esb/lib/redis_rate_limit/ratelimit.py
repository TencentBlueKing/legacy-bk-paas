# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
""" # noqa
"""A distributed rate limiter rely on redis
based on `token bucket <https://en.wikipedia.org/wiki/Token_bucket>` algorithm

Usage
~~~~~

.. code-block:: python

    # Init a redis connection pool
    import redis
    redisdb = redis.Redis()

    rate = RateLimiter(redisdb, identifier='ip=127.0.0.1 path=/get_user_info/')
    # Allow 10 requests every 1 minute
    # period also accepts seconds/minutes/hours/days as key
    rate.add_rule(tokens=10, period={'minute': 1})

    # You could add multiple rules for on limiter
    # rate.add_rule(tokens=200, period={'hour': 1})

    print rate.acquire()
    # returns {'allowed': True, 'remaining_tokens': 9.0}

"""
import time
import logging

from redis import WatchError

logger = logging.getLogger('root')


class BaseRateLimiter(object):

    def __init__(self, redisdb, identifier, namespace='', tokens=None, period=None):
        """Init a RateLimiter class

        :param redisdb: a `redis.Redis` instance
        :param str identifier: identifier for the limiter, such as an user_id etc.
        :param str namespace: namespace for redis keys
        :param int tokens: maxium tokens for one time period
        :param dict period: dict, time period, such as {'minutes': 10}
        """
        self.redisdb = redisdb
        self.identifier = identifier
        self.namespace = namespace
        self.rules = []

        # Add rule
        if tokens is not None and period:
            self.add_rule(tokens, period)

        self.prepare()

    def prepare(self):
        """Prepare to work
        """
        pass

    def add_rule(self, tokens, period):
        """Add multiple rules for this limiter, see `__init__` for parameter details
        """
        rule = Rule(tokens, Rule.period_to_seonds(period))
        self.rules.append(rule)

    def acquire(self, tokens=1):
        """Acquire for a single request

        :param int tokens: tokens to consume for this request, default to 1
        """
        if not self.rules:
            return {'allowed': True, 'remaining_tokens': 0}

        logger.debug('Start acquiring tokens by given rules, this operation may have several '
                     'communications with redis.')
        rets = []
        for rule in self.rules:
            logger.debug('Acquiring by single rule, rule=%s tokens=%s', rule, tokens)
            ret = self.acquire_by_single_rule(rule, tokens)
            logger.debug('Acquiring finished, result=%s', ret)
            if not ret['allowed']:
                logger.debug('Acquiring denied by given rule, rule=%s.', rule)
                return ret

            rets.append(ret)
        logger.debug('Acquiring successed.')
        return {
            'allowed': True,
            'remaining_tokens': min(x['remaining_tokens'] for x in rets)
        }


class RateLimiter(BaseRateLimiter):
    """Rate limiter class
    """

    def acquire_by_single_rule(self, rule, tokens=1):
        """Acquire an request quota from limiter

        :param rule: `Rule` object
        :param int tokens: tokens to be consumed, default 1
        :returns: a dict of `allowed` and `remaining_tokens`
          - allowed: wheather this request is allowed
          - remaining_tokens: remaining_tokens for this rule's period
        """
        rk_tokens = 'rlim::%s::tokens::%s::r%s' % (self.namespace, self.identifier, rule.to_string())
        rk_last_ts = 'rlim::%s::last_ts::%s::r%s' % (self.namespace, self.identifier, rule.to_string())
        rule_ttl_seconds = rule.period_seconds + 10

        try:
            rv_last_ts = float(self.redisdb.get(rk_last_ts))
            rv_tokens = float(self.redisdb.get(rk_tokens))
        except Exception:
            # Inintilize values if not exists
            rv_last_ts = time.time()
            rv_tokens = rule.tokens
            self.redisdb.set(rk_tokens, rv_tokens, ex=rule_ttl_seconds)
            self.redisdb.set(rk_last_ts, '%.3f' % rv_last_ts, ex=rule_ttl_seconds)

        # Add fresh tokens since last timestamp
        with self.redisdb.pipeline() as pipe:
            pipe.watch(rk_last_ts)

            # Float precision may cause this value negative
            # Add token by passed time
            senconds_passed = max(time.time() - rv_last_ts, 0)
            fresh_tokens = rule.fresh_tokens_by_seconds(senconds_passed)

            remaining_tokens = rv_tokens
            # Only add fresh token when it's greater than 1
            # Passed time maybe less than 1, fresh_token more than 1
            if fresh_tokens >= 1 and remaining_tokens < rule.tokens:
                # Never add let tokens more than rule.tokens
                fresh_tokens = min(fresh_tokens, rule.tokens - remaining_tokens)

                pipe.multi()
                pipe.incrbyfloat(rk_tokens, fresh_tokens)
                pipe.expire(rk_tokens, rule_ttl_seconds)
                pipe.set(rk_last_ts, '%.3f' % time.time(), ex=rule_ttl_seconds)
                # Ignore WatchError
                try:
                    pipe.execute()
                except WatchError:
                    pass
        # Remove tokens, if tokens to consume are bigger than remaining tokens, do nothing
        # and return Flase
        remaining_tokens = self.redisdb.incrbyfloat(rk_tokens, -tokens)
        over_limit = False
        if remaining_tokens < 0:
            remaining_tokens = self.redisdb.incrbyfloat(rk_tokens, tokens)
            over_limit = True

        return {
            'allowed': not over_limit,
            'remaining_tokens': max(remaining_tokens, 0)
        }


class SimpleLimiter(BaseRateLimiter):

    def prepare(self):
        self.simple_incr = self.redisdb.register_script('''\
local current
current = redis.call("incr", KEYS[1])
if tonumber(current) == 1 then
    redis.call("expire", KEYS[1], ARGV[1])
end
return current''')

    def acquire_by_single_rule(self, rule, tokens=1):
        """Acquire an request quota from limiter

        :param rule: `Rule` object
        :param int tokens: tokens to be consumed, default 1
        :returns: a dict of `allowed` and `remaining_tokens`
          - allowed: wheather this request is allowed
          - remaining_tokens: remaining_tokens for this rule's period
        """
        # TODO: Should we use ( current timestamp / period_seconds ) as part of the redis key?
        rk_counter = 'rlim::%s::scounter::%s::r%s' % (self.namespace, self.identifier, rule.to_string())
        old_cnt = self.redisdb.get(rk_counter)
        if old_cnt is not None and int(old_cnt) >= rule.tokens:
            return {
                'allowed': False,
                'remaining_tokens': 0.0
            }

        new_cnt = self.simple_incr(keys=[rk_counter], args=[rule.period_seconds])
        return {
            'allowed': True,
            'remaining_tokens': max(0, rule.tokens - new_cnt)
        }


class Rule(object):
    """Rule class for RateLimiter"""

    time_unit_to_seconds = {
        'second': 1,
        'minute': 60,
        'hour': 3600,
        'day': 3600 * 24,
    }

    @classmethod
    def period_to_seonds(cls, period):
        for unit, seconds in cls.time_unit_to_seconds.items():
            if unit in period:
                period_seconds = period[unit] * seconds
                break
        else:
            raise ValueError(('Invalid period %s given, should be '
                              '{"second/minute/hour/day": NUMBER}') % period)
        return period_seconds

    def __init__(self, tokens, period_seconds):
        self.tokens = tokens
        # Precision of seconds only to second
        self.period_seconds = int(period_seconds)

        if tokens < 0:
            logger.warn('Will not allow any acquire because given tokens < 0')

    def to_string(self):
        return "%s_%s" % (self.tokens, self.period_seconds)

    def fresh_tokens_by_seconds(self, seconds):
        return int(self.rate_per_seconds * seconds)

    @property
    def rate_per_seconds(self):
        return self.tokens / float(self.period_seconds)

    def __repr__(self):
        return '<Rule %s>' % self.to_string()
