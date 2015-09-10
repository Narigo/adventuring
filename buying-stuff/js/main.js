(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      }
      throw TypeError('Uncaught, unspecified "error" event.');
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        len = arguments.length;
        args = new Array(len - 1);
        for (i = 1; i < len; i++)
          args[i - 1] = arguments[i];
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    len = arguments.length;
    args = new Array(len - 1);
    for (i = 1; i < len; i++)
      args[i - 1] = arguments[i];

    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    var m;
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.listenerCount = function(emitter, type) {
  var ret;
  if (!emitter._events || !emitter._events[type])
    ret = 0;
  else if (isFunction(emitter._events[type]))
    ret = 1;
  else
    ret = emitter._events[type].length;
  return ret;
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _mainJsItem = require('../../../main/js/Item');

var _mainJsItem2 = _interopRequireDefault(_mainJsItem);

var _mainJsHtmlElement = require('../../../main/js/HtmlElement');

var _mainJsHtmlElement2 = _interopRequireDefault(_mainJsHtmlElement);

function useCurrentItemOn(item) {
  console.log('UsableItem.useCurrentItemOn: clicked on ' + item.id);
  var itemInUse = (0, _mainJsItem.getItemInUse)();
  if (itemInUse !== null) {
    itemInUse.use(item);
  }
}

var UsableItem = (function (_Item) {
  function UsableItem(id, $element) {
    var _this = this;

    _classCallCheck(this, UsableItem);

    _get(Object.getPrototypeOf(UsableItem.prototype), 'constructor', this).call(this, id, new _mainJsHtmlElement2['default']($element));
    $element.addEventListener('click', function (e) {
      useCurrentItemOn(_this);
      _this.emit('click', e);
    });
  }

  _inherits(UsableItem, _Item);

  return UsableItem;
})(_mainJsItem2['default']);

exports['default'] = UsableItem;
module.exports = exports['default'];

},{"../../../main/js/HtmlElement":8,"../../../main/js/Item":10}],3:[function(require,module,exports){
module.exports={
  "dialog": {
    "minTime": 1000,
    "timePerCharacter": 75
  }
}
},{}],4:[function(require,module,exports){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _mainJsAdventure = require('../../../main/js/Adventure');

var _mainJsAdventure2 = _interopRequireDefault(_mainJsAdventure);

var _mainJsScene = require('../../../main/js/Scene');

var _mainJsScene2 = _interopRequireDefault(_mainJsScene);

var _mainJsInventory = require('../../../main/js/Inventory');

var _mainJsInventory2 = _interopRequireDefault(_mainJsInventory);

var _mainJsDialog = require('../../../main/js/Dialog');

var _mainJsDialog2 = _interopRequireDefault(_mainJsDialog);

var _mainJsHtmlElement = require('../../../main/js/HtmlElement');

var _mainJsHtmlElement2 = _interopRequireDefault(_mainJsHtmlElement);

var _mainJsItem = require('../../../main/js/Item');

var _mainJsItem2 = _interopRequireDefault(_mainJsItem);

var _UsableItem = require('./UsableItem');

var _UsableItem2 = _interopRequireDefault(_UsableItem);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var adventure = new _mainJsAdventure2['default']('My buying adventure');
var inventory = new _mainJsInventory2['default']();
var $inventory = document.getElementById('inventory');
var showDialog = showDialogFactory();

adventure.on('change-scene', function (data) {
  console.log(data);
  if (data.oldScene) {
    var $oldScene = document.getElementById(data.oldScene.background);
    $oldScene.style.display = 'none';
  }
  var $newScene = document.getElementById(data.scene.background);
  $newScene.style.display = 'block';
});

inventory.on('add', function (item) {
  item.$element.$element.parentNode.removeChild(item.$element.$element);
  item.$element.$element.removeEventListener('click');
  $inventory.appendChild(item.$element.$element);

  item.$element.$element.addEventListener('click', useItem(item));

  function useItem(item) {
    return function (e) {
      e.preventDefault();
      e.stopPropagation();
      var itemInUse = (0, _mainJsItem.getItemInUse)();
      if (itemInUse !== null) {
        console.log('using ' + itemInUse.id + ' on inventory item ' + item.id);
        itemInUse.use(item);
        (0, _mainJsItem.unsetItemInUse)();
      } else {
        console.log('using ' + item.id + ' from inventory...');
        (0, _mainJsItem.setItemInUse)(item);
      }
    };
  }
});

inventory.on('remove', function (item) {
  $inventory.removeChild(item.$element.$element);
});

document.addEventListener('click', removeUsing);

var outsideShop = new _mainJsScene2['default']('outside-shop');
var insideShop = new _mainJsScene2['default']('inside-shop');

var $money = document.getElementById('money');
var moneyItem = new _mainJsItem2['default']('money', new _mainJsHtmlElement2['default']($money));
$money.addEventListener('click', pickUpOrUse(moneyItem));

var lessMoney = new _mainJsItem2['default']('lessMoney', new _mainJsHtmlElement2['default'](document.getElementById('lessMoney')));

var $pen = document.getElementById('pen');
var _pen = new _UsableItem2['default']('pen', $pen);

_pen.on('click', function () {
  console.log('clicked on pen, open dialog');
  if (!inventory.contains(_pen)) {
    new _mainJsDialog2['default']({ text: 'I need money to buy this' }).listen(showDialog);
  }
});

moneyItem.on('use', {
  pen: function pen() {
    inventory.add(_pen);
    inventory.remove(moneyItem);
    inventory.add(lessMoney);
    return {
      once: true
    };
  }
});

var $door = document.getElementById('shop');
$door.addEventListener('click', function () {
  adventure.setScene(insideShop);
});

var $doorOut = document.getElementById('table');
$doorOut.addEventListener('click', function () {
  adventure.setScene(outsideShop);
});

adventure.setScene(outsideShop);

function pickUpOrUse(item) {
  return function (e) {
    e.stopPropagation();
    e.preventDefault();
    console.log('clicked on ' + item.id);
    var itemInUse = (0, _mainJsItem.getItemInUse)();
    if (itemInUse !== null) {
      console.log('using ' + itemInUse.id + ' on ' + item.id);
      itemInUse.use(item);
    } else {
      console.log('picking up ' + item.id);
      inventory.add(item);
      item.$element.$element.removeEventListener('click', clickFn);
    }
  };
}

function removeUsing(e) {
  e.preventDefault();
  e.stopPropagation();
  var itemInUse = (0, _mainJsItem.getItemInUse)();
  if (itemInUse !== null) {
    (0, _mainJsItem.unsetItemInUse)();
  }
}

function showDialogFactory() {
  var $dialog = document.getElementById('dialog');

  return function (dialog) {
    $dialog.innerHTML = dialog.text;
    setTimeout(function () {
      $dialog.innerHTML = '';
    }, dialogTime(dialog.text));
  };
}

function dialogTime(text) {
  return Math.max(_config2['default'].dialog.minTime, text.length * _config2['default'].dialog.timePerCharacter);
}

},{"../../../main/js/Adventure":5,"../../../main/js/Dialog":6,"../../../main/js/HtmlElement":8,"../../../main/js/Inventory":9,"../../../main/js/Item":10,"../../../main/js/Scene":11,"./UsableItem":2,"./config":3}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var _SceneJs = require('./Scene.js');

var _SceneJs2 = _interopRequireDefault(_SceneJs);

var Adventure = (function (_EventEmitter) {
  function Adventure(name, initialScene) {
    _classCallCheck(this, Adventure);

    _get(Object.getPrototypeOf(Adventure.prototype), 'constructor', this).call(this);
    this._name = name;
    this.scene = initialScene || null;
  }

  _inherits(Adventure, _EventEmitter);

  _createClass(Adventure, [{
    key: 'name',
    value: function name() {
      return this._name;
    }
  }, {
    key: 'setScene',
    value: function setScene(scene) {
      if (!(scene instanceof _SceneJs2['default'])) {
        throw new Error('Must set to a Scene');
      }

      var oldScene = this.scene;
      this.scene = scene;
      this.emit('change-scene', { oldScene: oldScene, scene: scene });
    }
  }, {
    key: 'currentBackground',
    value: function currentBackground() {
      return this.scene.background;
    }
  }]);

  return Adventure;
})(_events2['default']);

exports['default'] = Adventure;
module.exports = exports['default'];

},{"./Scene.js":11,"events":1}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Dialog = (function () {
  function Dialog(options, nextDialog) {
    _classCallCheck(this, Dialog);

    this.char = options.char;
    if (!options.text) {
      throw new Error('Dialog needs a text');
    }
    this.text = options.text;
    this.replies = options.replies || [];
  }

  _createClass(Dialog, [{
    key: 'listen',
    value: function listen(callback) {
      callback({
        char: this.char,
        text: this.text,
        replies: this.replies
      });

      return this;
    }
  }, {
    key: 'reply',
    value: function reply(num) {
      if (num < 0 || num >= this.replies.length) {
        throw new Error('Unknown reply for dialog');
      }

      return this.replies[num];
    }
  }]);

  return Dialog;
})();

