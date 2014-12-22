function Item(id, $element) {
  this.id = id;
  this.$element = $element;
  this.handlers = {};
}

Item.prototype.highlight = function () {
  this.$element.classList.add('highlight');
};

Item.prototype.on = function (event, func) {
  this.handlers[event] = func;
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