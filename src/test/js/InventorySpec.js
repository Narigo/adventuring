import Item from '../../main/js/Item';
import Inventory from '../../main/js/Inventory';

describe('Inventory', () => {

  it('should be possible to add items', () => {
    let inventory = new Inventory();
    let paper = new Item('paper');

    expect(() => {
      inventory.add(paper);
    }).not.toThrow();
  });

  it('should be possible to list items', () => {
    let inventory = new Inventory();
    let paper = new Item('paper');
    let pen = new Item('pen');

    inventory.add(paper);
    inventory.add(pen);
    expect(inventory.list()).toEqual([paper, pen]);
  });

  it('should be possible to remove items', () => {
    let inventory = new Inventory();
    let paper = new Item('paper');
    let pen = new Item('pen');

    inventory.add(paper);
    inventory.add(pen);
    inventory.remove(paper);

    expect(inventory.list()).toEqual([pen]);
  });

  it('should be possible to remove an item that is equal to an existing one', () => {
    let inventory = new Inventory();
    let paper = new Item('paper');
    let pen1 = new Item('pen');
    let pen2 = new Item('pen');

    inventory.add(paper);
    inventory.add(pen1);
    inventory.remove(pen2);

    expect(inventory.list()).toEqual([paper]);
  });

  it('should fire an event if an item gets added', (done) => {
    let inventory = new Inventory();
    let pen = new Item('pen');

    inventory.on('add', (item) => {
      expect(item).toEqual(pen);
      expect(inventory.list()).toEqual([pen]);
      done();
    });

    inventory.add(pen);
  });

  it('should fire an event if an item gets removed', (done) => {
    let inventory = new Inventory();
    let paper = new Item('paper');
    let pen = new Item('pen');

    inventory.on('remove', (item) => {
      expect(item).toEqual(pen);
      expect(inventory.list()).toEqual([paper]);
      done();
    });

    inventory.add(paper);
    inventory.add(pen);
    inventory.remove(pen);

  });

  it('can tell if an item is inside of it', () => {
    let inventory = new Inventory();
    let paper = new Item('paper');
    let pen = new Item('pen');

    inventory.add(pen);

    expect(inventory.contains(paper)).toBe(false);
    expect(inventory.contains(pen)).toBe(true);
  })
});
