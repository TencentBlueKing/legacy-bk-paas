 /*!
  * bkSwitcher v1.0
  * author Blueking
  * Copyright (c) 2012-2017 Tencent BlueKing. All Rights Reserved.
  */
(function(factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // Node/CommonJS
        module.exports = factory(require('jquery'));
    } else {
        // Browser globals
        factory(window.jQuery);
    }
}(function($) {
    $.fn.bkSwitcher = function(options) {
        var _this = this;
        var defaultOptions = {
            size: 'default', // 灏哄锛宒efault/small
            onText: 'ON', // 鎵撳紑鏂囨
            offText: 'OFF', // 鍏抽棴鏂囨
            isOutline: false, // 鏄惁鎻忚竟
            isSquare: false, // 鏄惁鏂瑰舰
            onChange: function() {}, // 鏀瑰彉鏃剁殑鍥炶皟
        };
        var settings = $.extend({}, defaultOptions, options);

        function _guid() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
                return v.toString(16);
            });
        }

        // 鍒濆鍖�
        function init(target) {
            var isChecked = target.is(':checked');
            var isDisabled = target.is(':disabled');

            // 鍒濆DOM
            target.wrap('<div class="bk-switcher show-label"></div>');
            var wrapper = target.closest('.bk-switcher');
            wrapper.append('<label class="switcher-label"><span class="switcher-text on-text">ON</span><span class="switcher-text off-text">OFF</span></label>');

            // 鍒濆灏哄
            if (settings.size == 'small') {
                wrapper.addClass('bk-switcher-small');
            }

            // 鍒濆鐘舵€�
            if (settings.isOutline) {
                wrapper.addClass('bk-switcher-outline');
            }
            if (settings.isSquare) {
                wrapper.addClass('bk-switcher-square');
            }
            if (isChecked) {
                wrapper.addClass('is-checked');
            } else {
                wrapper.removeClass('is-checked');
            } 
            if (isDisabled) {
                wrapper.addClass('is-disabled');
            } else {
                wrapper.removeClass('is-disabled');
            } 

            // 缁戝畾浜嬩欢
            target.on('click', function() {
                var wrapper = target.closest('.bk-switcher');
                var isChecked = target.is(':checked');
                if (isChecked) {
                    wrapper.addClass('is-checked');
                } else {
                    wrapper.removeClass('is-checked');
                }
                settings.onChange && settings.onChange(isChecked, wrapper);
            });

            function _enable() {
                var wrapper = target.closest('.bk-switcher');
                wrapper.removeClass('is-disabled');
                target.removeAttr('disabled', 'true');
            }

            function _disable() {
                var wrapper = target.closest('.bk-switcher');
                wrapper.addClass('is-disabled');
                target.attr('disabled', 'true');
            }

            function _isActive() {
                return target.is(':checked');
            }

            function _setActive(isChecked) {
                var wrapper = target.closest('.bk-switcher');
                if (isChecked) {
                    wrapper.addClass('is-checked');
                    target.attr('checked', 'true');
                } else {
                    wrapper.removeClass('is-checked');
                    target.removeAttr('checked');
                }
            }

            function _toggleActive() {
                target.trigger('click');
            }

            // 娉ㄥ唽瀵硅薄
            target.data('bkSwitcher', {
                uuid: _guid(),
                enable: function() {
                    _enable();
                },
                disable: function(){
                    _disable();
                },
                getStatus: function(){
                    return _isActive();
                },
                setStatus: function(isChecked) {
                    _setActive(isChecked);
                },
                toggleStatus: function() {
                    _toggleActive();
                }
            });
        } 

        $.each(this, function() {
            var target = $(this);
            if (target && !target.data('bkSwitcher')) {
                init(target);
            }
        })
    }
}));