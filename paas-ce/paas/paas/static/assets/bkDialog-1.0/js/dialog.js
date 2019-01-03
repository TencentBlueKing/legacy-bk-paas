(function(){
    function isString(str){
        return (typeof str=='string') && str.constructor == String;
    }
    function dialog(options){
        var defaultOptions = {
            id: '',
            width: 'auto',
            title: '',
            lock: false,
            fixed: false,
            zIndex: 1024,
            quickClose: false,
            content: '',
            okVal: '确定',
            ok: null,
            cancelVal: '取消',
            cancel: null,
            onshow: null,
            onclose: null
        };
        var prev, next, parent, width, height, display, contentDom;
        var dialogOptions = $.extend({}, defaultOptions, options);
        var dialogNode = null;

        function _init(){

            var _html = [
                        '<div class="bk-dialog" style="display:none;" id="'+ dialogOptions.id +'">',
                        '<div class="bk-dialog-mask"></div>',
                        '<div class="bk-dialog-box" style="width:'+ dialogOptions.width +'px; z-index:'+ dialogOptions.zIndex +'; ">',
                        '    <div class="bk-dialog-header">',
                        '        <strong class="bk-dialog-title">'+ dialogOptions.title +'</strong>',
                        '    </div>',
                        '        <button class="bk-dialog-close">×</button>',
                        '    <div class="bk-dialog-content"></div>',
                        '    <div class="bk-dialog-footer">',
                        '        <button type="button" class="bk-dialog-btn bk-dialog-ok">'+ dialogOptions.okVal +'</button>',
                        '        <button type="button" class="bk-dialog-btn bk-dialog-cancel">'+ dialogOptions.cancelVal +'</button>',
                        '    </div>',
                        '</div>',
                        '</div>'
                        ].join('');

            dialogNode = $(_html);
            if (dialogOptions.content && isString(dialogOptions.content)){
                dialogNode.find('.bk-dialog-content').html(dialogOptions.content);
            }else if(dialogOptions.content.nodeType == 1){
                contentDom = dialogOptions.content;
                display = contentDom.style.display;
                prev = contentDom.previousSibling;
                next = contentDom.nextSibling;
                parent = contentDom.parentNode;
                dialogNode.find('.bk-dialog-content').get(0).appendChild(contentDom);
                contentDom.style.display = 'block';
            }
            if (dialogOptions.id){
                if ($('#'+dialogOptions.id).length){
                    $('#'+dialogOptions.id).remove();
                }
                dialogNode.attr('id', dialogNode.id);
            }
            dialogNode.find('.bk-dialog-close').on('click', function(){
                _remove();
            });

            dialogNode.find('.bk-dialog-ok').on('click', function(){
                if (dialogOptions.ok){
                    if (dialogOptions.ok() === false){
                    }else{
                        _remove();
                    }
                }else{
                    _remove();
                }
            });

            dialogNode.find('.bk-dialog-cancel').on('click', function(){
                dialogOptions.cancel && dialogOptions.cancel();
                _remove();
            });

            _render();
            $('body').append(dialogNode);
        }

        function _render(){
            if (!dialogOptions.ok){
                dialogNode.find('.bk-dialog-ok').remove();
            }
            if (!dialogOptions.cancel){
                dialogNode.find('.bk-dialog-cancel').remove();
            }
            if (dialogOptions.cancel === false){
                dialogNode.find('.bk-dialog-close').remove();
            }
            if (dialogOptions.hideClose){
                dialogNode.find('.bk-dialog-close').remove();
            }
            if (!dialogOptions.title){
                dialogNode.addClass('bk-dialog-no-header').find('.bk-dialog-header').remove();
            }
            if (!dialogOptions.ok && !dialogOptions.cancel){
                dialogNode.find('.bk-dialog-footer').remove();
            }
            if (dialogOptions.fixed){
                dialogNode.find('.bk-dialog-box').css({position: 'fixed'});
            }
            if (dialogOptions.quickClose){
                dialogNode.find('.bk-dialog-mask').show();
                dialogNode.find('.bk-dialog-box').on('click', function(){
                    return false;
                });
                dialogNode.find('.bk-dialog-mask').on('click', function(){
                    _close();
                })
            }
            if (dialogOptions.lock){
                _showModal();
            }else{
                _show();
            }

        }

        function _show(){
            dialogNode.show();
            dialogOptions.onshow && dialogOptions.onshow();
        }

        function _showModal(){
            dialogNode.show();
            dialogNode.find('.bk-dialog-mask').css('opacity', '0.7').show();
            dialogNode.find('.bk-dialog-box').css('position', 'fixed');
            dialogOptions.onshow && dialogOptions.onshow();
        }

        function _close(){
            dialogNode.hide();
            dialogOptions.onclose && dialogOptions.onclose();
        }

        function _remove(){
            dialogNode.remove();
            _elemBack();
            dialogOptions.onclose && dialogOptions.onclose();
        }

        function _content(html){
            dialogNode.find('.bk-dialog-content').html(html);
        }

        function _title(text){
            dialogNode.find('.bk-dialog-title').text(text);
        }

        function _width(width){
            dialogNode.width(width);
        }

        function _height(height){
            dialogNode.height(height);
        }

        function _elemBack(){
            if (contentDom){
                if (prev && prev.parentNode) {
                    prev.parentNode.insertBefore(contentDom, prev.nextSibling);
                } else if (next && prev.parentNode) {
                    next.parentNode.insertBefore(contentDom, next);
                } else if (parent) {
                    parent.appendChild(contentDom);
                };
                contentDom.style.display = display;
            }
        }

        function Dialog(){
            _init();
        }
        Dialog.prototype = {
            show: function(){
                _show();
                return this;
            },
            showModal: function(){
                _showModal();
                return this;
            },
            close: function(){
                _close();
                return this;
            },
            remove: function(){
                _remove();
                return this;
            },
            content: function(html){
                _content(html);
                return this;
            },
            title: function(text){
                _text(text);
                return this;
            },
            width: function(width){
                _width(width);
                return this;
            },
            height: function(height){
                _height(height);
                return this;
            },
            time: function(sec){
                if (sec){
                    setTimeout(function(){
                        _remove();
                    }, sec * 1000);
                }
            }
        };

        return new Dialog();

    }
    window.dialog = dialog;
    var art = {};
    art.dialog = dialog;
    window.art = art;
})();
