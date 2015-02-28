describe('An item', function () {
  var items = require('../../main/js/Item.js');
  var Item = items.Item;

  beforeEach(function () {
    jasmine.addCustomEqualityTester(items.equality);
  });

  it('should have a working equality method', function () {
    var item1 = new Item('something');
    var item2 = new Item('something');

    expect(item1).toEqual(item2);
  });

  it('should have custom click handlers', function () {
    var myItem = new Item('something');
    var clickText = 'click something';
    myItem.on('click', function () {
      return clickText;
    });
    var ret = myItem.click();

    expect(ret).toEqual(clickText);
  });

  it('may be used with other items in both directions', function () {
    var paper = new Item('paper');
    var pen = new Item('pen');
    var text = new Item('text');
    paper.on('use', {
      pen : function () {
        return text;
      }
    });

    expect(paper.use(pen)).toEqual(text);
    expect(pen.use(paper)).toEqual(text);
  });

  it('should not be possible to have different usages with the same items', function () {
    var paper = new Item('paper');
    var pen = new Item('pen');
    var text = new Item('text');
    paper.on('use', {
      pen : function () {
        return text;
      }
    });

    expect(function () {
      pen.on('use', {
        paper : function () {
          return pen;
        }
      });
    }).toThrow();
  });

  it('should be possible to return multiple items on usage', function () {
    var paper = new Item('paper');
    var pen = new Item('pen');
    var text = new Item('text');
    paper.on('use', {
      pen : function () {
        return [pen, text];
      }
    });

    expect(paper.use(pen)).toEqual([pen, text]);
  });

  it('should be possible to highlight items', function () {
    var $element = document.createElement('div');
    var something = new Item('something', $element);

    something.highlight();

    expect($element.classList.contains('highlight')).toBe(true);
  });

  it('should be possible to stop highlighting items', function () {
    var $element = document.createElement('div');
    var something = new Item('something', $element);

    something.highlight();
    something.stopHighlight();

    expect($element.classList.contains('highlight')).toBe(false);
  });

});
