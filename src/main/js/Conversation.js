function Conversation() {
  this.text = 'Hi there.';
  this.replies = [1, 2, 3];
}

Conversation.prototype.listen = function (callback) {
  var that = this;

  callback({
    text : that.text,
    replies : that.replies
  });

  return new Conversation();
};

Conversation.prototype.reply = function(num) {
  var conv = new Conversation();
  if (num === 0) {
    conv.text = 'Fine, thanks, you?';
  } else {
    conv.text = 'No.';
  }
  conv.replies = [1, 2];
  return conv;
};

Conversation.prototype.end = function () {
  var conv = new Conversation();
  conv.text = 'Okay, bye.';
  conv.replies = [];
  return conv;
};

module.exports = Conversation;
