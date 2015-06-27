import Item from './Item'

export default class Character extends Item {

  constructor(id, $element, options) {
    super(id, $element);
    this.name = options.name;
    this.color = options.color || '#ffffff';
    this.dialogTree = options.conversation;
  }

  conversation() {
    return this.dialogTree;
  }

}
