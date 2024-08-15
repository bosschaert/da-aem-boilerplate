// Import SDK
// import DA_SDK from 'https://da.live/nx/utils/sdk.js';

// Import Web Component
// import './tag-selector.js';

function initTimeZones() {
  const select = document.getElementById('time-zone');

  let defTZ = '';
  const curTZ = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const timezonesWithoffsets = Intl.supportedValuesOf('timeZone').map((timeZone) => {
    let offset = new Intl.DateTimeFormat('en', { timeZone, timeZoneName: 'longOffset' })
      .formatToParts().find((part) => part.type === 'timeZoneName').value;
    if (offset === 'GMT') {
      offset = 'GMT+00:00';
    }
    const timeZoneAbbrivation = new Intl.DateTimeFormat('en', { timeZone, timeZoneName: 'long' })
      .formatToParts().find((part) => part.type === 'timeZoneName').value;
    // return `${timeZone} - ${timeZoneAbbrivation}(${offset})`;
    const tz = `(${offset}) ${timeZoneAbbrivation}`;
    if (timeZone === curTZ) {
      defTZ = tz;
    }
    return tz;
  });
  const tzSet = Array.from(new Set(timezonesWithoffsets)).sort();

  tzSet.forEach((tz) => {
    const opt = document.createElement('option');
    opt.textContent = tz;

    const delta = tz.substring(4, tz.indexOf(')'));
    opt.value = delta;

    if (tz === defTZ) {
      opt.selected = true;
    }

    select.appendChild(opt);
  });
}

function typeChange(e) {
  let hasDate = false;
  let hasTime = false;
  switch (e.target.value) {
    case 'date':
      hasDate = true;
      break;
    case 'time':
      hasTime = true;
      break;
    default:
      hasDate = true;
      hasTime = true;
      break;
  }
  document.querySelectorAll('form#picker input[type=date]').forEach((date) => {
    date.hidden = !hasDate;
    date.required = hasDate;
  });
  document.querySelectorAll('form#picker [name=time-picker]').forEach((time) => {
    time.hidden = !hasTime;
    time.required = hasTime;
  });
}

function useButtonClicked(e) {
  e.preventDefault();

  const form = document.querySelector('form#picker');
  if (!form.reportValidity()) {
    return;
  }

  const inputType = document.querySelector('form#typeselect input[name="date-picker"]:checked').value;
  let seldate = '';
  if (inputType.includes('date')) {
    seldate = document.querySelector('form#picker input[type=date]').value;
  }

  let seltime = '';
  let seltz = '';
  if (inputType.includes('time')) {
    seltime = document.querySelector('form#picker input[type=time]').value;
    seltz = document.querySelector('form#picker select#time-zone').value;
  } else {
    console.log('Date result', seldate);
    return;
  }

  const d = new Date(`${seldate}T${seltime}${seltz}`);

  const result = d.toISOString();
  const cIdx = result.lastIndexOf(':');
  const result2 = result.substring(0, cIdx);
  const result3 = result2.replace('T', ' ');
  const result4 = `${result3}Z`;

  console.log('input:', seldate, seltime, seltz, d.toISOString());
  console.log('result: ', result4);
}

function initControls() {
  document.querySelectorAll('form#typeselect input[type=radio]').forEach((radio) => {
    radio.addEventListener('change', typeChange);
  });

  document.querySelectorAll('button#use').forEach((button) => {
    button.onclick = useButtonClicked;
  });
}

(async function init() {
  initControls();
  initTimeZones();
}());
