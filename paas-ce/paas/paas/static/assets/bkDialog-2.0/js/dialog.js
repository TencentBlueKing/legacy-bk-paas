/*
 *  bkDialog v1.0
 *  author：蓝鲸智云
 *  Copyright (c) 2012-2017 Tencent BlueKing. All Rights Reserved.
 */

(function(global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() : typeof define === 'function' && define.amd ? define(factory) : (global.bkDialog = factory());
})(this, (function() {
    'use strict';

    /**
     *  编译DOM节点字符串
     *  @param html {String} 拼接的DOM字符串
     *  @return DOM {DOMNode} DOM节点
     */
    var _compile = function(html) {
        var temp = document.createElement('div'),
            children = null,
            fragment = document.createDocumentFragment();

        temp.innerHTML = html;
        children = temp.childNodes;

        for(var i = 0, length = children.length; i < length; i++) {
            fragment.appendChild(children[i].cloneNode(true));
        }

        return fragment;
    }

    /**
     *  插件的构造函数
     *  @param 用户自定义的参数
     */
    function bkDialog(options) {
        var opts = options || {};

        this.type = opts.type || 'default';                  // 弹窗的类型, 可选的值有success, error, warning, loading, dialog, default
        this.width = opts.width || 400;                     // 弹窗的宽度
        this.title = opts.title || '确定执行该操作?';        // 弹窗的title
        this.content = opts.content === false ? false : (opts.content || '欢迎使用 bkDialog 组件！');    // 弹窗的内容
        this.icon = opts.icon || false;                     // success, error, warning, loading四种类型时，自定义的图标
        this.hasHeader = opts.hasHeader === false ? false : true;     // 是否显示头部
        this.statusOpts = opts.statusOpts || {};            // 使用内置状态时的设置，可用的key有title，subTitle
        this.padding = opts.padding || (opts.padding === 0 ? 0 : false);               // 自定义dialog-body的padding值
        this.closeIcon = opts.closeIcon === false ? false : true;     // 是否有关闭图标
        this.style = opts.style || 'primary';                      // 插件的颜色风格
        this.confirm = opts.confirm || '确定';              // 确定按钮的文字
        this.cancel = opts.cancel || '取消';                // 取消按钮的文字
        this.quickClose = opts.quickClose === false ? false : true;          // 是否允许点击遮罩关闭dialog
        this.confirmFn = opts.confirmFn || function() {};   // 确定的回调函数
        this.cancelFn = opts.cancelFn || function() {};     // 取消的回调函数
        this.onShow = opts.onShow || function() {};         // 打开dialog时的回调
        this.onClose = opts.onClose || function() {};       // 关闭dialog时的回调

        _init.call(this);
    }

    /**
     *  初始化函数
     */
    var _init = function() {
        _initStyle.call(this);
    }

    /**
     *  初始化样式
     */
    var _initStyle = function() {
        var type = this.type,
            isDefaultType = (type === 'loading' || type === 'error' || type === 'success' || type === 'warning' ? true : false),
            statusOpts = isDefaultType ? this.statusOpts : {},
            _this = this,
            isStyle = this.style.indexOf('#') === 0;
        var html = '',
            defaultDOM = {
                "title": '',
                "subTitle": ''
            },
            body = '',
            icon = '';

        switch(type) {
            case 'loading':
                defaultDOM.title = 'loading';
                defaultDOM.subTitle = '请稍等...';
                icon = this.icon ? (this.icon.match(/^\<img/) ? this.icon : '<p><i class="bk-icon icon-'+this.icon+' bk-dialog-mark bk-dialog-loading"></i></p>') : '<img src="/static/img/loading.gif" alt="loading" class="bk-dialog-mark bk-dialog-loading">';
                break;
            case 'error':
                defaultDOM.title = '添加用户失败';
                defaultDOM.subTitle = '此窗口<span class="bk-dialog-error-text">3s</span>后关闭';
                icon = this.icon || 'close';
                break;
            case 'success':
                defaultDOM.title = '添加用户成功';
                defaultDOM.subTitle = '<a href="javascript:;" class="bk-dialog-primary-text">继续添加 >></a>';
                icon = this.icon || 'check-1';
                break;
            case 'warning':
                defaultDOM.title = '此操作存在风险';
                icon = this.icon || 'exclamation';
        }

        if(isDefaultType) {
            body += '<div class="bk-dialog-row">'+
                      (type === 'loading' ? icon : '<p><i class="bk-icon icon-'+icon+' bk-dialog-mark bk-dialog-'+type+'"></i></p>')+
                    '</div>'+
                    '<h3 class="bk-dialog-title bk-dialog-row">' + (statusOpts.title || defaultDOM.title) + '</h3>'+
                    (statusOpts.subTitle || defaultDOM.subTitle ? ('<h5 class="bk-dialog-subtitle bk-dialog-row">' + (statusOpts.subTitle || defaultDOM.subTitle) + '</h5>') : '');
        }
        else {
            body += this.content === false ? '' : this.content;
        }

        html = '<div class="bk-dialog hidden" id="bkDialog">'+
                  '<div class="bk-dialog-wrapper">'+
                    '<div class="bk-dialog-position">'+
                      '<div class="bk-dialog-style" style="width: '+this.width+'px;">'+
                        '<div class="bk-dialog-tool">'+
                          (this.closeIcon ? ('<i class="bk-dialog-close bk-icon icon-close" id="bkDialogClose"></i>') : '')+
                        '</div>'+
                        (isDefaultType ? '' : (this.hasHeader ? ('<div class="bk-dialog-header">'+
                            '<h3 class="bk-dialog-title">' + this.title + '</h3>'+
                        '</div>') : ''))+
                        (this.content === false ? '<p style="padding-top: 15px;"></p>' : ('<div class="bk-dialog-body ' + (isDefaultType ? 'bk-dialog-default-status' : '') + '" style="'+(this.padding === false ? '' : ('padding: '+this.padding+'px; '))+'">'+
                          body+
                        '</div>'))+
                        (isDefaultType && type !== 'warning' ? '' : ('<div class="bk-dialog-footer '+(type === 'dialog' ? 'bk-dialog-outer' : '')+'">'+
                            '<button type="button" name="confirm" class="bk-dialog-btn bk-dialog-btn-confirm '+(isStyle ? '' : ('bk-btn-' + this.style))+'" style="'+(isStyle ? ('background-color: ' + this.style + '; border-color: ' + this.style + '; color: #fff;') : '')+'" id="bkDialogConfirm">'+this.confirm+'</button>'+
                            '<button type="button" name="cancel" class="bk-dialog-btn bk-dialog-btn-cancel" id="bkDialogCancel">'+this.cancel+'</button>'+
                        '</div>'))+
                      '</div>'+
                    '</div>'+
                  '</div>'+
                '</div>';

        this._html = html;

        document.body.appendChild(_compile(this._html));

        setTimeout(function() {
          _initEvent.call(_this);
        }, 10);
    }

    /**
     *  初始化函数绑定
     */
    var _initEvent = function() {
      var $root = document.querySelector('#bkDialog'),
          confirmBtn = $root.querySelector('#bkDialogConfirm'),
          cancelBtn = $root.querySelector('#bkDialogCancel'),
          closeIcon = $root.querySelector('#bkDialogClose'),
          _this = this;


      $root.addEventListener('click', function(e) {
        if(_this.quickClose && e.target.getAttribute('id') == 'bkDialog') {
          _close.call(_this);
        }
      }, false);

      if(confirmBtn) {
        confirmBtn.addEventListener('click', function(e) {
            _this.confirmFn && _this.confirmFn(_this);
            _close.call(_this);
        }, false);
      }

      if(cancelBtn) {
        cancelBtn.addEventListener('click', function(e) {
            _this.cancelFn && _this.cancelFn(_this);
            _close.call(_this);
        }, false);
      }

      if(closeIcon) {
        closeIcon.addEventListener('click', function(e) {
            _close.call(_this);
        }, false);
      }
    }

    /**
     *  关闭dialog
     */
    var _close = function() {
      var root = document.querySelector('#bkDialog');

      this.onClose && this.onClose(this);
      root.parentNode.removeChild(root);
    }

    // 外部API
    bkDialog.prototype.show = function() {
      var _this = this,
          root = document.querySelector('#bkDialog');

      if(!root) {
        return;
      }

      setTimeout(function() {
        root.className = root.className.replace('hidden', '');
        this.onShow && this.onShow(this);
      }, 0);
    }

    bkDialog.prototype.close = function() {
      document.querySelector('#bkDialog').className += 'hidden';
    }

    bkDialog.prototype.remove = function() {
      this.close();
      _close.call(this);
    }

    bkDialog.prototype.setTitle = function(text) {
      document.querySelector('#bkDialog .bk-dialog-header > .bk-dialog-title').innerText = text;
    }

    bkDialog.prototype.setContent = function(html) {
      document.querySelector('#bkDialog .bk-dialog-body').innerHTML = html;
    }

    bkDialog.prototype.setWidth = function(num) {
      document.querySelector('#bkDialog .bk-dialog-wrapper').style.width = num.toString() + 'px';
    }

    return bkDialog;
}));
