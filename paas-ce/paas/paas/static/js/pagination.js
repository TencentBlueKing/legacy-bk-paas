/**
* Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
* Copyright (C) 2017-2018 THL A29 Limited, a Tencent company. All rights reserved.
* Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
* http://opensource.org/licenses/MIT
* Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/
/**
 * table表格数据分页
 * @param   url                          异步获取的thead与tbody模板数据的url
 * @param   table_obj                 请求数据table对象
 * @param   items_per_page            table表格中，每页显示多少条
 * @param   current_page              当前显示页数
 * @param   callback                  处理扩展功能的回调函数
 * @param   is_select                 是否显示每页显示多少行的选择下拉框
 */

jQuery.fn.pagination = function(opt){
    //初始化一些默认参数值
    var opts = jQuery.extend({url : ''
               ,items_per_page : 10
               ,current_page : 1
               ,link_to : "###"
               ,num_display_items : 4      //显示多少页数后省略余下的页码
               ,table_obj : ''
               ,callback : function(){}
               ,is_select : false
               ,async : true
               },opt||{});

    var total_num                        //异步请求数据总的记录数
        ,extends_par                    //用于table数据扩展功能的参数，例如，文件下载等
        ,panel = $(this)               //分页条对象
        ,loading_img = ""    //加载图片
        ,is_select = opts.is_select;        //每页显示多少行的选择下拉框
    return this.each(function(){
        if(!$('#loading_example')[0]){
            if($(opts.table_obj).get(0).tagName=="TBODY"){
                var cols=0;
                $(opts.table_obj).parent('table').find('thead tr:first th').each(function(){
                    cols += $(this).attr('colspan') ? parseInt($(this).attr('colspan')) : 1;
                });
                $('<tr><td style="height:275px; padding:0" colspan="'+cols+'"><div class="loading_position"><div class="loading_example opacity_7 hide">'
                +'<img class="loading_image" src="' + loading_img + '" title="正在努力加载数据。。。" alt="正在努力加载数据。。。"/></div></div></td></tr>').appendTo($(opts.table_obj));
            }
        }
        if(opts.async){
            $(".loading_example").show();
            //根据url请求数据源
            $.getJSON(opts.url+(opts.url.indexOf('?')<0?"?page=":"page=")+opts.current_page,
              function(data){
                // 2018-11-20, refactor, change to receive JSON response
                //请求的字符串转换为json对象
                // var get_data =  eval("("+data+")");
                var get_data = data;
                //请求的表格数据添加到table对象
                $(opts.table_obj).html(get_data.data);
                total_num = get_data.total_num;
                extends_par = get_data.extends_par;
                if(total_num>=0){
                    draw_link(total_num);
                }
                opts.callback.call(this,extends_par);
                $(".loading_example").hide();
            });
        }else{
            var from = (opts.current_page - 1) * opts.items_per_page + 1;
            var to = from + opts.items_per_page - 1;
            var rows = $(opts.table_obj).find('tr');
            for (var i = 1; i < rows.length; i++) { // i starts from 1 to skip table header row
                if (i < from || i > to)
                    rows[i].style.display = 'none';
                else
                    rows[i].style.display = '';
            }
            total_num = rows.length-1;
            extends_par = '';
            if(total_num>=0){
                draw_link(total_num);
            }
        }

        //计算有多少页数
        function num_pages(total_num){
            return Math.ceil(total_num/opts.items_per_page);
        }

        //根据current_page和num_display_items计算分页条开始和结束页码,返回一个数组
        function get_interval(total_num){
            var num_half = Math.ceil(opts.num_display_items/2);
            var np = num_pages(total_num);
            var upper_limit = np-opts.num_display_items;
            var start = opts.current_page>num_half?Math.max(Math.min(opts.current_page-num_half,upper_limit),1):1;
            var end = opts.current_page>num_half?Math.min(opts.current_page+num_half,np):Math.min(opts.num_display_items,np);
            return [start,end];
        }

        /**
         * 处理请求数据函数
         * @param   page_id              当前显示页数
         * @param   evt                  阻止浏览器冒泡事件
         */
        function page_selected(page_id,evt,total_num){
            opts.current_page = page_id;
            draw_link(total_num);
            var continue_propagation = get_table_data(page_id, panel);
            if(!continue_propagation){
                if(evt.stopPropagation){
                    evt.stopPropagation();
                }else{
                    evt.cancelBubble = true;
                }
            }
            return continue_propagation;
        }

        //将点击页码事件与请求数据关联
        function draw_link(total_num){
            $('#pagination_id').show();
            $('#page_goto').show();
            panel.empty();
            var interval = get_interval(total_num);
            var np = num_pages(total_num);
            //返回page_selected，以获取正确的页码
            var get_clickhandler = function(page_id){
                return function(evt){
                    return page_selected(page_id,evt,total_num);
                }
            }
            //生成页码及其绑定事件
            var append_item = function(page_id,appendopts){
                //计算page_id，以预防错误的page_id
                page_id = page_id<1?1:(page_id<np?page_id:np);
                appendopts = jQuery.extend({text:page_id, classes:""}, appendopts||{});
                if(page_id == opts.current_page){
                    //生成当前分页码
                    var lnk = $("<span class='active btn'>"+(appendopts.text)+"</span>");
                }else{
                    //生成当前页码以外的页码，及绑定事件
                    if(appendopts.classes!='disabled'){
                        var lnk = $("<a class='btn'>"+(appendopts.text)+"</a>")
                            .bind("click",get_clickhandler(page_id))
                            .attr("href",opts.link_to.replace(/__id__/,page_id));
                    }else{
                        var lnk = $("<a class='btn'>"+(appendopts.text)+"</a>")
                    }
                }
                if(appendopts.classes){
                    //为生成的页码添加样式
                    lnk.addClass(appendopts.classes);
                }
                panel.append(lnk);
            }
            //创建上一页链接
            if(opts.current_page>1){
                append_item(opts.current_page-1,{text:"上一页", classes:"prev"});
            }else{
                append_item(opts.current_page+1,{text:"上一页", classes:"disabled"});
            }


            if (interval[1] - interval[0] > 4){
                interval[1] = interval[0] + 4
                }
            //创建中间页码的开始页
            if(interval[0]>0){
                //计算结束页码,"2"表示省略号后显示最后两页或者省略号前显示前两页
                var end = Math.min(2,interval[0]);
                for(var i=1; i<end; i++){
                    append_item(i);
                }
                //如果中间开始页码大于2，则在第二页后添加省略页码
                if(interval[0]>2){
                    $("<span class='btn cursor_default'>...</span>").appendTo(panel);
                }
            }
            //生成中间页码
            for(var i=interval[0];i<interval[1];i++){
                append_item(i);
            }
            //创建中间页码的结束页
            if(interval[1]<np+1){
                if(np-2>interval[1]){
                    $("<span class='btn cursor_default'>...</span>").appendTo(panel);
                }
                var begin = Math.max(np-2,interval[1]);
                //添加中间页码
                for(var i=begin; i<np+1; i++){
                    append_item(i);
                }
            }
            //创建下一页链接
            if(opts.current_page<np){
                append_item(opts.current_page+1,{text:"下一页", classes:"next"});
            }else{
                append_item(opts.current_page+1,{text:"下一页", classes:"disabled"});
            }

            if (total_num == 0){
                $('#pagination_id').hide();
                $('#page_goto').hide();
            }
        }

        //get_table_data(current_page,this);
    });


    /**
     * 生成table数据的回调函数
     * @param   page_index                当前页数
     * @param   panel                     添加分页导航的对象

     */
    function get_table_data(page_index,contain_obj){
        if(is_select){
            //添加自定义每页显示多少条的select选择框
            if(!$("#select_pagination").attr('class')){
                //初次请求数据时，添加分页条数select选择框
                $('<label>每页显示行</label>'+
                    '<select id="select_pagination" name="items_per_page" class="span1">'+
                    '<option> </option><option>5</option><option>10</option><option>15</option>'+
                    '<option>20</option><option>25</option><option>30</option></select>').insertBefore(panel);
            }
        }
        //每页显示记录条数
        var items_per_page=!parseInt($("#select_pagination").val())?(!opts.items_per_page?10:opts.items_per_page):parseInt($("#select_pagination").val());
        var max_elem=Math.min((page_index+1)*items_per_page,total_num)-1;
        if(!$('#loading_example')[0]){
            if($(opts.table_obj).get(0).tagName=="TBODY"){
                $(opts.table_obj).parent('table').addClass('loading_position');
                var cols=0;
                $(opts.table_obj).parent('table').find('thead tr:first th').each(function(){
                    cols += $(this).attr('colspan') ? parseInt($(this).attr('colspan')) : 1;
                });
                $('<td style="padding:0" colspan="'+cols+
                    '"><div class="loading_example opacity_7" style="top:'+$(opts.table_obj).parent('table').find('thead').height()
                    +'px; height:'+$(opts.table_obj).height()+'px"><img class="loading_image" src="' + loading_img + '" title="正在努力加载数据。。。" alt="正在努力加载数据。。。"/></div></td>').appendTo($(opts.table_obj));
            }
        }
        if(opts.async){
            //根据url请求数据源
            $(".loading_example").show();
            $.get(opts.url+(opts.url.indexOf('?')<0?"?page=":"page=")+page_index,function(data){
                //请求的字符串转换为json对象
                var get_data =  eval("("+data+")");
                //请求的表格数据添加到table对象
                $(opts.table_obj).html(get_data.data);
                total_num = get_data.total_num;
                extends_par = get_data.extends_par;
                opts.callback.call(this,extends_par);
                $(".loading_example").hide();
            });
        }else{
            var from = (page_index - 1) * items_per_page + 1;
            var to = from + items_per_page - 1;
            var rows = $(opts.table_obj).find('tr');
            for (var i = 1; i < rows.length; i++) { // i starts from 1 to skip table header row
                if (i < from || i > to)
                    rows[i].style.display = 'none';
                else
                    rows[i].style.display = '';
            }
            total_num = rows.length-1;
            extends_par = '';
        }
        return false;
    }
}
