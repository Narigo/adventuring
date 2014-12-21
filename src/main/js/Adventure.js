function Adventure(name) {
  var that = this;
  that.name = name;

  return {
    name : function () {
      return that.name;
    },
    setScene : function (scene) {
      that.scene = scene;
    },
    currentBackground : function () {
      return that.scene.background;
    }
  };
}

module.exports = Adventure;
