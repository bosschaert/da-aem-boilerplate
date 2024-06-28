import { LitElement } from '../../../deps/lit/lit-core.min.js';

export default class DaTagSelector extends LitElement {
  static properties = {
    project: { type: String },
    token: { type: String },
  };

  render() {
    return html`<h2>From the tag selector</h2>`;
  }
}

customElements.define('da-tag-selector', DaEditor);
