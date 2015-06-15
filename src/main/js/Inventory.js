class Inventory {

  constructor() {
    this.items = [];
  }

  addItem(item) {
    this.items.push(item);
  }

  list() {
    return this.items;
  }

  remove(item) {
    this.items.splice(this.items.indexOf(item), 1);
  }

}

module.exports = Inventory;
