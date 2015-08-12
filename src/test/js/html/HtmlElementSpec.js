import HtmlElement from '../../../main/js/HtmlElement'

describe('HTML Element', () => {

  it('needs an HTML element to work', () => {
    expect(() => {
      new HtmlElement('hello');
    }).toThrow();

    expect(() => {
      let div = document.createElement('div');
      new HtmlElement(div);
    }).not.toThrow();
  });

  it('can be highlighted', () => {
    let div = document.createElement('div');
    let element = new HtmlElement(div);

    element.highlight();
    expect(element.isHighlighted()).toBe(true);
    expect(div.classList.contains('highlight')).toBe(true);
  });

  it('can stop highlighting', () => {
    let div = document.createElement('div');
    let element = new HtmlElement(div);

    element.highlight();
    expect(element.isHighlighted()).toBe(true);

    element.stopHighlight();
    expect(element.isHighlighted()).toBe(false);

    expect(div.classList.contains('highlight')).toBe(false);
  });

});
