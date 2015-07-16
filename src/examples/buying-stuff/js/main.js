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

let outsideShop = new Scene('outside-shop');
let insideShop = new Scene('inside-shop');

let $money = document.getElementById('money');
let moneyItem = new Item('money', $money);
let moneyPickUp = () => {
  console.log('clicked on scene');
  inventory.add(moneyItem);
  $money.removeEventListener('click', moneyPickUp);
};
$money.addEventListener('click', moneyPickUp);

let $door = document.getElementById('shop');
$door.addEventListener('click', () => {
  adventure.setScene(insideShop);
});
