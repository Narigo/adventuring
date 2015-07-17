import Adventure from '../../../main/js/Adventure'
import Scene from '../../../main/js/Scene'
import Inventory from '../../../main/js/Inventory'
import Item from '../../../main/js/Item'

let adventure = new Adventure('My buying adventure');
let inventory = new Inventory();
let $inventory = document.getElementById('inventory');
let itemInUse = null;

adventure.on('change-scene', (data) => {
  console.log(data);
  if (data.oldScene) {
    let $oldScene = document.getElementById(data.oldScene.background);
    $oldScene.style.display = 'none';
  }
  let $newScene = document.getElementById(data.scene.background);
  $newScene.style.display = 'block';
});

inventory.on('add', (item) => {
  let $item = document.createElement('div');
  item.$element.parentNode.removeChild(item.$element);
  item.$element.removeEventListener('click');
  $item.appendChild(item.$element);
  $inventory.appendChild($item);

  item.$element.addEventListener('click', useItem(item));
  document.addEventListener('click', removeUsing);

  function useItem(item) {
    return (e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log('using something...');
      itemInUse = item;
    };
  }

  function removeUsing(e) {
    e.preventDefault();
    e.stopPropagation();
    console.log('not using anything');
    itemInUse = null;
  }
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

let $pen = document.getElementById('pen');
let pen = new Item('pen', $pen);
$pen.addEventListener('click', () => {
  console.log('clicked on pen');
  if (itemInUse === moneyItem) {
    console.log('using money on pen');
    moneyItem.use(pen);
  }
});

moneyItem.on('use', {
  pen : () => {
    inventory.add(pen);
    inventory.remove(moneyItem);
    return {
      once : true
    };
  }
});

let $door = document.getElementById('shop');
$door.addEventListener('click', () => {
  adventure.setScene(insideShop);
});

let $doorOut = document.getElementById('table');
$doorOut.addEventListener('click', () => {
  adventure.setScene(outsideShop);
});

adventure.setScene(outsideShop);
