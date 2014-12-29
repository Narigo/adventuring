var Conversation = require('./Conversation.js');

function Character(id, name) {
  this.id = id;
  this.name = name;
}

Character.prototype.conversation = function() {
  return new Conversation();
};

module.exports = Character;
