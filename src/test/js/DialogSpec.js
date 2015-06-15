var Dialog = require('../../main/js/Dialog');
var Character = require('../../main/js/Character');

describe('Dialog', function () {

  var me = new Character('me', {name : 'Me'});
  var char = new Character('peter1', {name : 'Peter'});
  var dialogWithReplies = new Dialog({
    char : char,
    text : 'Hello.',
    replies : [
      new Dialog({char : me, text : 'Bye.'}),
      new Dialog({char : me, text : 'Nevermind.'})
    ]
  });

  it('needs to have a text defined', function () {
    expect(function () {
      new Dialog()
    }).toThrow();
  });

  it('can be a character saying it', function () {
    expect(function () {
      var char = new Character('peter1', {name : 'Peter'});
      new Dialog({char : char, text : 'Hello.'});
    }).not.toThrow();
  });

  it('should be possible to create a simple dialog for a character', function (done) {
    var char = new Character('peter1', {name : 'Peter'});
    var dialog = new Dialog({char : char, text : 'Hello.'});

    dialog.listen(function (conv) {
      expect(conv.char).toEqual(char);
      expect(conv.text).toEqual('Hello.');
      expect(conv.replies.length).toEqual(0);
      done();
    });
  });

  it('may be possible to have replies to a dialog', function (done) {
    dialogWithReplies.listen(function (conv) {
      expect(conv.char).toEqual(char);
      expect(conv.text).toEqual('Hello.');
      expect(conv.replies.length).toEqual(2);
    }).reply(0).listen(function (conv) {
      expect(conv.char).toEqual(me);
      expect(conv.text).toEqual('Bye.');
      expect(conv.replies.length).toEqual(0);
      done();
    });
  });

  it('should not be possible to reply with a wrong index', function () {
    expect(function () {
      dialogWithReplies.listen(function (conv) {
        expect(conv.replies.length).toEqual(2);
      }).reply(3)
    }).toThrow();
  });

});
