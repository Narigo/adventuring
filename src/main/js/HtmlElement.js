export default class HtmlElement {

  constructor($element) {
    if (!($element instanceof HTMLElement)) {
      throw new Error('need HTML element to construct an element');
    }
    this.$element = $element;
  }

}
