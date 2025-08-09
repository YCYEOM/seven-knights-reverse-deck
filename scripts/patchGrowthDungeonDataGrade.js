// scripts/patchGrowthDungeonDataGrade.js
const fs = require('fs');
const path = require('path');

const rareDir = path.join(__dirname, '../public/heroes/rare');
const legendaryDir = path.join(__dirname, '../public/heroes/legendary');
const appxPath = path.join(__dirname, '../src/App.jsx');

function getHeroNames(dir) {
  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.png'))
    .map(f => f.replace('.png', ''));
}

const rare = getHeroNames(rareDir);
const legendary = getHeroNames(legendaryDir);

const appxSource = fs.readFileSync(appxPath, 'utf-8');
const growthDataMatch = appxSource.match(/const growthDungeonData = ([\s\S]*?);\n/);
if (!growthDataMatch) throw new Error('growthDungeonData not found');

const vm = require('vm');
const sandbox = {};
vm.createContext(sandbox);
vm.runInContext('growthDungeonData = ' + growthDataMatch[1], sandbox);
const growthDungeonData = sandbox.growthDungeonData;

function getGrade(name) {
  if (rare.includes(name)) return 'rare';
  if (legendary.includes(name)) return 'legendary';
  return null;
}

function patchHero(hero) {
  const grade = getGrade(hero.name);
  if (grade) hero.grade = grade;
  return hero;
}

growthDungeonData.forEach((dungeon) => {
  ['필수','추천','택1'].forEach(type => {
    if (!dungeon[type]) return;
    if (type === '택1') {
      dungeon[type].forEach(group => {
        group.forEach((hero, i) => {
          group[i] = patchHero(hero);
        });
      });
    } else {
      dungeon[type].forEach((hero, i) => {
        dungeon[type][i] = patchHero(hero);
      });
    }
  });
});

const patched = appxSource.replace(
  /const growthDungeonData = ([\s\S]*?);\n/,
  'const growthDungeonData = ' + JSON.stringify(growthDungeonData, null, 2) + ';// patched by patchGrowthDungeonDataGrade.js\n'
);
fs.writeFileSync(appxPath, patched);
console.log('growthDungeonData 등급 자동 패치 완료!');
