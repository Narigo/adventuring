describe('Conversations', function () {
  var Scene = require('../../main/js/Scene.js');
  var Character = require('../../main/js/Character.js');

  it('should be easy to use', function (done) {
    var scene = new Scene();
    var peter = new Character('peter1', 'Peter');

    scene.talkTo(peter).listen(function (conv) {
      expect(conv.text).toEqual("Hi there.");
      expect(conv.replies.length).toEqual(3);
    }).end().listen(function (conv) {
      expect(conv.text).toEqual("Okay, bye.");
      expect(conv.replies.length).toEqual(0);
      done();
    });
  });

  it('should be possible to reply', function (done) {
    var scene = new Scene();
    var peter = new Character('peter1', 'Peter');

    scene.talkTo(peter).listen(function (conv) {
      expect(conv.text).toEqual("Hi there.");
      expect(conv.replies.length).toEqual(3);
    }).reply(0).listen(function (conv) {
      expect(conv.text).toEqual("Fine, thanks, you?");
      expect(conv.replies.length).toEqual(2);
    }).end().listen(function (conv) {
      expect(conv.text).toEqual("Okay, bye.");
      expect(conv.replies.length).toEqual(0);
      done();
    });
  });

  it('should be possible to take different paths', function (done) {
    var scene = new Scene();
    var peter = new Character('peter1', 'Peter');

    scene.talkTo(peter).listen(function (conv) {
      expect(conv.text).toEqual("Hi there.");
      expect(conv.replies.length).toEqual(3);
    }).reply(2).listen(function (conv) {
      expect(conv.text).toEqual("No.");
      expect(conv.replies.length).toEqual(2);
    }).end().listen(function (conv) {
      expect(conv.text).toEqual("Okay, bye.");
      expect(conv.replies.length).toEqual(0);
      done();
    });
  });

});