var adventure = {
  items : {}
};

function Item(id, $element) {
  this.id = id;
  this.$element = $element;
  this.handlers = {};
}

Item.prototype.highlight = function () {
  this.$element.classList.add('highlight');
};

Item.prototype.on = function (event, funcOrObject) {
  var newItem, thatItem, someItem, useFn;
  if (event === 'use') {
    for (newItem in funcOrObject) {
      if (funcOrObject.hasOwnProperty(newItem)) {
        thatItem = funcOrObject[newItem];
        for (someItem in adventure.items) {
          if (adventure.items.hasOwnProperty(someItem)) {
            useFn = getUse(thatItem, adventure.items[someItem]);
            if (useFn) {
              throw new Error('no second use allowed on these items!');
            }
          }
        }
        adventure.items[thatItem.id] = thatItem;
      }
    }
  }
  this.handlers[event] = funcOrObject;

  function getUse(a, b) {
    var uses = a.handlers['use'];
    if (uses) {
      return uses[b.id];
    }
  }
};

Item.prototype.click = function () {
  var clickHandler = this.handlers['click'];
  if (clickHandler) {
    return clickHandler();
  }
};

Item.prototype.use = function (other) {
  var useFn = getUse(this, other);
  if (!useFn) {
    useFn = getUse(other, this);
    if (!useFn) {
      return;
    }
  }
  return useFn();

  function getUse(a, b) {
    var uses = a.handlers['use'];
    if (uses) {
      return uses[b.id];
    }
  }
};

function equals(a, b) {
  if (a instanceof Item && b instanceof Item) {
    return a.id === b.id;
  }
}

module.exports = {
  Item : Item,
  equality : equals
};