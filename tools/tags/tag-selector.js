import { LitElement, html, until } from 'https://da.live/deps/lit/lit-all.min.js';
import getSheet from 'https://da.live/blocks/shared/sheet.js';

const sheet = await getSheet('/tools/tags/tag-selector.css');

export default class DaTagSelector extends LitElement {
  static properties = {
    project: { type: String },
    token: { type: String },
    datasource: { type: String },
    iscategory: { type: Boolean },
    displayName: { type: String },
    parentDataSource: { type: String },
  };

  connectedCallback() {
    super.connectedCallback();
    this.shadowRoot.adoptedStyleSheets = [sheet];
  }

  getTagURL() {
    return `https://admin.da.live/source/${this.project.org}/${this.project.repo}/${this.datasource}`
  }

  tagClicked(e) {
    const tagtext = e.target.innerText;

    if (this.iscategory) {
      const sel = document.querySelector('da-tag-selector');
      if (sel) {
        const ts = document.createElement('da-tag-selector');
        ts.project = sel.project;
        ts.token = sel.token;
        ts.datasource = `tools/tagbrowser/${tagtext.toLowerCase()}.json`;
        ts.displayName = tagtext;
        ts.parent = sel;
        sel.parentNode.appendChild(ts);
        sel.parentNode.removeChild(sel);
      };
    } else {
      console.log('TT clicked', e.target.innerText);

      navigator.clipboard.writeText(tagtext).then(function() {
        console.log('Async: Copying to clipboard was successful!');
        const sd = document.querySelector('#copy-status');
        sd.style.opacity = '1';
      }, function(err) {
        console.error('Async: Could not copy text: ', err);
      });
    }
  }

  upClicked() {
    const sel = document.querySelector('da-tag-selector');
    if (sel) {
      if (sel.parent) {
        sel.parentNode.appendChild(sel.parent);
        sel.parentNode.removeChild(sel);
      }
    }
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
      this.iscategory = k.toLowerCase() === 'category';
      const uplink = this.iscategory
        ? html``
        : html`<span class="up" @click="${this.upClicked}">↑</span> `;

      const el = html`<h2>${uplink}${this.displayName}</h2>
      <ul>
        ${v.map((tag) => html`<li @click="${this.tagClicked}">${tag}</li>`)}
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
    `;
  }
}

customElements.define('da-tag-selector', DaTagSelector);
