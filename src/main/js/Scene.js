function Scene(background) {
  this.background = background;
  this.items = [];
}

Scene.prototype.addItem = function (item) {
  this.items.push(item);
};

Scene.prototype.highlightAllItems = function () {
  this.items.forEach(function(item) {
    item.highlight();
  });
};

Scene.prototype.stopHighlightAllItems = function () {
  this.items.forEach(function(item) {
    item.stopHighlight();
  });
};

module.exports = Scene;
