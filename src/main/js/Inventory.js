import EventEmitter from 'events';

class Inventory extends EventEmitter {

  constructor() {
    super();
    this.items = [];
  }

  add(item) {
    this.items.push(item);
    this.emit('add', item);
  }

  list() {
    return this.items;
  }

  remove(item) {
    this.items.splice(this.items.indexOf(item), 1);
    this.emit('remove', item);
  }

  contains(item) {
    return this.items.indexOf(item) >= 0;
  }
}

module.exports = Inventory;
