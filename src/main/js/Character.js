function Character(id, options) {
  this.id = id;
  this.name = options.name;
  this.dialogTree = options.conversation;
}

Character.prototype.conversation = function() {
  return this.dialogTree;
};

module.exports = Character;
