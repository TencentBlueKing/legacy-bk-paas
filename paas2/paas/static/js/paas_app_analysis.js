$(function(){
    // 选择日期范围
    $('.range-time').daterangepicker({
        locale : {
            "format" : 'YYYY-MM-DD',
            "applyLabel": gettext("确定"),
            "cancelLabel": gettext("取消"),
            "weekLabel": gettext('周'),
            "customRangeLabel": gettext("自定义"),
            "daysOfWeek": [
                gettext("日"),
                gettext("一"),
                gettext("二"),
                gettext("三"),
                gettext("四"),
                gettext("五"),
                gettext("六")
            ],
            "monthNames": [
                gettext("一月"),
                gettext("二月"),
                gettext("三月"),
                gettext("四月"),
                gettext("五月"),
                gettext("六月"),
                gettext("七月"),
                gettext("八月"),
                gettext("九月"),
                gettext("十月"),
                gettext("十一月"),
                gettext("十二月")
            ],
            "firstDay": 1// 周开始时间
        },
        startDate: moment().subtract(6, 'days').format('YYYY-MM-DD'),
        endDate: moment().format('YYYY-MM-DD')
    });
    // 选择展示方式(周，月，日)
    $(".show_way").select2({
        minimumResultsForSearch: Infinity,
        data:[{id: 0, text: gettext("按日")}, {id: 1, text: gettext("按月")}],
    });
    $(".show_way").select2('val', 0);
    $('#search-btn').click(function(){
		// loading
		var loading_html = '<div>'+
						     '<div style="padding-top:180px;">'+
							   '<img src="' + static_url + 'img/loading_2_24x24.gif">'+
							   '<span style="margin-left: 5px;">' + gettext('数据正在加载，请稍等...') + '</span>'+
							 '</div>'+
						   '</div>';
		$("#chart_content").html(loading_html);
		var range_time = $('.range-time').val();
		var range_time_list = range_time.split(' - ');
		var stime = range_time_list[0];
		var etime = range_time_list[1];
		var show_way = $('.show_way').select2('val');
		var param = {
		    stime: stime,
            etime: etime,
            show_way: show_way
        }
        // 请求url
		var url = site_url + 'app_analysis/get_visit_chart/' + app_code + '/';
		$.get(url, param, function(html_data){
			$("#chart_content").html(html_data);
		}, 'html');
    });
    $('#search-btn').click();
})

function get_chart_option(category, pv_data, uv_data) {
    var option = {
        title: {
            text: gettext('应用访问量')
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data:[gettext('访问量'), gettext('用户量')]
        },
        toolbox: {
            show: false
        },
        xAxis:  {
            type: 'category',
            boundaryGap: false,
            data: category
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                formatter: '{value}'
            }
        },
        series: [
            {
                name: gettext('访问量'),
                type:'line',
                data: pv_data
            },
            {
                name: gettext('用户量'),
                type:'line',
                data: uv_data
            }
        ]
    };
  return option;
}
