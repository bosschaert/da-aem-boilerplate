async function checkDocuments(data) {
  const now = new Date().getTime();
  console.log('Now', now);
  for (const doc of data) {
    const offTime = new Date(Number(doc.offtime));
    console.log('Found', doc.path, 'offTime', offTime);

    if (offTime.getTime() < now) {
      console.log(`Unpublishing ${doc.path}`);

      const url = `https://admin.hlx.page/live/bosschaert/da-aem-boilerplate/main${doc.path}`;
      const resp = await fetch(url, { method: 'DELETE' });
      console.log('Unpublish response', resp.status);
    }
  }
}

async function removeFromIdx() {
  const idx = await fetch('https://main--da-aem-boilerplate--bosschaert.hlx.live/jmp-all.json');
  const idxJson = await idx.json();
  const data = idxJson.data;
  if (data) {
    await checkDocuments(data);
  }
}

removeFromIdx().then(() => {
  console.log('Process completed');
});
