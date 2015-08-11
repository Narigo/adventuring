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

});
