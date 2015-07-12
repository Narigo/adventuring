import Item from '../../main/js/Item';
import {equality} from '../../main/js/Item';

describe('An item', () => {

  beforeEach(() => {
    jasmine.addCustomEqualityTester(equality);
  });

  it('should have a working equality method', () => {
    var item1 = new Item('something');
    var item2 = new Item('something');

    expect(item1).toEqual(item2);
  });

  it('should have custom click handlers', () => {
    var myItem = new Item('something');
    var clickText = 'click something';
    myItem.on('click', () => {
      return clickText;
    });
    var ret = myItem.click();

    expect(ret).toEqual(clickText);
  });

  it('may be used with other items in both directions', () => {
    var paper = new Item('paper');
    var pen = new Item('pen');
    var text = new Item('text');
    paper.on('use', {
      pen : {
        returns : text
      }
    });

    expect(paper.use(pen)).toEqual(text);
    expect(pen.use(paper)).toEqual(text);
  });

  it('should not be possible to have different usages with the same items', () => {
    var paper = new Item('paper');
    var pen = new Item('pen');
    var text = new Item('text');
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
    var map = new Item('map');
    var scissors = new Item('scissors');
    var mapPart = new Item('mapPart');
    var mapPartWithX = new Item('mapPartWithX');
    map.on('use', {
      scissors : {
        returns : [mapPart, mapPartWithX]
      }
    });

    expect(map.use(scissors)).toEqual([mapPart, mapPartWithX]);
  });

  it('should be okay to reuse items', () => {
    var coin = new Item('coin');
    var arcade = new Item('arcade');
    var money = new Item('money');
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
    var coin = new Item('coin');
    var arcade = new Item('arcade');
    var plushie = new Item('plushie');
    coin.on('use', {
      arcade : {
        once : true,
        returns : plushie
      }
    });

    expect(coin.use(arcade)).toEqual(plushie);
    expect(coin.use(arcade)).toBeUndefined();
  });

  it('should be possible to highlight items', () => {
    var $element = document.createElement('div');
    var something = new Item('something', $element);

    something.highlight();

    expect($element.classList.contains('highlight')).toBe(true);
  });

  it('should be possible to stop highlighting items', () => {
    var $element = document.createElement('div');
    var something = new Item('something', $element);

    something.highlight();
    something.stopHighlight();

    expect($element.classList.contains('highlight')).toBe(false);
  });

});
