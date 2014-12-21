describe('Adventure', function () {
  var Adventure = require('../../main/js/Adventure.js');
  var theName = 'My little Test-Adventure';
  var myAdventure = new Adventure(theName);
  var Scene = require('../../main/js/Scene.js');

  it('should have a name', function () {
    expect(myAdventure.name()).toBe(theName);
  });

  it('should be able to show a scene', function () {
    var scene = new Scene('background.svg');

    myAdventure.setScene(scene);
    expect(myAdventure.currentBackground()).toBe(scene.background);
  });

  it('should be able to show a different scene', function () {
    var scene1 = new Scene('background.svg');
    var scene2 = new Scene('background2.svg');

    myAdventure.setScene(scene1);
    expect(myAdventure.currentBackground()).toBe(scene1.background);
    myAdventure.setScene(scene2);
    expect(myAdventure.currentBackground()).toBe(scene2.background);
  });

});
