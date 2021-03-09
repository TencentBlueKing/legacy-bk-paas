$(function () {
    // 系统实时概况请求详情下，辅助"错误/总次数"列排序
    $.tablesorter.addParser({
        id: 'req_count',
        is: function(s) {
            return false;
        },
        format: function(s) {
            s = s.replace(',', '').split('/');
            return s[s.length - 1];
        },
        type: 'numeric',
    });

    // register handlebars helper
    Handlebars.registerHelper("counter", function (index){
        return index + 1;
    });
    Handlebars.registerHelper("format_time", function (timestamp, is_second){
        if (is_second === true) {
            timestamp = timestamp * 1000;
        }
        return moment(timestamp).format('MM-DD HH:mm');
    });
    Handlebars.registerHelper("add_commas", function (value){
        if (value == undefined) {
            return ''
        } else {
            return ReplaceNumberWithCommas(value);
        }
    });

    var default_conf = {
        time_since: '1h'
    };

    // 定义 router
    var Router = Backbone.Router.extend({
        routes: {
            'main/?:param': 'main'
        },
        main: function(params){
            CurrentConf.set_time_since(_.extend(default_conf, deparam(params)).time_since);
            CurrentChartConf.trigger('change');
        }
    });
    var router = new Router();

    // Basic Model
    var PageConf = Backbone.Model.extend({
        time_seconds_map: {
            '1m': 60,
            '10m': 600,
            '30m': 1800,
            '1h':  3600,
            '24h': 86400,
            '7d': 604800
        },
        chart_interval_map: {
            '10m': '1m',
            '30m': '1m',
            '1h':  '1m',
            '24h': '1h',
            '7d': '1d'
        },
        get_time_since_seconds: function(time_since) {
            return this.time_seconds_map[time_since || this.attributes.time_since];
        },
        get_now_time_by_ms: function() {
            return moment().unix() * 1000 + moment().milliseconds();
        },
        get_mts_range: function(time_since) {
            if (time_since.indexOf('custom:') !== -1) {
              l = time_since.slice(7).split('_');
              return {
                  mts_start: l[0],
                  mts_end: l[1]
              };
            }

            var mts_end = this.get_now_time_by_ms();
            var mts_start = mts_end - (this.get_time_since_seconds(time_since) * 1000);
            return {
                mts_start: mts_start,
                mts_end: mts_end
            }
        },
        refresh_mts_range_to_now: function() {
            // 自动把时间范围补全到最新时间
            var _mts_end = this.get_now_time_by_ms();
            var _mts_start = _mts_end - (this.get('mts_end') - this.get('mts_start'));
            this.set({
                mts_start: _mts_start,
                mts_end: _mts_end
            });
        },
        set_time_since: function(time_since) {
            var attrs = _.extend(
                {time_since: time_since},
                this.get_mts_range(time_since)
            )
            this.set(attrs);
        }
    });
    var CurrentConf = new PageConf(current_conf);

    var BasicConf = Backbone.Model.extend();
    var CurrentChartConf = new BasicConf();
    var CurrentDetailsConf = new BasicConf();

    // 设置初始值
    CurrentChartConf.set({
        boundary_time: '24h',
    })
    CurrentDetailsConf.set({
        type: 'component',
        order: 'availability_asc'
    });

    // Basic View for this page
    var PageView = Backbone.View.extend({
        el: 'body',
        events: {
            'change #autorefresh-switch': function(ev) {
                var ar_status = $(ev.target).is(':checked');
                if (ar_status) {
                    this.start_auto_refresh();
                } else {
                    this.stop_auto_refresh();
                }
            }
        },
        initialize: function() {

        },
        start_auto_refresh: function() {
            this.interval_var = setInterval(function() {
                // 自动把时间范围补全到最新时间
                CurrentConf.refresh_mts_range_to_now();
                // 触发 chart 的 render 方法
                CurrentChartConf.trigger('change');
            }, 60000);
        },
        stop_auto_refresh: function() {
            clearInterval(this.interval_var);
        },
    });

    var ChartStatusView = Backbone.View.extend({
        el: 'body',
        events: {
            'click #selector-boundary-time button': function(ev) {
                CurrentChartConf.set({boundary_time: $(ev.target).attr('value')});
            },
        },
        initialize: function() {
            this.listenTo(CurrentChartConf, 'change', this.render);
        },
        render: function() {
            this.render_chart();
        },
        render_chart: function() {
            var get_series_options = this.get_series_options;
            var get_yaxis_options = this.get_yaxis_options;

            var _mts_start;
            var _mts_end = CurrentConf.get_now_time_by_ms();
            var _time_span;

            // 设置时间选择条为最近一段时间
            if (CurrentChartConf.get('boundary_time') === '24h') {
                _time_span = 86400000;   // 3600 * 24 * 1000
            } else {
                _time_span = 604800000;  // 3600 * 24 * 1000 * 7
            }
            _mts_start = _mts_end - _time_span;

            var default_options = this.get_default_options(
                CurrentConf.get('mts_start'),
                CurrentConf.get('mts_end')
            );

            // 绘制 系统实时概况 图表
            $.getJSON(
                UrlMaker.make('date_histogram', current_conf),
                {
                    time_interval: '1m',
                    mts_start: _mts_start,
                    mts_end: _mts_end,
                },
                function(result) {
                    if (result.error_message) {
                        $('#chart-status').html('<div>' + gettext('获取系统最新状态数据失败') + ', ' + result.error_message + '</div>')
                        return;
                    }

                    var d = result.data;
                    if (!d) {
                        $('#chart-status').html('<div>' + gettext('系统最新状态数据为空') + '</div>');
                        return;
                    }

                    var chart_options = _.extend(
                        default_options,
                        get_yaxis_options(true, true, false),
                        get_series_options(d)
                    );

                    var echarts_status = echarts.init(document.getElementById('chart-status'));
                    echarts_status.setOption(chart_options);
                    echarts_status.on('datazoom', function(params) {
                        chart_options = echarts_status.getOption();
                        start_value = chart_options.dataZoom[0].startValue;
                        end_value = chart_options.dataZoom[0].endValue;

                        CurrentConf.set({
                            time_since: 'custom:' + start_value + '_' + end_value,
                            mts_start: start_value,
                            mts_end: end_value
                        });
                    });
                    echarts_status.on('legendselectchanged', function(params){
                        var is_rate_availability_show = params.selected[gettext('可用率')]
                        var is_requests_show = params.selected[gettext('请求数')]
                        var is_resp_time_show = params.selected[gettext('平均响应时间')] || params.selected[gettext('统计响应时间')]
                        if (is_requests_show) {
                            is_resp_time_show = false;
                        }
                        this.setOption(get_yaxis_options(is_rate_availability_show, is_requests_show, is_resp_time_show));
                    });
                }
            );
        },
        get_default_options: function(start_value, end_value) {
             return {
                title: {
                    text: CurrentConf.get('system_label') + ' ' + gettext('系统实时概况'),
                    left: 'center',
                    textStyle: {
                        fontWeight: 'bold',
                    }
                },
                xAxis: [{
                    type: 'time',
                    splitLine: {
                        show: false
                    },
                }],
                legend: {
                    orient: 'vertical',
                    right: 120,
                    top: 80,
                    borderWidth: 0,
                    selected: {
                        '平均响应时间': false,
                        'Average response time': false,
                    },
                    textStyle: {
                        fontWeight: 'bold',
                    },
                    data: [
                        {
                            name: gettext('可用率'),
                        },
                        {
                            name: gettext('请求数'),
                        },
                        {
                            name: gettext('平均响应时间'),
                        },
                        {
                            name: gettext('统计响应时间'),
                        }
                    ]
                },
                dataZoom: [
                    {
                        type: 'slider',
                        xAxisIndex: 0,
                        filterMode: 'filter',
                        // 初始的开始和结束位置，根据实际情况调整
                        startValue: parseInt(start_value),
                        endValue: parseInt(end_value),
                        realtime: false,
                    }
                ],
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    },
                    formatter: function(params) {
                        var tip_msg = [];
                        var current_time = null;
                        _.each(params, function(obj, index) {
                            if (!obj.value) {
                                return;
                            }
                            if (!current_time) {
                                current_time = moment(obj.value[0]).format('YYYY-MM-DD HH:mm');
                                tip_msg.push(current_time);
                            }
                            if (obj.value[1] != null) {
                                if (obj.seriesName == gettext('可用率')) {
                                    tip_msg.push(obj.seriesName + ': ' + obj.value[1].toFixed(2) + ' %');
                                } else if (obj.seriesName == gettext('平均响应时间') || obj.seriesName == gettext('统计响应时间')) {
                                    tip_msg.push(obj.seriesName + ': ' + obj.value[1].toFixed(2) + ' ms');
                                } else {
                                    tip_msg.push(obj.seriesName + ': ' + obj.value[1]);
                                }
                            }
                        });
                        return tip_msg.join('<br>');
                    }
                }
            };
        },
        get_yaxis_options: function(is_rate_availability_show, is_requests_show, is_resp_time_show) {
            return {
                yAxis: [
                    {
                        //name: 'rate_avail',
                        max: 100,
                        min: 'dataMin',
                        scale: true,
                        position: 'left',
                        axisLabel: {
                            formatter: function(value, index) {
                                if (index === 0) {
                                    // 第一个可能出现 99.94340690435767 样数字，保留小数点后两位
                                    var re = /([0-9]+.[0-9]{2})[0-9]*/;
                                    value = value.toString().replace(re, '$1');
                                }
                                return value + '%';
                            },
                            show: is_rate_availability_show,
                        },
                        axisTick: {
                            show: is_rate_availability_show,
                        },
                        axisLine: {
                            show: false
                        },
                        splitLine: {
                            show: false
                        }
                    },
                    {
                        //name: 'requests',
                        position: 'right',
                        min: 0,
                        minInterval: 1,
                        axisLabel: {
                            show: is_requests_show,
                        },
                        axisTick: {
                            show: is_requests_show,
                        },
                        axisLine: {
                            show: false
                        },
                        splitLine: {
                            show: false
                        }
                    },
                    {
                        //name: 'resp_time',
                        min: 0,
                        axisLabel: {
                            formatter: '{value}ms',
                            show: is_resp_time_show,
                        },
                        axisTick: {
                            show: is_resp_time_show,
                        },
                        axisLine: {
                            show: false
                        },
                        splitLine: {
                            show: false
                        }
                    }
                ]
            }
        },
        get_series_options: function(d) {
            return {
                series: [
                    {
                        name: gettext('可用率'),
                        type: 'line',
                        position: 'left',
                        yAxisIndex: 0,
                        data: d.rate_availability.data,
                        symbol: 'circle',
                        symbolSize: 10,
                        showSymbol: false,
                        lineStyle : {
                            normal: {
                                width: 3,
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: '#90ed7d',
                            }
                        },
                    },
                    {
                        name: gettext('请求数'),
                        type: 'line',
                        yAxisIndex: 1,
                        data: d.requests.data,
                        showSymbol: false,
                        symbol: 'diamond',
                        symbolSize: 10,
                        lineStyle: {
                            normal: {
                                width: 3,
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: '#7cb5ec',
                            }
                        },
                    },
                    {
                        name: gettext('平均响应时间'),
                        type: 'line',
                        data: d.avg_resp_time.data,
                        yAxisIndex: 2,
                        showSymbol: false,
                        symbol: 'rect',
                        symbolSize: 10,
                        connectNulls: true,
                        lineStyle : {
                            normal: {
                                width: 3,
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: '#434348',
                            }
                        }
                    },
                    {
                        name: gettext('统计响应时间'),
                        type: 'line',
                        data: d.perc95_resp_time.data,
                        yAxisIndex: 2,
                        symbol: 'triangle',
                        symbolSize: 10,
                        showSymbol: false,
                        connectNulls: true,
                        lineStyle : {
                            normal: {
                                width: 3,
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: '#e7711b',
                            }
                        }
                    }
                ]
            }
        },
    });

    var chart_status_view = new ChartStatusView();

    var SystemSummaryView = Backbone.View.extend({
        initialize: function() {
            this.listenTo(CurrentConf, 'change', this.render);
        },
        render: function() {
            $.getJSON(
                UrlMaker.make('summary', current_conf),
                {
                    time_since: CurrentConf.get('time_since'),
                    mts_start: CurrentConf.get('mts_start'),
                    mts_end: CurrentConf.get('mts_end')
                },
                function(result) {
                    if (result.error_message) {
                        $('#container-system-summary').html('<div>' + gettext('获取系统概况数据失败') + ', ' + result.error_message + '</div>')
                        return;
                    }
                    var template = Handlebars.compile($('#tmpl_system_summary').html());
                    $('#container-system-summary').html(template(result.data));

                    // render 系统信息
                    template = Handlebars.compile($('#tmpl_sider_system_info').html());
                    $('#container-sider-system-info').html(template(result.data));
            });
        },
    });

    var TableDetailsView = Backbone.View.extend({
        el: '#requests-details',
        events: {
            'click #tab-details li>a': function(ev) {
                ev.preventDefault();
                CurrentDetailsConf.set({type: $(ev.target).data('type')});
            },
            'click a.check-error-details': 'check_error_details'
        },
        type_conf_map: {
            'component': {
                group_by: 'req_component_name',
                template: Handlebars.compile($('#tmpl_table_details_by_component').html()),
                group_id: 'table-details-component',
            },
            'url': {
                group_by: 'req_url',
                template: Handlebars.compile($('#tmpl_table_details_by_url').html()),
                group_id: 'table-details-url',
            },
            'app': {
                group_by: 'req_app_code',
                template: Handlebars.compile($('#tmpl_table_details_by_app').html()),
                group_id: 'table-details-app',
            }
        },
        initialize: function() {
            this.listenTo(CurrentDetailsConf, 'change', this.render);
            this.listenTo(CurrentConf, 'change', this.render);
        },
        render: function() {
          // 重新渲染表格
          var el = this.$('#container-table-details');
          var data_type = CurrentDetailsConf.get('type');
          var conf = this.type_conf_map[data_type];

          this.$('#tab-details li').removeClass('active');
          this.$('#tab-details a[data-type="' + data_type + '"]').parent().addClass('active');

          $.getJSON(
              UrlMaker.make('group_by', current_conf),
              {
                  time_since: CurrentConf.get('time_since'),
                  mts_start: CurrentConf.get('mts_start'),
                  mts_end: CurrentConf.get('mts_end'),
                  group_by: conf.group_by,
                  order: CurrentDetailsConf.get('order')
              },
              function(result) {
                  if (result.error_message) {
                      el.html('<div>' + gettext('获取请求详情数据失败') + ', ' + result.error_message + '</div>');
                      return;
                  }

                  // 渲染模版
                  el.html(conf.template(result));

                  // 表格排序
                  if (result.data && result.data.length > 0) {
                      sort_list = [[5, 0]];
                  } else {
                      sort_list = [];
                  }
                  $("#" + conf.group_id).tablesorter({
                      theme: 'dropbox',
                      headerTemplate: '{content} {icon}',
                      widthFixed: true,
                      widgets : ['zebra', 'columns', 'uitheme'],
                      headers: {2: {sorter: 'req_count'}},
                      sortList: sort_list,
                  });
              }
          );

          // Update hash
          router.navigate('main/?time_since=' + CurrentConf.get('time_since'));
        },
        check_error_details: function(ev) {
            var elem = ev.target;
            var url = $(elem).data('url') || '';
            var app_code = $(elem).data('app_code') || '';
            var component_name = $(elem).data('component_name') || '';

            $.getJSON(
                UrlMaker.make('errors', current_conf),
                {
                    url: url,
                    app_code: app_code,
                    component_name: component_name,
                    mts_start: CurrentConf.get('mts_start'),
                    mts_end: CurrentConf.get('mts_end'),
                    size: '200'
                },
                function(result) {
                    if (result.error_message) {
                        art.dialog({
                            id: 'bktips',
                            title: gettext('提示'),
                            icon: 'error',
                            lock: true,
                            content: '<div class="king-notice-box king-notice-fail"><p class="king-notice-text">' + result.error_message + '</p></div>',
                        });
                        return;
                    }
                    var template = Handlebars.compile($('#tmpl_error_details_popup').html());
                    var html = template({
                        data: result.data,
                        url: url,
                        app_code: app_code,
                        component_name: component_name
                    });
                    var d = dialog({
                        title: gettext('错误请求详情'),
                        content: html,
                        width: 800,
                        height: 500,
                        fixed: true,

                    });
                    d.showModal();
                }
            );
        }
    });

    var page_view = new PageView();
    var system_summary_view = new SystemSummaryView();
    var table_details_view = new TableDetailsView();

    // 如果没有从 hash 中读取到默认值，设置为默认值
    if (!Backbone.history.start()) {
        CurrentConf.set(default_conf);
    }

    // 默认打开自动刷新
    $('#autorefresh-switch').click();
});
