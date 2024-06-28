import { LitElement, html, until } from 'https://da.live/deps/lit/lit-all.min.js';

export default class DaTagSelector extends LitElement {
  static properties = {
    project: { type: String },
    token: { type: String },
  };

  getTagURL() {
    return `https://admin.da.live/source/${this.project.org}/${this.project.repo}/data/producttags.json`
  }

  async fetchTags() {
    const url = this.getTagURL();

    const opts = {
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    }
    const resp = await fetch(url, opts);
    const tagData = await resp.json();

    const categories = new Map();
    tagData.data.forEach((el) => {
      const k = Object.keys(el)[0];
      const v = Object.values(el)[0];
      let vals = categories.get(k);
      if (!vals) {
        vals = [];
        categories.set(k, vals);
      }
      vals.push(v);
    });

    const tagLists = [];
    categories.forEach((v, k) => {
      const el = html`<h2>${k}</h2>
      <ul>
        ${v.map((tag) => html`<li>${tag}</li>`)}
      </ul>`
      tagLists.push(el);
    });
    return tagLists;
  }

  listTags() {
    return html`<p>${until(this.fetchTags(), html`Fetching tags...</p>`)}`;
  }

  render() {
    return html`
      ${this.listTags()}
      <br>
      <small>List obtained from: ${this.getTagURL()}</small>
      <br>
      <small>Project: ${JSON.stringify(this.project)}</small>
    `;
  }
}

customElements.define('da-tag-selector', DaTagSelector);
