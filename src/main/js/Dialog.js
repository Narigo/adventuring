function Dialog(options, nextDialog) {
  this.char = options.char;
  if (!options.text) {
    throw new Error('Dialog needs a text');
  }
  this.text = options.text;
  this.replies = options.replies || [];
}

Dialog.prototype.listen = function (callback) {
  callback({
    char : this.char,
    text : this.text,
    replies : this.replies
  });

  return this;
};

Dialog.prototype.reply = function (num) {
  if (num < 0 || num >= this.replies.length) {
    throw new Error('Unknown reply for dialog');
  }

  return this.replies[num];
};

module.exports = Dialog;
