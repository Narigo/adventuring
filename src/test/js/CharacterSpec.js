import Scene from '../../main/js/Scene';
import Character from '../../main/js/Character';
import Dialog from '../../main/js/Dialog';

describe('A character', () => {
  var charName = 'Peter';
  var $element = document.createElement('div');

  it('should have a name', () => {
    var peter = new Character('peter1', $element, {name : charName});
    expect(peter.name).toEqual(charName);
  });

  it('should be have a standard dialog color', () => {
    var peter = new Character('peter1', $element, {name : charName});
    expect(peter.color).toEqual('#ffffff');
  });

  it('should be possible to have a dialog color', () => {
    var color = '#00ff00';
    var peter = new Character('peter1', $element, {name : charName, color});
    expect(peter.color).toEqual(color);
  });

});