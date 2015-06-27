import Character from '../../main/js/Character';
import Dialog from '../../main/js/Dialog';

describe('Dialog', () => {

  var $me = document.createElement('div');
  var $peter = document.createElement('div');
  var me = new Character('me', $me, {name : 'Me'});
  var char = new Character('peter1', $peter, {name : 'Peter'});
  var dialogWithReplies = new Dialog({
    char : char,
    text : 'Hello.',
    replies : [
      new Dialog({char : me, text : 'Bye.'}),
      new Dialog({char : me, text : 'Nevermind.'})
    ]
  });

  it('needs to have a text defined', () => {
    expect(() => {
      new Dialog()
    }).toThrow();
  });

  it('can be a character saying it', () => {
    expect(() => {
      var char = new Character('peter1', $peter, {name : 'Peter'});
      new Dialog({char : char, text : 'Hello.'});
    }).not.toThrow();
  });

  it('should be possible to create a simple dialog for a character', (done) => {
    var char = new Character('peter1', $peter, {name : 'Peter'});
    var dialog = new Dialog({char : char, text : 'Hello.'});

    dialog.listen((conv) => {
      expect(conv.char).toEqual(char);
      expect(conv.text).toEqual('Hello.');
      expect(conv.replies.length).toEqual(0);
      done();
    });
  });

  it('may be possible to have replies to a dialog', (done) => {
    dialogWithReplies.listen((conv) => {
      expect(conv.char).toEqual(char);
      expect(conv.text).toEqual('Hello.');
      expect(conv.replies.length).toEqual(2);
    }).reply(0).listen((conv) => {
      expect(conv.char).toEqual(me);
      expect(conv.text).toEqual('Bye.');
      expect(conv.replies.length).toEqual(0);
      done();
    });
  });

  it('should not be possible to reply with a wrong index', () => {
    expect(() => {
      dialogWithReplies.listen((conv) => {
        expect(conv.replies.length).toEqual(2);
      }).reply(3)
    }).toThrow();
  });

});
