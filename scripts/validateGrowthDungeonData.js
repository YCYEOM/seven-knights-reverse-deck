// scripts/validateGrowthDungeonData.js
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
const allHeroes = new Set([...rare, ...legendary]);

const appxSource = fs.readFileSync(appxPath, 'utf-8');
const growthDataMatch = appxSource.match(/const growthDungeonData = ([\s\S]*?);\n/);
if (!growthDataMatch) throw new Error('growthDungeonData not found');

const vm = require('vm');
const sandbox = {};
vm.createContext(sandbox);
vm.runInContext('growthDungeonData = ' + growthDataMatch[1], sandbox);
const growthDungeonData = sandbox.growthDungeonData;

function checkHero(name) {
  if (rare.includes(name)) return 'rare';
  if (legendary.includes(name)) return 'legendary';
  return null;
}

let errors = [];
growthDungeonData.forEach((dungeon, idx) => {
  ['필수','추천','택1'].forEach(type => {
    if (!dungeon[type]) return;
    if (type === '택1') {
      dungeon[type].forEach(group => {
        group.forEach(hero => {
          if (!checkHero(hero.name)) {
            errors.push(`[${dungeon.title}] ${type}: '${hero.name}' 파일 없음`);
          }
        });
      });
    } else {
      dungeon[type].forEach(hero => {
        if (!checkHero(hero.name)) {
          errors.push(`[${dungeon.title}] ${type}: '${hero.name}' 파일 없음`);
        }
      });
    }
  });
});

if (errors.length) {
  console.error('growthDungeonData 영웅명 오류/누락 목록:');
  errors.forEach(e => console.error(e));
  process.exit(1);
} else {
  console.log('growthDungeonData의 모든 영웅명이 파일과 일치합니다.');
}
