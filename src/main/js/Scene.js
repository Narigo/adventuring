function Scene(background) {
  this.background = background;
  this.items = [];
}

Scene.prototype.addItem = function (item) {
  this.items.push(item);
};

Scene.prototype.talkTo = function (char) {
  return char.conversation();
};

module.exports = Scene;
