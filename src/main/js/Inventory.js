function Inventory() {
  this.items = [];
}

Inventory.prototype.addItem = function (item) {
  this.items.push(item);
};

Inventory.prototype.list = function () {
  return this.items;
};

Inventory.prototype.remove = function(item) {
  this.items.splice(this.items.indexOf(item), 1);
};

module.exports = Inventory;
