import Scene from '../../main/js/Scene';
import Item from '../../main/js/Item';
import Character from '../../main/js/Character';
import HtmlElement from '../../main/js/HtmlElement';

describe('A scene', () => {

  it('should be possible to add items to a scene', () => {
    let myScene = new Scene('background.svg');
    let myItem = new Item();
    expect(() => {
      myScene.add(myItem, {x : 50, y : 50});
    }).not.toThrow();
  });

  it('should be possible to list added items of a scene', () => {
    let myScene = new Scene('background.svg');
    let something = new Item();
    let someOtherThing = new Item();
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
    let myScene = new Scene('background.svg');
    let div1 = document.createElement('div');
    let div2 = document.createElement('div');
    let $element1 = new HtmlElement(div1);
    let $element2 = new HtmlElement(div2);
    let something1 = new Item('something1', $element1);
    let something2 = new Item('something2', $element2);

    myScene.add(something1);
    myScene.add(something2);
    myScene.highlightAllItems();

    expect($element1.$element.classList.contains('highlight')).toBe(true);
    expect($element2.$element.classList.contains('highlight')).toBe(true);
  });

  it('should be possible to stop highlighting all items of a scene', () => {
    let myScene = new Scene('background.svg');
    let div1 = document.createElement('div');
    let div2 = document.createElement('div');
    let $element1 = new HtmlElement(div1);
    let $element2 = new HtmlElement(div2);
    let something1 = new Item('something1', $element1);
    let something2 = new Item('something2', $element2);

    myScene.add(something1);
    myScene.add(something2);

    something1.highlight();
    expect($element1.$element.classList.contains('highlight')).toBe(true);
    expect($element2.$element.classList.contains('highlight')).toBe(false);

    myScene.stopHighlightAllItems();

    expect($element1.$element.classList.contains('highlight')).toBe(false);
    expect($element2.$element.classList.contains('highlight')).toBe(false);
  });

  it('can let someone walk to someone else', () => {
    let myScene = new Scene('background.svg');
    let $element1 = document.createElement('div');
    let $element2 = document.createElement('div');
    let peter = new Character('peter1', $element1, {name : 'Peter'});
    let bob = new Character('bob1', $element2, {name : 'Bob'});
    myScene.add(peter);
    myScene.add(bob);
    myScene.use(peter).walkTo(bob);
  });

});
