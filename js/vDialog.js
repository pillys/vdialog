(function(window, undefined) {
  function VDialog(options) {
    this.options = $.extend({
      title: '提示信息',
      content: '',
      okVal: '确定',
      cancelVal: '取消'
    }, options);
    this.init();
    return this;
  }
  VDialog.prototype._init = function() {
    var that = this,
      html = '<div class="vdialog">\
      <div class="vd-header">\
        <div class="vd-title"></div>\
        <a class="vd-close" href="javascript:;">&times;</a>\
      </div>\
      <div class="vd-content"></div>\
      <div class="vd-footer"></div>\
    </div>';
    html = $(html);
    // 缓存 DOM
    this.DOM = {
      wrap: html,
      header: html.find('.vd-header'),
      title: html.find('.vd-header .vd-title'),
      close: html.find('.vd-header .vd-close'),
      content: html.find('.vd-content'),
      footer: html.find('.vd-footer')
    };
    // 关闭事件
    this.DOM.close.on('click', function() {
      that.close();
    });
    // 确定按钮
    if (this.options.ok !== undefined) {
      this.ok();
    }
    // 取消按钮
    if (this.options.cancel !== undefined) {
      this.cancel();
    }
    if (this.options.close !== undefined) {
      this.close(this.options.close);
    }
    // 标题
    this.title(this.options.title);
    // 创建 DOM
    this.DOM.wrap.appendTo('body');

    // 内容，需要放到创建 DOM 之后
    this.content(this.options.content);

    this.inited = true;
    return this;
  }
  VDialog.prototype.init = function(fn) {
    if (!this.inited) {
      this._init();
    }
    if (fn !== undefined) {
      this.options.init = fn;
    }
    this.options.init && this.options.init();
    return this;
  };
  VDialog.prototype.title = function(title) {
    var toggleName = 'es-header-no-title';
    if (title === false) {
      this.DOM.header.addClass(toggleName);
      this.DOM.title.hide();
    } else {
      this.DOM.header.removeClass(toggleName);
      this.DOM.title.html(title);
    }
    return this;
  };
  VDialog.prototype.content = function(content) {
    if (content !== undefined) {
      this.DOM.content.html(content);
      this.position();
      return this;
    } else {
      return this.DOM.content;
    }
  };
  VDialog.prototype.ok = function(fn) {
    var that = this;
    that.button({
      className: 'ok',
      text: that.options.okVal
    }, function() {
      if (fn !== undefined) {
        that.options.ok = fn;
      }
      if (that.options.ok === true || that.options.ok && that.options.ok() !== false) {
        that.close();
      }
    });
  };
  VDialog.prototype.cancel = function(fn) {
    var that = this;
    that.button({
      className: 'cancel',
      text: that.options.cancelVal
    }, function() {
      if (fn !== undefined) {
        that.options.cancel = fn;
      }
      if (that.options.cancel === true || that.options.cancel && that.options.cancel() !== false) {
        that.close();
      }
    });
    return this;
  };
  VDialog.prototype.button = function(button, fn) {
    var that = this;
    button = $.extend({
      className: 'ok',
      text: '确定'
    }, button);
    var button = $('<a class="vd-btn vd-btn-' + button.className + '" href="javascript:;">' + button.text + '</a>');
    this.DOM.footer.prepend(button);
    fn && button.on('click', fn);
    return this;
  };
  VDialog.prototype.close = function(fn) {
    if (fn !== undefined) {
      this.options.close = fn;
      if (this.options.close === false) {
        this.DOM.close.hide();
      } else {
        this.DOM.close.show();
      }
    } else {
      this.DOM.wrap.remove();
      if (typeof this.options.close === 'function') {
        this.options.close();
      }
    }
    return this;
  };
  VDialog.prototype.position = function() {
    var left, top, scrollSize = {
        left: document.documentElement.scrollLeft,
        top: document.documentElement.scrollTop
      },
      screenSize = {
        width: document.documentElement.clientWidth,
        height: document.documentElement.clientHeight
      },
      dialogSize = {
        width: this.DOM.wrap.outerWidth(),
        height: this.DOM.wrap.outerHeight()
      };
    left = scrollSize.left + Math.max(0, (screenSize.width - dialogSize.width) / 2);
    top = scrollSize.top + Math.max(10, (screenSize.height - dialogSize.height) / 3);
    this.DOM.wrap.css({
      left: left + 'px',
      top: top + 'px'
    });
    return this;
  };

  window.vDialog = function(options) {
    return new VDialog(options);
  };
})(window);