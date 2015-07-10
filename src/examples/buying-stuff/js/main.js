import Adventure from '../../../main/js/Adventure'
import Scene from '../../../main/js/Scene'
import Inventory from '../../../main/js/Inventory'
import Item from '../../../main/js/Item'

let adventure = new Adventure('My buying adventure');
let inventory = new Inventory();
let $inventory = document.getElementById('inventory');

inventory.on('add', (item) => {
  let $item = document.createElement('div');
  item.$element.parentNode.removeChild(item.$element);
  item.$element.removeEventListener('click');
  $item.appendChild(item.$element);
  $inventory.appendChild($item);
});

let outsideShop = (function () {
  let scene = new Scene('outside-shop');
  let $money = document.getElementById('money');
  let moneyItem = new Item('money', $money);
  $money.addEventListener('click', () => {
    console.log('clicked on scene');
    inventory.addItem(moneyItem);
  });

  return scene;
}());

let insideShop = new Scene('inside-shop');

