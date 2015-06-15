export default class Scene {

  constructor(background) {
    this.background = background;
    this.items = [];
  }

  addItem(item) {
    this.items.push(item);
  }

  highlightAllItems() {
    this.items.forEach((item) => {
      item.highlight();
    });
  }

  stopHighlightAllItems() {
    this.items.forEach((item) => {
      item.stopHighlight();
    });
  }

}
