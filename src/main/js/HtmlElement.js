export default class HtmlElement {

  constructor($element) {
    if (!($element instanceof HTMLElement)) {
      throw new Error('need HTML element to construct an element');
    }
    this.$element = $element;
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
