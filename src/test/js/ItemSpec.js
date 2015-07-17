import {default as Item, equality, getItemInUse, setItemInUse, unsetItemInUse} from '../../main/js/Item';

describe('An item', () => {

  beforeEach(() => {
    jasmine.addCustomEqualityTester(equality);
  });

  it('should have a working equality method', () => {
    let item1 = new Item('something');
    let item2 = new Item('something');

    expect(item1).toEqual(item2);
  });

  it('should have custom click handlers', () => {
    let myItem = new Item('something');
    let clickText = 'click something';
    myItem.on('click', () => {
      return clickText;
    });
    let ret = myItem.click();

    expect(ret).toEqual(clickText);
  });

  it('may be used with other items in both directions', () => {
    let paper = new Item('paper');
    let pen = new Item('pen');
    let text = new Item('text');
    paper.on('use', {
      pen : {
        returns : text
      }
    });

    expect(paper.use(pen)).toEqual(text);
    expect(pen.use(paper)).toEqual(text);
  });

  it('should not be possible to have different usages with the same items', () => {
    let paper = new Item('paper');
    let pen = new Item('pen');
    let text = new Item('text');
    paper.on('use', {
      pen : {
        returns : text
      }
    });

    expect(() => {
      pen.on('use', {
        paper : {
          returns : pen
        }
      });
    }).toThrow();
  });

  it('should be possible to return multiple items on usage', () => {
    let map = new Item('map');
    let scissors = new Item('scissors');
    let mapPart = new Item('mapPart');
    let mapPartWithX = new Item('mapPartWithX');
    map.on('use', {
      scissors : {
        returns : [mapPart, mapPartWithX]
      }
    });

    expect(map.use(scissors)).toEqual([mapPart, mapPartWithX]);
  });

  it('should be okay to reuse items', () => {
    let coin = new Item('coin');
    let arcade = new Item('arcade');
    let money = new Item('money');
    coin.on('use', {
      arcade : {
        returns : money
      }
    });

    expect(coin.use(arcade)).toEqual(money);
    expect(coin.use(arcade)).toEqual(money);
    expect(coin.use(arcade)).toEqual(money);
  });

  it('should be possible to register a use only once', () => {
    let coin = new Item('coin');
    let arcade = new Item('arcade');
    let plushie = new Item('plushie');
    coin.on('use', {
      arcade : {
        once : true,
        returns : plushie
      }
    });

    expect(coin.use(arcade)).toEqual(plushie);
    expect(coin.use(arcade)).toBeUndefined();
  });

  it('should be possible to have a function that returns things and it gets executed', () => {
    let coin = new Item('coin');
    let arcade = new Item('arcade');
    let plushie = new Item('plushie');
    let changedSomething = false;

    coin.on('use', {
      arcade : () => {
        changedSomething = true;
        return {
          returns : plushie
        };
      }
    });

    expect(coin.use(arcade)).toEqual(plushie);
    expect(changedSomething).toBe(true);
  });

  it('should be possible to highlight items', () => {
    let $element = document.createElement('div');
    let something = new Item('something', $element);

    something.highlight();

    expect($element.classList.contains('highlight')).toBe(true);
  });

  it('should be possible to stop highlighting items', () => {
    let $element = document.createElement('div');
    let something = new Item('something', $element);

    something.highlight();
    something.stopHighlight();

    expect($element.classList.contains('highlight')).toBe(false);
  });

  it('has no current item in use if none was set', () => {
    expect(getItemInUse()).toBe(null);
  });

  it('may have a current item in use', () => {
    let $element = document.createElement('div');
    let something = new Item('something', $element);
    expect(() => {
      setItemInUse(something);
    }).not.toThrow();
    expect(getItemInUse()).toBe(something);
    unsetItemInUse();
  });

  it('can unset an item in use', () => {
    let $element = document.createElement('div');
    let something = new Item('something', $element);
    expect(getItemInUse()).toBe(null);
    setItemInUse(something);
    expect(getItemInUse()).toBe(something);
    unsetItemInUse();
    expect(getItemInUse()).toBe(null);
  });
});
