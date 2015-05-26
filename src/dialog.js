(function() {

    var Dialog = Widget.extend({
        attrs: {
            template:
                '<div class="dialog">\
                    <div class="bd"></div>\
                </div>',
            body: '',                               // DOM or HTML
            selectors: {
                confirmBtn: '.dialog-confirm',      // 确认按钮
                cancelBtn: '.dialog-cancel'         // 关闭按钮
            },
            className: ''                           // 给dialog容器添加的class
        },

         setup: function() {
            var me = this,
                config = this.get(),
                html = config.template;

            this.$element = $(html);
            this.element = this.$element[0];
            config.body.trim && (config.body = config.body.trim());
            this.$element.find('.bd').append($(config.body));

            // 初始化mask
            this.$mask = $('<div class="dialog-mask"></div>');

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
                me.hide();
                me._deferred.resolve(true);
            });

            this.$element.delegate(selectors.cancelBtn + ' , .close', 'click', function(e) {
                e.preventDefault();
                me.hide();
                me._deferred.resolve();
            });
        },

        show: function() {
            this._deferred = $.Deferred();

            this.$element.show();
            this._center();
            this.$mask.show();

            return this._deferred;
        },

        hide: function() {
            this.$element.hide();
            this.$mask.hide();
        },

        refresh: function() {
            this._center();
        },

        /* use js to centerize the dialog to support some 2.3 devices*/
        _center: function() {
            var width = this.$element.width();
            var height = this.$element.height();
            this.$element.css({
                'margin-left': '-' + (width/2) + 'px',
                'margin-top': '-' + (height/2) + 'px'
            });
        }

    });



    var commonDialog = new Dialog({
        template:
            '<div class="dialog">\
                <div class="bd"></div>\
                <div class="ft">\
                    <a href="###" class="dialog-cancel dialog-btn">取消</a>\
                    <a href="###" class="dialog-confirm dialog-btn">确定</a>\
                </div>\
            </div>',
        body: '',
        className: 'public-dialog'
    });

    var toastDialog;
    var prevType;

    $.extend(Dialog, {
        alert: function(msg) {
            return Dialog._show('alert', msg);
        },

        confirm: function(msg) {
            return Dialog._show('confirm', msg);
        },

        toast: function(msg) {
            if(!toastDialog) {
                toastDialog = $('<div class="dialog dialog-type-toast anim-fadeout"></div>').appendTo(document.body).show();
            }
            toastDialog.html(msg).remove().appendTo(document.body).show();

            //  centerize
            var width = toastDialog.width();
            var height = toastDialog.height();
            toastDialog.css({
                'margin-left': '-' + (width/2) + 'px',
                'margin-top': '-' + (height/2) + 'px'
            });
        },

        _show: function(type, msg) {
            if(typeof msg === 'string') {
                commonDialog.$element.find('.bd').html(msg);
            } else {
                commonDialog.$element.find('.bd').html('').append($(msg));
            }
            prevType && commonDialog.$element.removeClass('dialog-type-' + prevType);
            commonDialog.$element.addClass('dialog-type-' + type);
            prevType = type;
            return commonDialog.show();
        }
    });

    this.Dialog = Dialog;
})();





