export default class Character {

  constructor(id, options) {
    this.id = id;
    this.name = options.name;
    this.dialogTree = options.conversation;
  }

  conversation() {
    return this.dialogTree;
  }

}
