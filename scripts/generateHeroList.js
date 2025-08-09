// scripts/generateHeroList.js
const fs = require('fs');
const path = require('path');

const rareDir = path.join(__dirname, '../public/heroes/rare');
const legendaryDir = path.join(__dirname, '../public/heroes/legendary');
const output = path.join(__dirname, '../public/heroList.json');

function getHeroNames(dir) {
  return fs.readdirSync(dir)
    .filter(f => f.toLowerCase().endsWith('.png'))
    .map(f => f.replace(/\.png$/i, '').normalize('NFC').trim());
}

const rare = getHeroNames(rareDir);
const legendary = getHeroNames(legendaryDir);

fs.writeFileSync(output, JSON.stringify({ rare, legendary }, null, 2));
console.log('✅ heroList.json 생성 완료:', output);
