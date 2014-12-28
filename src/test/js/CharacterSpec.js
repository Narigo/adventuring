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

  it('should be easy to talk', function(done) {
    var scene = new Scene();
    var peter = new Character('peter1', 'Peter');

    var conversation = scene.talkTo(peter);
    conversation.listen(function (conv) {
      expect(conv.text).toEqual("Hi there.");
      expect(conv.replies.length).toEqual(3);
    }).reply(1).listen(function (conv) {
      expect(conv.text).toEqual("Fine, thanks, you?");
      expect(conv.replies.length).toEqual(2);
    }).reply(2).listen(function (conv) {
      expect(conv.text).toEqual("Okay, bye.");
      expect(conv.replies.length).toEqual(0);
      done();
    });
  });

});