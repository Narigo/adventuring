import EventEmitter from 'events';
import Scene from './Scene.js';

export default class Adventure extends EventEmitter {

  constructor(name, initialScene) {
    super();
    this._name = name;
    this.scene = initialScene || null;
  }

  name() {
    return this._name;
  }

  setScene(scene) {
    if (!(scene instanceof Scene)) {
      throw new Error('Must set to a Scene');
    }

    let oldScene = this.scene;
    this.scene = scene;
    this.emit('change-scene', {oldScene, scene});
  }

  currentBackground() {
    return this.scene.background;
  }

}
