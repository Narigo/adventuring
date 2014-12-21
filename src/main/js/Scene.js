function Scene(background) {
  this.background = background;
  this.items = [];
}

Scene.prototype.addItem = function (item) {
  this.items.push(item);
};

module.exports = Scene;
