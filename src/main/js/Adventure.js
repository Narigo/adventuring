export default class Adventure {

  constructor(name) {
    this._name = name;
  }

  name() {
    return this._name;
  }

  setScene(scene) {
    this.scene = scene;
  }

  currentBackground() {
    return this.scene.background;
  }

}
