// Import SDK
import DA_SDK from 'https://da.live/nx/utils/sdk.js';

// Import Web Component
import './tag-selector.js';

(async function init() {
  const { project, token } = await DA_SDK;
  const tagSelector = document.createElement('da-tag-selector');
  tagSelector.project = project;
  tagSelector.token = token;
  tagSelector.datasource = 'tools/tagbrowser/tag-categories.json';
  tagSelector.iscategory = true;
  tagSelector.displayName = 'Categories';
  document.body.append(tagSelector);
}());
