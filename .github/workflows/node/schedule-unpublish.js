async function removeFromIdx() {
  const idx = await fetch('https://main--jmp-da--jmphlx.aem.live/jmp-en.json');
  console.log('Read', await idx.json());
}

// Remove non-arguments from argv
process.argv.shift();
process.argv.shift();

removeFromIdx().then(() => {
  console.log('Process completed');
});
