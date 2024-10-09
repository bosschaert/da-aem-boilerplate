import { readBlockConfig } from '../../scripts/aem.js';

function lowercaseObj(obj) {
  const newObj = {};
  Object.keys(obj).forEach((key) => {
    newObj[key.toLowerCase()] = obj[key];
  });
  return newObj;
}

function conditionMatches(doc, condition) {
  const lcDoc = lowercaseObj(doc);
  const lcCond = lowercaseObj(condition);

  switch (lcCond.operator) {
    case '\'=\'':
      return lcDoc[lcCond.property?.toLowerCase()] === lcCond.value;
    case '<':
      return Number(lcDoc[lcCond.property?.toLowerCase()]) < Number(lcCond.value);
    case '>':
      return Number(lcDoc[lcCond.property?.toLowerCase()]) > Number(lcCond.value);
    default:
      return false;
  }
}

function conditionsMatch(doc, conditions) {
  if (!conditions) return false;

  // eslint-disable-next-line no-restricted-syntax
  for (const condition of conditions) {
    if (!conditionMatches(doc, condition)) return false;
  }
  return true;
}

function docMatches(doc, filters) {
  // eslint-disable-next-line no-restricted-syntax
  for (const filter of filters[':names']) {
    if (conditionsMatch(doc, filters[filter]?.data)) return true;
  }
  return false;
}

export default async function decorate(block) {
  const config = readBlockConfig(block);

  const filterDocURL = `${window.location.origin}${config.filter}`;
  const filterDoc = await fetch(filterDocURL);
  const filters = await filterDoc.json();

  const indexDoc = await fetch(`${window.location.origin}/query-index.json`);
  const index = await indexDoc.json();

  const matching = [];
  index?.data.forEach((doc) => {
    if (docMatches(doc, filters)) {
      matching.push(doc);
    }
  });

  const ul = document.createElement('ul');
  matching.forEach((doc) => {
    const li = document.createElement('li');
    li.textContent = doc.path;
    ul.append(li);
  });
  block.replaceWith(ul);
}
