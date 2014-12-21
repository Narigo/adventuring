describe('A scene', function () {
  var Scene = require('../../main/js/Scene.js');
  var Item = require('../../main/js/Item.js').Item;

  it('should be possible to add items to a scene', function () {
    var myScene = new Scene('background.svg');
    var myItem = new Item();
    expect(function () {
      myScene.addItem(myItem);
    }).not.toThrow();
  });

  it('should be possible to list added items of a scene', function () {
    var myScene = new Scene('background.svg');
    var something = new Item();
    var someOtherThing = new Item();
    myScene.addItem(something);
    myScene.addItem(someOtherThing);
    expect(myScene.items).toContain(something);
    expect(myScene.items).toContain(someOtherThing);
  });

});