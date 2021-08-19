(function (win, doc) {
  function DOM(elements) {
    if (!(this instanceof DOM)) {
      return new DOM(elements);
    }

    this.element = this.getDOMElements(elements);
  
  }

  DOM.prototype.getDOMElements = function (elements) {
    return document.querySelectorAll(elements);
  };

  DOM.isArray = function (param) {
    return Object.prototype.toString.call(param) === "[object Array]";
  };

  DOM.isObject = function (param) {
    return Object.prototype.toString.call(param) === "[object Object]";
  };

  DOM.isFunction = function (param) {
    return Object.prototype.toString.call(param) === "[object Function]";
  };

  DOM.isNumber = function (param) {
    return Object.prototype.toString.call(param) === "[object Number]";
  };

  DOM.isString = function (param) {
    return Object.prototype.toString.call(param) === "[object String]";
  };

  DOM.isBoolean = function (param) {
    return Object.prototype.toString.call(param) === "[object Boolean]";
  };

  DOM.isNull = function (param) {
    return (
      Object.prototype.toString.call(param) === "[object Null]" ||
      Object.prototype.toString.call(param) === "[object Undifined]"
    );
  };

  DOM.prototype.on = function (eventType, callback) {
    Array.prototype.forEach.call(this.element, function (element) {
      element.addEventListener(eventType, callback);
    });
  };

  DOM.prototype.onChilds = function (eventType, callback) {
    Array.prototype.forEach.call(this.element, function (element) {
      element.addEventListener(eventType, callback);
    });
  };

  DOM.prototype.off = function (eventType, callback) {
    Array.prototype.forEach.call(this.element, function (element) {
      element.removeEventListener(eventType, callback);
    });
  };

  DOM.prototype.get = function (index) {
    if (!index) return this.element[0];
    return this.element[index];
  };

  DOM.prototype.forEach = function () {
    return Array.prototype.forEach.apply(this.element, arguments);
  };

  DOM.prototype.map = function () {
    return Array.prototype.map.apply(this.element, arguments);
  };

  DOM.prototype.reduce = function () {
    return Array.prototype.forEach.apply(this.element, arguments);
  };

  DOM.prototype.reduceRight = function () {
    return Array.prototype.forEach.apply(this.element, arguments);
  };

  DOM.prototype.every = function () {
    return Array.prototype.forEach.apply(this.element, arguments);
  };

  DOM.prototype.some = function () {
    return Array.prototype.forEach.apply(this.element, arguments);
  };

  win.DOM = DOM;
})(window, document);
