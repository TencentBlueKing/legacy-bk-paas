$(function () {
    Handlebars.registerHelper("render_event", function (event){
        var result = '';
        var _html_time = '<span data-toggle="tooltip" title="' + moment(event.mts).format('MM-DD HH:mm') +
                         '" class="time">' + moment(event.mts).fromNow() + '</span>';

        var ftime = function(timestamp) {
            return moment(timestamp).format('HH:mm');
        };

        var name = event.basic_info.label || event.basic_info.name;
        if (event.type === 'availability_restored') {
            result += '<div class="icon"><i class="brand-success fa fa-check-circle"></i></div>';
            result += '<div class="info">';
            result += '<strong><a>' + name + '</a></strong> ';
            result += _html_time;
            result += '<div>';
            result += gettext('可用率恢复至 100%');
            if (event.data.msecs_avai_dropped) {
                low_available_duration = parseInt(event.data.msecs_avai_dropped / 1000 / 60);
                tmp_msg = ngettext('低可用持续时间: <strong> %s 分钟</strong>', '低可用持续时间: <strong> %s 分钟</strong>', low_available_duration);
                tmp_msg = interpolate(tmp_msg, [low_available_duration]);
                result += ', ' + tmp_msg;
            }
            result += '</div></div>';

        }
        if (event.type === 'availability_dropped') {
            result += '<div class="icon"><i class="brand-danger fa fa-exclamation-circle"></i></div>';
            result += '<div class="info">';
            result += '<strong><a>' + name + '</a></strong> ';
            result += _html_time;
            result += '<div>' + gettext('可用率下降至') + ' <strong>' + event.data.rate_availability.value_str +
                      '%</strong>, ' + gettext('调用错误数/总次数') + ': <strong>' + event.data.requests.error_count + '/' + event.data.requests.count + '</strong></div></div>';
        }
        if (event.type === 'errors_occurred') {
            tmp_msg = ngettext('偶发 %s 次请求错误', '偶发 %s 次请求错误', event.data.requests.error_count)
            tmp_msg = interpolate(tmp_msg, [event.data.requests.error_count]);
            result += '<div class="icon"><i class="brand-warning fa fa-exclamation-circle"></i></div>';
            result += '<div class="info">';
            result += '<strong><a>' + name + '</a></strong> ';
            result += _html_time;
            result += '<div>' + tmp_msg + '</div></div>';
        }
        return result;
    });

    Handlebars.registerHelper("add_commas", function (value){
        return ReplaceNumberWithCommas(value);
    });
    Handlebars.registerHelper("math_floor", function (value){
        return Math.floor(value);
    });
    // smart_color 为不同的可用率来计算颜色
    Handlebars.registerHelper("smart_color", function (value){
        if (value < 97) {
            return '#d9534f';
        } else if (value < 100) {
            return '#f0c04e';
        } else {
            return '#5cb85c';
        }
    });

    var PageConf = Backbone.Model.extend();
    var CurrentConf = new PageConf();

    var MainView = Backbone.View.extend({
        el: 'body',
        template: Handlebars.compile($('#tmpl_system_list').html()),
        template_timeline: Handlebars.compile($('#tmpl_events_timeline').html()),
        events: {
            'click #selector-time-since a': function(ev) {
                CurrentConf.set({time_since: $(ev.target).attr('value')});
            },
            'change #autorefresh-switch': function(ev) {
                var ar_status = $(ev.target).is(':checked');
                if (ar_status) {
                    this.start_auto_refresh();
                } else {
                    this.stop_auto_refresh();
                }
            }
        },
        initialize: function (){
            this.listenTo(CurrentConf, 'change', this.render);
        },
        render: function() {
            this.render_system_list();
            this.render_timeline();
        },
        render_system_list: function() {
            var time_since = CurrentConf.get('time_since');

            var elem_time_since = $('#selector-time-since a[value="' + time_since +'"]');
            $('#selector-time-since span.dropdown-text').text(elem_time_since.text());

            var tmpl = this.template;
            $.getJSON(
                UrlMaker.make('summary_all'),
                {
                    time_since: time_since
                },
                function(result) {
                    $('#container-all-system-list').html(tmpl(result));
                    $('[data-toggle="tooltip"]').tooltip();
                    if (result.error_message) {
                        $('#system-list-block').html('<div class="row mt10"><span style="color: #667366">' + gettext('获取实时运营数据失败') + ', ' + result.error_message + '</span></div>');
                    }
                }
            );
        },
        render_timeline: function() {
            var tmpl = this.template_timeline;

            $.getJSON(UrlMaker.make('systems_events_timeline'), {
            }, function(result) {
                $('#container-events-timeline').html(tmpl(result));
                $('[data-toggle="tooltip"]').tooltip();

                if (result.error_message) {
                    $('#container-events-timeline').html('<div class="events-list" style="padding-top: 0px"><span style="color: #667366">' + gettext('获取系统错误事件失败') + ', ' + result.error_message + '</span></div>');
                }

            });
        },
        start_auto_refresh: function() {
            this.interval_var = setInterval(function() {
                // 触发 chart 的 render 方法
                CurrentConf.trigger('change');
            }, 60000);
        },
        stop_auto_refresh: function() {
            clearInterval(this.interval_var);
        }
    });

    var EMainView = new MainView();

    $(document).on('click', '.link-to-system', function(){
        var system_name = $(this).data('system-name');
        window.location.href = UrlMaker.make('systems_index', {system_name: system_name}) +
            '#main/?time_since=' + '1h';
    });

    $(document).on('click', '.event', function(){
        var system_name = $(this).data('system-name');
        var mts = $(this).data('mts') - 300 * 1000;
        var mts_end = _.min([(mts + 3600 * 1000), moment().unix() * 1000]);
        var time_since = 'custom:' + mts + '_' + mts_end;
        window.location.href = UrlMaker.make('systems_index', {system_name: system_name}) +
            '#main/?time_since=' + time_since;
    });

    // 设置初始值
    CurrentConf.set({
        time_since: '1m'
    });

    $('#autorefresh-switch').click();
});
