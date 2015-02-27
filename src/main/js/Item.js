var adventure = {
  items : {}
};

function Item(id, $element) {
  this.id = id;
  this.$element = $element;
  this.handlers = {};
  var that = this;
  adventure.items[id] = that;
}

Item.prototype.highlight = function () {
  this.$element.classList.add('highlight');
};

Item.prototype.stopHighlight = function () {
  this.$element.classList.remove('highlight');
};

Item.prototype.on = function (event, funcOrObject) {
  var otherItem, otherItemId;
  if (event === 'use') {
    for (otherItemId in funcOrObject) {
      if (funcOrObject.hasOwnProperty(otherItemId)) {
        otherItem = adventure.items[otherItemId];
        var useFn = getUse(this, otherItem) || getUse(otherItem, this);
        if (!!useFn) {
          throw new Error('no second use allowed on item ' + newItem);
        }
      }
    }
  }
  this.handlers[event] = funcOrObject;
};

Item.prototype.click = function () {
  var clickHandler = this.handlers['click'];
  if (clickHandler) {
    return clickHandler();
  }
};

Item.prototype.use = function (other) {
  var useFn = getUse(this, other);
  if (typeof useFn === 'undefined') {
    return;
  }
  return useFn();
};

function getUse(a, b) {
  var useFn;
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

module.exports = {
  Item : Item,
  equality : equals
};