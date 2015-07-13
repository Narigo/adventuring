import Scene from '../../main/js/Scene';
import Character from '../../main/js/Character';
import Dialog from '../../main/js/Dialog';

describe('A character', () => {
  let charName = 'Peter';
  let $element = document.createElement('div');

  it('should have a name', () => {
    let peter = new Character('peter1', $element, {name : charName});
    expect(peter.name).toEqual(charName);
  });

  it('should be have a standard dialog color', () => {
    let peter = new Character('peter1', $element, {name : charName});
    expect(peter.color).toEqual('#ffffff');
  });

  it('should be possible to have a dialog color', () => {
    let color = '#00ff00';
    let peter = new Character('peter1', $element, {name : charName, color});
    expect(peter.color).toEqual(color);
  });

});