import EventEmitter from 'events';
import Scene from './Scene.js';

export default class Adventure extends EventEmitter {

  constructor(name) {
    super();
    this._name = name;
  }

  name() {
    return this._name;
  }

  setScene(scene) {
    if (!(scene instanceof Scene)) {
      throw new Error('Must set to a Scene');
    }

    this.scene = scene;
    this.emit('change-scene', scene);
  }

  currentBackground() {
    return this.scene.background;
  }

}
