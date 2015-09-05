import {default as Item, getItemInUse } from '../../../main/js/Item'
import HtmlElement from '../../../main/js/HtmlElement'


function useCurrentItemOn(item) {
  console.log('UsableItem.useCurrentItemOn: clicked on ' + item.id);
  let itemInUse = getItemInUse();
  if (itemInUse !== null) {
    itemInUse.use(item);
  }
}

export default class UsableItem extends Item {
  constructor(id, $element) {
    super(id, new HtmlElement($element));
    $element.addEventListener('click', (e) => {
      useCurrentItemOn(this);
      this.emit('click', e);
    });
  }
}
