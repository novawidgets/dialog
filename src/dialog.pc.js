(function(root, factory) {
if(typeof exports === 'object') {
module.exports = factory();
} else if(typeof define === 'function' && define.amd) {
define(['module/widget/1.0.2/widget', 'module/doT/1.0.1/doT'], factory);
} else {
root['Dialog'] = factory();
}
})(this, function(Widget, doT) {
    var template = '<div class="dialog">                 ' +
                   '    {{? it.get("title")}}                  ' +
                   '    <div class="dialog-hd">          ' +
                   '        {{= it.get("title")}}              ' +
                   '        <a class="fa fa-times close"></a> ' +
                   '    </div>                          ' +
                   '    {{?}}                           ' +
                   '    <div class="dialog-bd"></div>    ' +
                   '</div>                              ';

    var mask;

    // 支持度: IE7+
    var Dialog = Widget.extend({
        attrs: {
            title: '',                      // 标题，若不传，则header隐藏
            body: '',                       // DOM, HTML
            selectors: {
                confirmBtn: '.dialog-confirm',      // 确认按钮
                cancelBtn: '.dialog-cancel'         // 关闭按钮
            },
            showMask: true,
            className: ''                           // 给dialog容器添加的class
        },

         setup: function() {
            var me = this,
                config = this.get(),
                tmpl = doT.template(template),
                html = tmpl(this);

            this.$element = $(html);
            this.element = this.$element[0];
            config.body.trim && (config.body = config.body.trim());
            this.$element.find('.dialog-bd').append($(config.body));

            // 初始化mask
            if(config.showMask) {
                if(!mask) {
                    mask = $('<div class="dialog-mask" data-count="0"></div>');
                }
                this.$mask = mask;
            }

            $(document.body).append(this.$element);
            this.$mask && $(document.body).append(this.$mask);

            this._bindEvents();

            this.$element.addClass(this.get('className'));

        },

        _bindEvents: function() {
            var me = this,
                selectors = this.get('selectors');

            this.$element.delegate(selectors.confirmBtn, 'click', function(e) {
                e.preventDefault();
                me.trigger('confirm');
            });

            this.$element.delegate(selectors.cancelBtn + ' , .close', 'click', function(e) {
                e.preventDefault();
                me.hide();
            });
        },

        _centerDialog: function() {
            var header = this.$element.find('.dialog-hd');
            header.css('width', 0);
            var w = this.$element.width();
            var h = this.$element.height();
            this.$element.css({
                'margin-left': '-' + w / 2 + 'px',
                'margin-top': '-' + h / 2 + 'px'
            });
            header.css('width', w-30); // hack: fix ie7 bug
        },

        show: function() {
            this.$element.show();
            if(this.$mask) {
                var c = parseInt(this.$mask.data('count'));
                this.$mask.data('count', ++c);
                this.$mask.show();
            }
            if(!this.alreadyCentered) {
                this._centerDialog();
                this.alreadyCentered = true;
            }
        },

        hide: function() {
            this.$element.hide();
            if(this.$mask) {
                var c = parseInt(this.$mask.data('count'));
                this.$mask.data('count', --c);
                if(c <= 0) {
                    this.$mask.hide();
                }
            }
        },

        refresh: function() {
            this._centerDialog();
        }

    });


 var template2 = '<div class="dialog-type-{{= it.type}}">                                 '+
                    '    <div class="msg-wrap">                            '+
                    '        <i class="fa fa-exclamation-triangle icon icon-warn"></i>         '+
                    '        <i class="fa fa-exclamation-triangle icon icon-confirm"></i>         '+
                    '        <span>{{= it.msg}}</span>                          '+
                    '    </div>                                                 '+
                    '    <div class="btn-wrap">                                                  '+
                    '        <a href="###" class="btn btn-primary dialog-confirm">确定</a>     '+
                    '        <a href="###" class="btn btn-default dialog-cancel">取消</a>     '+
                    '    </div>                                                 '+
                    '</div>                                                     ';
    var tmpl = doT.template(template2);

    var commonDialog = new Dialog({
        body: '',
        className: 'public-dialog'
    });


    $.extend(Dialog, {
        alert: function(msg, callback) {
            Dialog._show('alert', msg);
            commonDialog.$element.find('.dialog-confirm').one('click', function(e) {
                e.preventDefault();
                commonDialog.hide();
                callback && callback();
            });
        },

        warn: function(msg, callback) {
            Dialog._show('warn', msg);
            commonDialog.$element.find('.dialog-confirm').one('click', function(e) {
                e.preventDefault();
                commonDialog.hide();
                callback && callback();
            });
        },

        confirm: function(msg, callback) {
            Dialog._show('confirm', msg);
            commonDialog.$element.find('.dialog-confirm').one('click', function(e) {
                e.preventDefault();
                commonDialog.hide();
                callback && callback(true);
            });
            commonDialog.$element.find('.dialog-cancel').one('click', function(e) {
                e.preventDefault();
                commonDialog.hide();
                callback && callback(false);
            });
        },

        _show: function(type, msg) {
            var dialogBody = tmpl({
                type: type,
                msg: msg
            });
            commonDialog.$element.find('.dialog-bd').html(dialogBody);
            commonDialog.show();
            commonDialog.$element.find('.btn-primary').focus();
        }
    });

    window.Dialog = Dialog;
    return Dialog;
});





