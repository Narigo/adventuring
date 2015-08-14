import Scene from '../../main/js/Scene';
import Character from '../../main/js/Character';
import Dialog from '../../main/js/Dialog';
import HtmlElement from '../../main/js/HtmlElement';

describe('A character', () => {
  let name = 'Peter';
  let $element = new HtmlElement(document.createElement('div'));

  it('should have a name', () => {
    let peter = new Character('peter1', $element, {name});
    expect(peter.name).toEqual(name);
  });

  it('should be have a standard dialog color', () => {
    let peter = new Character('peter1', $element, {name});
    expect(peter.color).toEqual('#ffffff');
  });

  it('should be possible to have a dialog color', () => {
    let color = '#00ff00';
    let peter = new Character('peter1', $element, {name, color});
    expect(peter.color).toEqual(color);
  });

});