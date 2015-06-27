export default class Scene {

  constructor(background) {
    this.background = background;
    this.items = [];
  }

  add(item, coords) {
    this.items.push({item, coords});
  }

  highlightAllItems() {
    this.items.forEach((entry) => {
      entry.item.highlight();
    });
  }

  stopHighlightAllItems() {
    this.items.forEach((entry) => {
      entry.item.stopHighlight();
    });
  }

  use(item) {
    return new SceneMover(this, item);
  }

}

class SceneMover {
  constructor(scene, item) {
    this.scene = scene;
    this.item = item;
  }

  walkTo(item2) {
    return new Promise(function (resolve, reject) {
      this.scene.items.filter(item2);
      this.item.x = item2.x;
      this.item.y = item2.y;
      resolve(this.item);
    });
  }
}