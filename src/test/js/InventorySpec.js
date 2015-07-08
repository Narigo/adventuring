import Item from '../../main/js/Item';
import Inventory from '../../main/js/Inventory';

describe('Inventory', () => {

  it('should be possible to add items', () => {
    var inventory = new Inventory();
    var paper = new Item('paper');

    expect(() => {
      inventory.addItem(paper);
    }).not.toThrow();
  });

  it('should be possible to list items', () => {
    var inventory = new Inventory();
    var paper = new Item('paper');
    var pen = new Item('pen');

    inventory.addItem(paper);
    inventory.addItem(pen);
    expect(inventory.list()).toEqual([paper, pen]);
  });

  it('should be possible to remove items', () => {
    var inventory = new Inventory();
    var paper = new Item('paper');
    var pen = new Item('pen');

    inventory.addItem(paper);
    inventory.addItem(pen);
    inventory.remove(paper);

    expect(inventory.list()).toEqual([pen]);
  });

  it('should be possible to remove an item that is equal to an existing one', () => {
    var inventory = new Inventory();
    var paper = new Item('paper');
    var pen1 = new Item('pen');
    var pen2 = new Item('pen');

    inventory.addItem(paper);
    inventory.addItem(pen1);
    inventory.remove(pen2);

    expect(inventory.list()).toEqual([paper]);
  });

  it('should fire an event if an item gets added', (done) => {
    var inventory = new Inventory();
    var pen = new Item('pen');

    inventory.on('add', (item) => {
      expect(item).toEqual(pen);
      expect(inventory.list()).toEqual([pen]);
      done();
    });

    inventory.addItem(pen);
  });
});
