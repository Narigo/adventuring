import Scene from '../../main/js/Scene';
import Item from '../../main/js/Item';

describe('A scene', () => {

  it('should be possible to add items to a scene', () => {
    var myScene = new Scene('background.svg');
    var myItem = new Item();
    expect(() => {
      myScene.addItem(myItem);
    }).not.toThrow();
  });

  it('should be possible to list added items of a scene', () => {
    var myScene = new Scene('background.svg');
    var something = new Item();
    var someOtherThing = new Item();
    myScene.addItem(something);
    myScene.addItem(someOtherThing);
    expect(myScene.items).toContain(something);
    expect(myScene.items).toContain(someOtherThing);
  });

  it('should be possible to highlight all items of a scene', () => {
    var myScene = new Scene('background.svg');
    var $element1 = document.createElement('div');
    var $element2 = document.createElement('div');
    var something1 = new Item('something1', $element1);
    var something2 = new Item('something2', $element2);

    myScene.addItem(something1);
    myScene.addItem(something2);
    myScene.highlightAllItems();

    expect($element1.classList.contains('highlight')).toBe(true);
    expect($element2.classList.contains('highlight')).toBe(true);
  });

  it('should be possible to stop highlighting all items of a scene', () => {
    var myScene = new Scene('background.svg');
    var $element1 = document.createElement('div');
    var $element2 = document.createElement('div');
    var something1 = new Item('something1', $element1);
    var something2 = new Item('something2', $element2);

    myScene.addItem(something1);
    myScene.addItem(something2);

    something1.highlight();
    expect($element1.classList.contains('highlight')).toBe(true);
    expect($element2.classList.contains('highlight')).toBe(false);

    myScene.stopHighlightAllItems();

    expect($element1.classList.contains('highlight')).toBe(false);
    expect($element2.classList.contains('highlight')).toBe(false);
  });
});
