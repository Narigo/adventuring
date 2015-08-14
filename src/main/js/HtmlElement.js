import Element from './Element';

export default class HtmlElement extends Element {

  constructor($element) {
    super($element);
    if (!($element instanceof HTMLElement)) {
      throw new Error('need HTML element to construct an element');
    }
  }

  highlight() {
    return this.$element.classList.add('highlight');
  }

  isHighlighted() {
    return this.$element.classList.contains('highlight');
  }

  stopHighlight() {
    return this.$element.classList.remove('highlight');
  }

}