exports['default'] = Dialog;
module.exports = exports['default'];

},{}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Element = (function () {
  function Element($element) {
    _classCallCheck(this, Element);

    this.$element = $element;
  }

  _createClass(Element, [{
    key: "highlight",
    value: function highlight() {}
  }, {
    key: "isHighlighted",
    value: function isHighlighted() {}
  }, {
    key: "stopHighlight",
    value: function stopHighlight() {}
  }]);

  return Element;
})();

exports["default"] = Element;
module.exports = exports["default"];

},{}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _Element2 = require('./Element');

var _Element3 = _interopRequireDefault(_Element2);

var HtmlElement = (function (_Element) {
  function HtmlElement($element) {
    _classCallCheck(this, HtmlElement);

    _get(Object.getPrototypeOf(HtmlElement.prototype), 'constructor', this).call(this, $element);
    if (!($element instanceof HTMLElement)) {
      throw new Error('need HTML element to construct an element');
    }
  }

  _inherits(HtmlElement, _Element);

  _createClass(HtmlElement, [{
    key: 'highlight',
    value: function highlight() {
      return this.$element.classList.add('highlight');
    }
  }, {
    key: 'isHighlighted',
    value: function isHighlighted() {
      return this.$element.classList.contains('highlight');
    }
  }, {
    key: 'stopHighlight',
    value: function stopHighlight() {
      return this.$element.classList.remove('highlight');
    }
  }]);

  return HtmlElement;
})(_Element3['default']);

