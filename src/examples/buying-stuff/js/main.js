import Adventure from '../../../main/js/Adventure'
import Scene from '../../../main/js/Scene'
import Inventory from '../../../main/js/Inventory'
import { default as Item, setItemInUse, getItemInUse, unsetItemInUse } from '../../../main/js/Item'
import UsableItem from './UsableItem'

let adventure = new Adventure('My buying adventure');
let inventory = new Inventory();
let $inventory = document.getElementById('inventory');

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
  item.$element.parentNode.removeChild(item.$element);
  item.$element.removeEventListener('click');
  $inventory.appendChild(item.$element);

  item.$element.addEventListener('click', useItem(item));

  function useItem(item) {
    return (e) => {
      e.preventDefault();
      e.stopPropagation();
      let itemInUse = getItemInUse();
      if (itemInUse !== null) {
        console.log('using ' + itemInUse.id + ' on inventory item ' + item.id);
        itemInUse.use(item);
        unsetItemInUse();
      } else {
        console.log('using ' + item.id + ' from inventory...');
        setItemInUse(item);
      }
    };
  }
});

inventory.on('remove', (item) => {
  $inventory.removeChild(item.$element);
});

document.addEventListener('click', removeUsing);

let outsideShop = new Scene('outside-shop');
let insideShop = new Scene('inside-shop');

let $money = document.getElementById('money');
let moneyItem = new Item('money', $money);
let $lessMoney = document.getElementById('lessMoney');
let lessMoney = new Item('lessMoney', $lessMoney);
$money.addEventListener('click', pickUpOrUse(moneyItem));

let $pen = document.getElementById('pen');
let pen = new UsableItem('pen', $pen);

moneyItem.on('use', {
  pen : () => {
    inventory.add(pen);
    inventory.remove(moneyItem);
    inventory.add(lessMoney);
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

function pickUpOrUse(item) {
  var clickFn = (e) => {
    e.stopPropagation();
    e.preventDefault();
    console.log('clicked on ' + item.id);
    let itemInUse = getItemInUse();
    if (itemInUse !== null) {
      console.log('using ' + itemInUse.id + ' on ' + item.id);
      itemInUse.use(item);
    } else {
      console.log('picking up ' + item.id);
      inventory.add(item);
      item.$element.removeEventListener('click', clickFn);
    }
  };

  return clickFn;
}

function removeUsing(e) {
  e.preventDefault();
  e.stopPropagation();
  let itemInUse = getItemInUse();
  if (itemInUse !== null) {
    console.log('stop using ' + itemInUse.id);
    unsetItemInUse();
  }
}
