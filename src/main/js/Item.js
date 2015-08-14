import EventEmitter from 'events';
import Element from './Element';

let adventure = {
  items : {}
};

let itemInUse = null;

export default class Item extends EventEmitter {

  constructor(id, $element) {
    super();
    if ($element && !($element instanceof Element)) {
      throw new Error('Item needs an Element to work with');
    }
    this.id = id;
    this.$element = $element;
    this.handlers = {};

    adventure.items[id] = this;
  }

  highlight() {
    this.$element.highlight();
  }

  stopHighlight() {
    this.$element.stopHighlight();
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
      this.handlers[event] = funcOrObject;
    } else {
      super.on(event, funcOrObject);
    }
  }

  click() {
    this.emit('click');
  }

  use(other) {
    let useObj = getUse(this, other);
    if (typeof useObj === 'undefined') {
      return;
    }
    if (typeof useObj === 'function') {
      useObj = useObj();
    }
    if (useObj.once) {
      let myHandlers = this.handlers['use'];
      let otherHandlers = other.handlers['use'];

      if (myHandlers) {
        delete myHandlers[other.id];
      }
      if (otherHandlers) {
        delete otherHandlers[this.id];
      }
    }
    let ret = useObj.returns;
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

export function getItemInUse() {
  return itemInUse;
}

export function setItemInUse(item) {
  itemInUse = item;
}

export function unsetItemInUse() {
  itemInUse = null;
}
