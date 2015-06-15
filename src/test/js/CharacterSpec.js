import Scene from '../../main/js/Scene';
import Character from '../../main/js/Character';
import Dialog from '../../main/js/Dialog';

describe('A character', () => {
  var charName = 'Peter';

  it('should have a name', () => {
    var peter = new Character('peter1', {name : charName});
    expect(peter.name).toEqual(charName);
  });

});