exports['default'] = HtmlElement;
module.exports = exports['default'];

},{"./Element":7}],9:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var Inventory = (function (_EventEmitter) {
  function Inventory() {
    _classCallCheck(this, Inventory);

    _get(Object.getPrototypeOf(Inventory.prototype), 'constructor', this).call(this);
    this.items = [];
  }

  _inherits(Inventory, _EventEmitter);

  _createClass(Inventory, [{
    key: 'add',
    value: function add(item) {
      this.items.push(item);
      this.emit('add', item);
    }
  }, {
    key: 'list',
    value: function list() {
      return this.items;
    }
  }, {
    key: 'remove',
    value: function remove(item) {
      this.items.splice(this.items.indexOf(item), 1);
      this.emit('remove', item);
    }
  }, {
    key: 'contains',
    value: function contains(item) {
      return this.items.indexOf(item) >= 0;
    }
  }]);

  return Inventory;
})(_events2['default']);

module.exports = Inventory;

},{"events":1}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

exports.getItemInUse = getItemInUse;
exports.setItemInUse = setItemInUse;
exports.unsetItemInUse = unsetItemInUse;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var _Element = require('./Element');

var _Element2 = _interopRequireDefault(_Element);

var adventure = {
  items: {}
};

var itemInUse = null;

var Item = (function (_EventEmitter) {
  function Item(id, $element) {
    _classCallCheck(this, Item);

    _get(Object.getPrototypeOf(Item.prototype), 'constructor', this).call(this);
    if ($element && !($element instanceof _Element2['default'])) {
      throw new Error('Item needs an Element to work with');
    }
    this.id = id;
    this.$element = $element;
    this.handlers = {};

    adventure.items[id] = this;
  }

  _inherits(Item, _EventEmitter);

  _createClass(Item, [{
    key: 'highlight',
    value: function highlight() {
      this.$element.highlight();
    }
  }, {
    key: 'stopHighlight',
    value: function stopHighlight() {
      this.$element.stopHighlight();
    }
  }, {
    key: 'on',
    value: function on(event, funcOrObject) {
      var otherItem = undefined,
          otherItemId = undefined;

      if (event === 'use') {
        for (otherItemId in funcOrObject) {
          if (funcOrObject.hasOwnProperty(otherItemId)) {
            otherItem = adventure.items[otherItemId];
            var useObj = getUse(this, otherItem) || getUse(otherItem, this);
            if (!!useObj) {
              throw new Error('no second use allowed on item ' + newItem);
            }
          }
        }
        this.handlers[event] = funcOrObject;
      } else {
        _get(Object.getPrototypeOf(Item.prototype), 'on', this).call(this, event, funcOrObject);
      }
    }
  }, {
    key: 'click',
    value: function click() {
      this.emit('click');
    }
  }, {
    key: 'use',
    value: function use(other) {
      var useObj = getUse(this, other);
      if (typeof useObj === 'undefined') {
        return;
      }
      if (typeof useObj === 'function') {
        useObj = useObj();
      }
      if (useObj.once) {
        var myHandlers = this.handlers['use'];
        var otherHandlers = other.handlers['use'];

        if (myHandlers) {
          delete myHandlers[other.id];
        }
        if (otherHandlers) {
          delete otherHandlers[this.id];
        }
      }
      var ret = useObj.returns;
      if (typeof ret === 'function') {
        return ret();
      } else {
        return ret;
      }
    }
  }]);

  return Item;
})(_events2['default']);

