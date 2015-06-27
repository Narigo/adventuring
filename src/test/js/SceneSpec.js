import Scene from '../../main/js/Scene';
import Item from '../../main/js/Item';
import Character from '../../main/js/Character';

describe('A scene', () => {

  it('should be possible to add items to a scene', () => {
    var myScene = new Scene('background.svg');
    var myItem = new Item();
    expect(() => {
      myScene.add(myItem, {x : 50, y : 50});
    }).not.toThrow();
  });

  it('should be possible to list added items of a scene', () => {
    var myScene = new Scene('background.svg');
    var something = new Item();
    var someOtherThing = new Item();
    myScene.add(something);
    myScene.add(someOtherThing);
    expect(myScene.items.filter((i) => {
      return i.item == something;
    }).length).toBeGreaterThan(0);
    expect(myScene.items.filter((i) => {
      return i.item == someOtherThing;
    }).length).toBeGreaterThan(0);
  });

  it('should be possible to highlight all items of a scene', () => {
    var myScene = new Scene('background.svg');
    var $element1 = document.createElement('div');
    var $element2 = document.createElement('div');
    var something1 = new Item('something1', $element1);
    var something2 = new Item('something2', $element2);

    myScene.add(something1);
    myScene.add(something2);
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

    myScene.add(something1);
    myScene.add(something2);

    something1.highlight();
    expect($element1.classList.contains('highlight')).toBe(true);
    expect($element2.classList.contains('highlight')).toBe(false);

    myScene.stopHighlightAllItems();

    expect($element1.classList.contains('highlight')).toBe(false);
    expect($element2.classList.contains('highlight')).toBe(false);
  });

  it('can let someone walk to someone else', () => {
    var myScene = new Scene('background.svg');
    var $element1 = document.createElement('div');
    var $element2 = document.createElement('div');
    var peter = new Character('peter1', $element1, {name : 'Peter'});
    var bob = new Character('bob1', $element2, {name : 'Bob'});
    myScene.add(peter);
    myScene.add(bob);
    myScene.use(peter).walkTo(bob);
  });

});
