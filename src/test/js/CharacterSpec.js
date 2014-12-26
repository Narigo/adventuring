describe('A character', function() {
  var Scene = require('../../main/js/Scene.js');
  var Character = require('../../main/js/Character.js');

  it('should have a name', function() {
    var name = 'Peter';
    var peter = new Character('peter1', name);
    expect(peter.name).toEqual(name);
  });

  it('should be possible to talk', function() {
    var scene = new Scene();
    var peter = new Character('peter1', 'Peter');

    expect(function() {
      scene.talkTo(peter);
    }).not.toThrow();
  });

});