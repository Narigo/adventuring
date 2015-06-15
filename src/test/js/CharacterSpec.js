describe('A character', function () {
  var Scene = require('../../main/js/Scene.js');
  var Character = require('../../main/js/Character.js');
  var Dialog = require('../../main/js/Dialog.js');
  var charName = 'Peter';

  it('should have a name', function () {
    var peter = new Character('peter1', {name : charName});
    expect(peter.name).toEqual(charName);
  });

});