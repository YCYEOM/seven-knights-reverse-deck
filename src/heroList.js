// heroList.js: heroList.json fetch & getGrade 함수 제공
export async function fetchHeroList() {
  const res = await fetch(import.meta.env.BASE_URL + 'heroList.json');
  if (!res.ok) throw new Error('heroList.json fetch 실패');
  return await res.json();
}

function normalize(str) {
  return str ? str.normalize('NFC').trim() : '';
}

export function getGradeFromList(name, heroList) {
  const n = normalize(name);
  if (heroList.rare.some(h => normalize(h) === n)) return 'rare';
  if (heroList.legendary.some(h => normalize(h) === n)) return 'legendary';
  return 'legendary'; // 기본값
}