exports['default'] = Item;

function getUse(a, b) {
  var useFn = undefined;
  var uses = a.handlers['use'];
  if (uses) {
    useFn = uses[b.id];
  }
  if (typeof useFn === 'undefined') {
    uses = b.handlers['use'];
    if (uses) {
      useFn = uses[a.id];
    }
  }
  return useFn;
}

function equals(a, b) {
  if (a instanceof Item && b instanceof Item) {
    return a.id === b.id;
  }
}

exports.equality = equals;

function getItemInUse() {
  return itemInUse;
}

function setItemInUse(item) {
  itemInUse = item;
}

function unsetItemInUse() {
  itemInUse = null;
}

},{"./Element":7,"events":1}],11:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Scene = (function () {
  function Scene(background) {
    _classCallCheck(this, Scene);

    this.background = background;
    this.items = [];
  }

  _createClass(Scene, [{
    key: "add",
    value: function add(item, coords) {
      this.items.push({ item: item, coords: coords });
    }
  }, {
    key: "highlightAllItems",
    value: function highlightAllItems() {
      this.items.forEach(function (entry) {
        entry.item.highlight();
      });
    }
  }, {
    key: "stopHighlightAllItems",
    value: function stopHighlightAllItems() {
      this.items.forEach(function (entry) {
        entry.item.stopHighlight();
      });
    }
  }, {
    key: "use",
    value: function use(item) {
      return new SceneMover(this, item);
    }
  }]);

  return Scene;
})();

exports["default"] = Scene;

var SceneMover = (function () {
  function SceneMover(scene, item) {
    _classCallCheck(this, SceneMover);

    this.scene = scene;
    this.item = item;
  }

  _createClass(SceneMover, [{
    key: "walkTo",
    value: function walkTo(item2) {
      return new Promise(function (resolve, reject) {
        this.scene.items.filter(item2);
        this.item.x = item2.x;
        this.item.y = item2.y;
        resolve(this.item);
      });
    }
  }]);

  return SceneMover;
})();

module.exports = exports["default"];

},{}]},{},[4]);
