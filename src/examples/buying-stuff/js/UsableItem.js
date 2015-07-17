import {default as Item, getItemInUse } from '../../../main/js/Item'

function useCurrentItemOn(item) {
  return () => {
    console.log('clicked on ' + item.id);
    let itemInUse = getItemInUse();
    if (itemInUse !== null) {
      itemInUse.use(item);
    }
  };
}

export default class UsableItem extends Item {
  constructor(id, $element) {
    super(id, $element);
    $element.addEventListener('click', useCurrentItemOn(this));
  }
}
