var adventure = {
  items : {}
};

export default class Item {

  constructor(id, $element) {
    this.id = id;
    this.$element = $element;
    this.handlers = {};

    adventure.items[id] = this;
  }

  highlight() {
    this.$element.classList.add('highlight');
  }

  stopHighlight() {
    this.$element.classList.remove('highlight');
  }

  on(event, funcOrObject) {
    var otherItem, otherItemId;
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
    }
    this.handlers[event] = funcOrObject;
  }

  click() {
    var clickHandler = this.handlers['click'];
    if (clickHandler) {
      return clickHandler();
    }
  }

  use(other) {
    var useObj = getUse(this, other);
    if (typeof useObj === 'undefined') {
      return;
    }
    var ret = useObj.returns;
    if (typeof ret === 'function') {
      return ret();
    } else {
      return ret;
    }
  }

}

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

export { equals as equality };
