describe('Inventory', function () {

  var Item = require('../../main/js/Item.js').Item;
  var Inventory = require('../../main/js/Inventory.js');

  it('should be possible to add items', function () {
    var inventory = new Inventory();
    var paper = new Item('paper');

    expect(function () {
      inventory.addItem(paper);
    }).not.toThrow();
  });

  it('should be possible to list items', function () {
    var inventory = new Inventory();
    var paper = new Item('paper');
    var pen = new Item('pen');

    inventory.addItem(paper);
    inventory.addItem(pen);
    expect(inventory.list()).toEqual([paper, pen]);
  });

  it('should be possible to remove items', function () {
    var inventory = new Inventory();
    var paper = new Item('paper');
    var pen = new Item('pen');

    inventory.addItem(paper);
    inventory.addItem(pen);
    inventory.remove(paper);

    expect(inventory.list()).toEqual([pen]);
  });

  it('should be possible to remove an item that is equal to an existing one', function () {
    var inventory = new Inventory();
    var paper = new Item('paper');
    var pen1 = new Item('pen');
    var pen2 = new Item('pen');

    inventory.addItem(paper);
    inventory.addItem(pen1);
    inventory.remove(pen2);

    expect(inventory.list()).toEqual([paper]);
  });

});
