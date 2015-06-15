import Adventure from '../../main/js/Adventure';
import Scene from '../../main/js/Scene';

describe('Adventure', () => {
  var theName = 'My little Test-Adventure';
  var myAdventure = new Adventure(theName);

  it('should have a name', () => {
    expect(myAdventure.name()).toBe(theName);
  });

  it('should be able to show a scene', () => {
    var scene = new Scene('background.svg');

    myAdventure.setScene(scene);
    expect(myAdventure.currentBackground()).toBe(scene.background);
  });

  it('should be able to show a different scene', () => {
    var scene1 = new Scene('background.svg');
    var scene2 = new Scene('background2.svg');

    myAdventure.setScene(scene1);
    expect(myAdventure.currentBackground()).toBe(scene1.background);
    myAdventure.setScene(scene2);
    expect(myAdventure.currentBackground()).toBe(scene2.background);
  });

});
