/*
 * sFlow v1.0 
 */
;(function($){
    $.fn.flowList=function(options){
        var defaults={
            gap : 60 ,
            vGap : 30 ,
            format : function (data,i){
               return '<li class="flow-box '+ data[i].addClass +'">'+
                         '<div class="flow-text" title="'+ data[i].title +'">'+ data[i].text +'</div>'+
                         '<div class="flow-arrow"><div class="'+data[i].arrowClass+'"></div></div>'+
                      '</li>'; 
            }
        }
        var options=$.extend({},defaults,options);
        //第一个空对象{}可以不写,写成(defaults,options)
        var target = this;
        var flowLi,
            len ,
            parentW ,
            w  ,
            h  ,
            line  ,
            tag ,
            /* posArr = [ [left,top ,direct ],... ]
             * parms 存储li的left、top和奇偶行
             */
            posArr ;


        target.each(function (){
            var that=$(this);
            init(that);
        });
        $(window).resize(function(event) {
            target.each(function (){
                var that=$(this);
                init(that);
            });
        });

        function init(that){
            var flowList=that;
            if(options.url){
                $.ajax({
                    url: options.url ,
                    type: 'GET',
                    dataType: 'json',
                    success:function (rep){
                        if (!flowList.attr('finished')) {
                            var data = rep.data;
                            flowList.empty();
                            for (var i = 0; i < data.length; i++) {
                                var liItem=options.format(data,i);
                                flowList.append(liItem);                      
                            };
                            flowList.attr('finished',true);
                        };
                        render();
                        getMaxHeight();
                    }
                })
            }else{
                render();
            }

            
            // 变量
            function parms(){
                flowLi = flowList.find('>li') ,
                len = flowLi.length ,
                parentW = flowList.parent().width() ,
                w = flowLi.eq(0).outerWidth() ,
                h = flowLi.eq(0).outerHeight() ,
                line = Math.floor((parentW+options.gap)/(w+options.gap)) ,
                tag = false,
                /* posArr = [ [left,top ,direct ],... ]
                 * parms 存储li的left、top和奇偶行
                 */
                posArr = [];
            }
            // 布局
            function layout(){
                // 初始化 flowList
                flowList.css({ width: parentW }); 
                flowLi.last().find('.flow-arrow').remove();
                flowLi.removeClass('odd').removeClass('even').removeClass('last');
                // 计算每个li的 left、top和方向
                for (var i = 0; i < len ; i++) {
                    if (i%line==0) {
                        tag=!tag;
                    }   
                    if (!tag) {
                        posArr.push( [ ((line-1)-(i%line))*(w+options.gap) , (Math.floor(i/line))*(h+options.vGap) , "odd" ] );
                    }else{
                        posArr.push( [ (i%line)*(w+options.gap) , (Math.floor(i/line))*(h+options.vGap) , "even" ] );
                    }
                }
                // 布局转换
                for (var i = 0; i < len ; i++) {
                   flowLi.eq(i).css({
                       position : 'absolute',
                       left: posArr[i][0] ,
                       top: posArr[i][1] ,
                       margin : 0 
                   }).attr('even-odd', posArr[i][2] ).addClass( posArr[i][2] );
                };
                // 每行末尾添加last类
                flowList.find('.odd').prev('.even').addClass('last');
                flowList.find('.even').prev('.odd').addClass('last');
            }
            // 设置箭头位置
            function setArrow(){
                var borderWidth = flowList.find('.flow-box').css('border-right-width');
                flowLi.filter('.last').find('.flow-arrow').removeAttr('style');
                flowLi.filter('.last').find('.flow-arrow').css({
                    'height': options.vGap,
                    'width': options.vGap,
                    'margin-top': borderWidth
                });
                flowLi.filter('.even:not(.last)').find('.flow-arrow').css({
                    'right' : -options.gap - parseInt(borderWidth),
                    'left' : 'auto' ,
                    'width' : options.gap
                });
                flowLi.filter('.odd:not(.last)').find('.flow-arrow').css({
                    'right' : 'auto' ,
                    'left' : -options.gap - parseInt(borderWidth),
                    'width' : options.gap
                });                
            }
            // 设置父级的高度
            function setHeight(){
                flowList.css({
                    width:  len > line-1 ? posArr[line-1][0]+w : posArr[len-1][0]+w ,
                    height: posArr[len-1][1]+h ,
                    visibility : "visible"
                });                
            }
            // 渲染
            function render(){
                parms();
                layout();
                setArrow();
                setHeight();
            }
            function getMaxHeight(){
                var maxHeight = -1;
                var heightArr = [];

                flowList.find('.flow-box').each(function(index, el) {
                    if ($(this).height()>maxHeight) {
                        maxHeight = $(this).outerHeight();
                    };
                });
                flowList.find('.flow-box').css('height', maxHeight);
            }

        };
    }

})(jQuery);