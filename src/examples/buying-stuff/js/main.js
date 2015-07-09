import Adventure from '../../../main/js/Adventure'
import Scene from '../../../main/js/Scene'
import Inventory from '../../../main/js/Inventory'
import Item from '../../../main/js/Item'

var adventure = new Adventure('My buying adventure');
var inventory = new Inventory();
var $inventory = document.getElementById('inventory');

inventory.on('add', (item) => {
  var $item = document.createElement('div');
  item.$element.parentNode.removeChild(item.$element);
  $item.appendChild(item.$element);
  $inventory.appendChild($item);
});

var outsideShop = (function () {
  var scene = new Scene('outside-shop');
  var $money = document.getElementById('money');
  var moneyItem = new Item('money', $money);
  $money.addEventListener('click', () => {
    console.log('clicked on scene');
    inventory.addItem(moneyItem);
  });

  return scene;
}());

var insideShop = new Scene('inside-shop');

