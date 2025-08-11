import React, { useEffect, useMemo, useState } from "react";
import { Box, Container, Divider, Paper, Stack, Typography, TextField, InputAdornment, FormControlLabel, Switch, Collapse, Chip } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { fetchHeroList, getGradeFromList } from "../heroList";

// 데이터는 public/equipmentData.json에서 동적 로딩합니다.
async function fetchEquipmentData() {
  // 배포 환경별로 정적 파일 루트가 다를 수 있어 다중 경로를 순차 시도합니다.
  const base = import.meta.env.BASE_URL || '/';
  const candidates = [
    `${base}equipmentData.json`,
    `${base}docs/equipmentData.json`,
    `${base}data/equipmentData.json`,
    // 일부 호스팅은 대소문자 구분으로 인해 다른 케이스 파일만 존재할 수 있음
    `${base}equipmentdata.json`,
    `${base}docs/equipmentdata.json`,
  ];

  const errors = [];
  for (const url of candidates) {
    try {
      const res = await fetch(url, { cache: 'no-store' });
      if (res.ok) {
        return await res.json();
      }
      errors.push(`${url} -> ${res.status}`);
    } catch (e) {
      errors.push(`${url} -> ${e?.message || 'network error'}`);
    }
  }
  // 마지막으로 상대경로(현재 위치 기준)도 시도
  try {
    const res = await fetch('equipmentData.json', { cache: 'no-store' });
    if (res.ok) return await res.json();
    errors.push(`./equipmentData.json -> ${res.status}`);
  } catch (e) {
    errors.push(`./equipmentData.json -> ${e?.message || 'network error'}`);
  }
  console.error('[EquipmentTab] equipmentData.json fetch 실패. 시도 경로:', errors);
  throw new Error('equipmentData.json fetch 실패');
}

// 이름 정규화: 공백 제거 + 소문자
function normalizeName(s = '') {
  return String(s).replace(/\s+/g, '').toLowerCase();
}

export default function EquipmentTab() {
  const STORAGE_KEY = 'equipmentTab.openGroups.v1';
  const [heroList, setHeroList] = useState({ rare: [], legendary: [] });
  const [loading, setLoading] = useState(true);
  const [equipmentData, setEquipmentData] = useState([]);
  const [showOnlyWithRecs, setShowOnlyWithRecs] = useState(false);
  const [openGroups, setOpenGroups] = useState({ legendary: {}, rare: {} }); // 카테고리별 접기/펼치기 상태

  const isOpen = (grade, cat) => !!(openGroups[grade] && openGroups[grade][cat]);
  const toggleGroup = (grade, cat) => {
    setOpenGroups(prev => {
      const next = { ...prev, [grade]: { ...(prev[grade] || {}) } };
      next[grade][cat] = !next[grade][cat];
      return next;
    });
  };

  useEffect(() => {
    let mounted = true;
    // 로컬 스토리지에서 펼침 상태 복원
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          setOpenGroups({
            legendary: parsed.legendary && typeof parsed.legendary === 'object' ? parsed.legendary : {},
            rare: parsed.rare && typeof parsed.rare === 'object' ? parsed.rare : {},
          });
        }
      }
    } catch (_) {
      // ignore parse errors
    }
    Promise.all([
      fetchHeroList(),
      fetchEquipmentData(),
    ])
      .then(([list, eq]) => {
        if (!mounted) return;
        setHeroList(list);
        setEquipmentData(eq || []);
      })
      .catch(() => { /* ignore: fallback는 기본값 */ })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  // 펼침 상태 로컬 스토리지 저장
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(openGroups));
    } catch (_) {
      // ignore quota errors
    }
  }, [openGroups]);
  // 장비 데이터를 영웅별로 집계 (섹션 배열 포맷과 키-밸류 포맷 모두 지원)
  const heroMap = useMemo(() => {
    const map = new Map(); // key: normalized name, value: { displayName, variants: [] }

    const pushVariants = (rawName, segments, prebuilt = false) => {
      const name = (rawName || '').trim();
      const key = normalizeName(name);
      const existing = map.get(key) || { displayName: name, variants: [] };
      const variants = prebuilt
        ? (segments || []).map(v => ({ label: v.label || null, body: String(v.body || '').trim() })).filter(v => v.body)
        : (segments || []).map(p => {
            const m = String(p).match(/\[(.*?)\]/);
            const label = m ? m[1] : null;
            const body = String(p).replace(/\s*\[.*?\]\s*/, '').trim().replace(/^,\s*/, '');
            return { label, body };
          });
      map.set(key, { displayName: existing.displayName || name, variants: [...existing.variants, ...variants] });
    };

    const data = equipmentData || [];

    if (Array.isArray(data)) {
      // 구 섹션 포맷: [{ title: '전설', 장비셋팅: ["영웅 <셋> | ... , ..."] }]
      data.forEach(section => {
        (section.장비셋팅 || []).forEach(line => {
          const idxLt = line.indexOf('<');
          const idxBar = line.indexOf('|');
          let cut = -1;
          if (idxLt >= 0 && idxBar >= 0) cut = Math.min(idxLt, idxBar);
          else if (idxLt >= 0) cut = idxLt; else if (idxBar >= 0) cut = idxBar;
          const rawName = cut > 0 ? line.slice(0, cut).trim() : line.trim();
          const content = cut > 0 ? line.slice(cut).replace(/^,\s*/, '').trim() : '';
          const parts = content ? content.split(',').map(s => s.trim()).filter(Boolean) : [];
          // parts가 비어도 본문을 하나의 variant로 취급
          pushVariants(rawName, parts.length ? parts : [line.trim()]);
        });
      });
    } else if (data && typeof data === 'object') {
      // 신규 키-밸류 포맷:
      // 문자열 배열: { "영웅명": ["<셋> | ...", "설명 [특이사항]"] }
      // 라벨 객체 배열: { "영웅명": [{label: '세트', body: '<셋> | ...'}, {label: '특이사항', body: '...'}] }
      Object.entries(data).forEach(([rawName, arr]) => {
        if (Array.isArray(arr) && arr.some(v => v && typeof v === 'object' && 'body' in v)) {
          // 이미 라벨/본문 객체 형태
          const cleaned = arr.map(v => ({ label: v.label || null, body: String(v.body || '').trim() })).filter(v => v.body);
          pushVariants(rawName, cleaned, true);
        } else {
          // 문자열 기반: 한 항목 안에 콤마로 여러 변형이 들어갈 수 있어 분리
          const segments = (arr || []).flatMap(item => String(item).split(',').map(s => s.trim()).filter(Boolean));
          pushVariants(rawName, segments);
        }
      });
    }

    return map;
  }, [equipmentData]);

  const [query, setQuery] = useState('');

  const heroes = useMemo(() => {
    const heroNamesFromList = [...(heroList.legendary || []), ...(heroList.rare || [])];
    // 리스트 기반 이름 우선 채우기 (정규화 키로 매칭)
    const allFromList = heroNamesFromList.map(n => {
      const key = normalizeName(n);
      const entry = heroMap.get(key);
      const variants = entry ? entry.variants : [];
      const category = (variants.find(v => (v.label || '').trim() === '카테고리')?.body || '').trim();
      const displayVariants = variants.filter(v => (v.label || '').trim() !== '카테고리');
      return { name: n, variants: displayVariants, category };
    });
    // 데이터에만 존재하는 영웅도 추가
    const extraFromData = Array.from(heroMap.values())
      .filter(e => !heroNamesFromList.some(n => normalizeName(n) === normalizeName(e.displayName)))
      .map(e => {
        const category = (e.variants.find(v => (v.label || '').trim() === '카테고리')?.body || '').trim();
        const displayVariants = e.variants.filter(v => (v.label || '').trim() !== '카테고리');
        return { name: e.displayName, variants: displayVariants, category };
      });
    let all = [...allFromList, ...extraFromData];

    // 검색 필터
    const q = query.trim().toLowerCase();
    if (q) {
      all = all.filter(h =>
        h.name.toLowerCase().includes(q) ||
        h.variants.some(v => (v.body + ' ' + (v.label || '')).toLowerCase().includes(q)) ||
        (h.category && h.category.toLowerCase().includes(q))
      );
    }

    // 추천 있는 영웅만 표시 토글
    if (showOnlyWithRecs) {
      all = all.filter(h => (h.variants && h.variants.length > 0));
    }

    return all.sort((a, b) => a.name.localeCompare(b.name, 'ko'));
  }, [heroMap, heroList, query, showOnlyWithRecs]);

  // 등급별로 분할
  const legendaryHeroes = useMemo(() => heroes.filter(h => getGradeFromList(h.name, heroList) === 'legendary'), [heroes, heroList]);
  const rareHeroes = useMemo(() => heroes.filter(h => getGradeFromList(h.name, heroList) === 'rare'), [heroes, heroList]);

  // 검색 시 매칭된 카테고리 자동 펼치기 (닫지는 않음)
  useEffect(() => {
    const q = query.trim();
    if (!q) return; // 검색어 없으면 사용자/저장 상태 유지
    const catsLegendary = new Set(legendaryHeroes.map(h => (h.category && h.category.trim()) || '기타'));
    const catsRare = new Set(rareHeroes.map(h => (h.category && h.category.trim()) || '기타'));
    setOpenGroups(prev => {
      const next = {
        legendary: { ...(prev.legendary || {}) },
        rare: { ...(prev.rare || {}) },
      };
      catsLegendary.forEach(c => { next.legendary[c] = true; });
      catsRare.forEach(c => { next.rare[c] = true; });
      return next;
    });
  }, [query, legendaryHeroes, rareHeroes]);

  // 카테고리별 그룹핑 유틸
  const groupByCategory = (arr) => {
    const map = new Map();
    arr.forEach(h => {
      const key = (h.category && h.category.trim()) || '기타';
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(h);
    });
    // 정렬: 카테고리 한글 가나다, 영웅명도 정렬
    const sorted = Array.from(map.entries())
      .sort((a, b) => a[0].localeCompare(b[0], 'ko'))
      .map(([cat, list]) => [cat, list.sort((x, y) => x.name.localeCompare(y.name, 'ko'))]);
    return sorted;
  };

  const renderHeroCard = (hero, borderColor, badgeBg) => (
    <Paper key={`${hero.name}`} elevation={4} sx={{ mb: 2.5, p: 2, borderRadius: 3, bgcolor: '#23243a', border: `2px solid ${borderColor}` }}>
      <Stack direction="row" alignItems="center" spacing={1.25} sx={{ mb: 1.25 }}>
        <Box
          component="img"
          alt={hero.name}
          src={`${import.meta.env.BASE_URL}heroes/${getGradeFromList(hero.name, heroList)}/${normalizeName(hero.name)}.png`}
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
          sx={{ width: 40, height: 40, borderRadius: 1.5, objectFit: 'cover', border: `1px solid ${borderColor}` }}
        />
        <Typography variant="h6" fontWeight={800} color="primary.light">
          {hero.name}
        </Typography>
      </Stack>
      <Stack spacing={1.25}>
        {(() => {
          // 전처리: 분리, 조건/섹션 추출, 분류
          const splitByOr = (v) => {
            const body = v.body || '';
            const parts = body.split(/\s*또는\s*/);
            if (parts.length <= 1) return [{ ...v }];
            return parts.map((p, idx) => ({ ...v, body: p, _splitIndex: idx }));
          };
          const extractBrackets = (text = '') => {
            const conds = [];
            let rest = String(text);
            const bracketRegex = /\s*\[([^\]]+)\]\s*/g;
            let m;
            while ((m = bracketRegex.exec(rest)) !== null) conds.push(m[1]);
            rest = rest.replace(/\s*\[[^\]]+\]\s*/g, ' ').replace(/\s+/g, ' ').trim();
            return { conds, rest };
          };
          const items = hero.variants
            .flatMap(splitByOr)
            .map((v) => {
              const labelRaw = v.label || '';
              const labelMatch = labelRaw.match(/^\s*([^\[]+?)\s*(\[[^\]]+\])?\s*$/);
              let baseLabel = labelRaw;
              const labelConds = [];
              if (labelMatch) {
                baseLabel = (labelMatch[1] || '').trim();
                if (labelMatch[2]) labelConds.push(labelMatch[2].slice(1, -1));
              }
              const { conds: bodyConds, rest: bodyRest } = extractBrackets(v.body || '');
              let allConds = [...labelConds, ...bodyConds];
              let bodyText = bodyRest;
              // '메모' 레이블인데 실제로 서브옵션을 담고 있는 경우 정규화
              const hasSuboptPrefix = /(\s*\[?\s*서브옵션\s*\]?\s*:?\s*)/i;
              if (baseLabel === '메모' && hasSuboptPrefix.test(v.body || '')) {
                baseLabel = '서브옵션';
              }
              // 본문에서 '서브옵션' 접두어 제거
              bodyText = bodyText.replace(hasSuboptPrefix, '');
              // 조건 배지에서 '서브옵션' 제거 (본문에 [서브옵션]이 있었다면)
              allConds = allConds.filter((c) => c !== '서브옵션');
              // 섹션 식별: 무탑/결장 조건은 별도 섹션으로 이동, 배지에서는 제거
              let section = '기타';
              const lowered = allConds.map((c) => c.toLowerCase());
              const hasTower = allConds.some((c) => c.includes('무탑'));
              const hasArena = allConds.some((c) => c.includes('결장'));
              // 주옵션으로 간주할 라벨 목록
              const mainOptionLabels = new Set(['선봉장', '추적자', '성기사', '수문장', '수호자', '암살자', '복수자', '주술사', '조율자']);
              if (hasTower) section = '무탑';
              else if (hasArena) section = '결장';
              else if (baseLabel === '특이사항') section = '특이사항';
              else if (baseLabel === '서브옵션') section = '서브옵션';
              else if (mainOptionLabels.has(baseLabel)) section = '주옵션';
              const filteredConds = allConds.filter((c) => c !== '무탑' && c !== '결장' && c !== '서브옵션');
              return { section, baseLabel, bodyRest: bodyText, conds: filteredConds };
            });

          const tower = items.filter((it) => it.section === '무탑');
          const arena = items.filter((it) => it.section === '결장');
          const subopts = items.filter((it) => it.section === '서브옵션');
          const mains = items.filter((it) => it.section === '주옵션');
          const others = items.filter((it) => it.section === '기타');
          const notes = items.filter((it) => it.section === '특이사항');

          // 카테고리별 기본 서브옵션 가이드 추가
          const categorySuboptRows = (() => {
            const cat = (hero.category || '').trim();
            const rows = [];
            if (cat === '딜러') {
              rows.push({ section: '서브옵션', baseLabel: '서브옵션', bodyRest: '치확 / 치피 / 공% / 공 / 약공', conds: [] });
              rows.push({ section: '서브옵션', baseLabel: '서브옵션', bodyRest: '치피2+공%2', conds: ['치확 충분'] });
              rows.push({ section: '서브옵션', baseLabel: '서브옵션', bodyRest: '치확2+공%2', conds: ['치확 부족'] });
            } else if (cat === '토템') {
              rows.push({ section: '서브옵션', baseLabel: '서브옵션', bodyRest: '막기% / 생% / 생 / 효과적중 / 방% / 방', conds: [] });
              rows.push({ section: '서브옵션', baseLabel: '서브옵션', bodyRest: '속공', conds: ['결장용'] });
            } else if (cat === '방덱') {
              rows.push({ section: '서브옵션', baseLabel: '서브옵션', bodyRest: '막기% / 생% / 생 / 효과저항 / 방% / 방', conds: [] });
            }
            return rows;
          })();

          const Section = ({ title, rows }) => (
            rows.length === 0 ? null : (
              <Box sx={{ p: 1, px: 1.5, bgcolor: '#1B1D2A', border: '1px solid #2E3148', borderRadius: 1.5 }}>
                <Stack direction="row" alignItems="center" spacing={1.25} sx={{ mb: 0.75 }}>
                  <Box sx={{ width: 6, height: 18, bgcolor: badgeBg, borderRadius: 1 }} />
                  <Typography variant="subtitle2" color="#E5E7EB" sx={{ opacity: 0.9 }}>{title}</Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                  {rows.map((it, i) => (
                    <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 0.75, p: 0.75, px: 1, bgcolor: '#1F2335', border: '1px solid #2E3148', borderRadius: 1 }}>
                      {it.conds.length > 0 && (
                        <Box sx={{ px: 0.6, py: 0.2, bgcolor: '#0EA5E9', color: '#0B1220', fontSize: 11, borderRadius: 999 }}>
                          {it.conds.map((c) => `[${c}]`).join(' ')}
                        </Box>
                      )}
                      {it.baseLabel && it.baseLabel !== '특이사항' && (
                        <Box sx={{ px: 0.75, py: 0.25, bgcolor: badgeBg, color: '#111827', fontSize: 11, borderRadius: 999 }}>
                          {it.baseLabel}
                        </Box>
                      )}
                      <Typography color="#E5E7EB" variant="body2">{it.bodyRest}</Typography>
                    </Box>
                  ))}
                </Stack>
              </Box>
            )
          );

          const allEmpty = hero.variants.length === 0 || (tower.length === 0 && arena.length === 0 && mains.length === 0 && subopts.length === 0 && categorySuboptRows.length === 0 && others.length === 0 && notes.length === 0);
          if (allEmpty) {
            return (
              <Box sx={{ p: 1, px: 1.5, bgcolor: '#1B1D2A', border: '1px solid #2E3148', borderRadius: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, p: 0.75, px: 1, bgcolor: '#1F2335', border: '1px dashed #4B5563', borderRadius: 1 }}>
                  <Box sx={{ px: 0.6, py: 0.2, bgcolor: '#374151', color: '#E5E7EB', fontSize: 11, borderRadius: 999 }}>추천 없음</Box>
                </Box>
              </Box>
            );
          }

          return (
            <>
              <Section title="결장" rows={arena} />
              <Section title="무탑" rows={tower} />
              <Section title="주옵션" rows={mains} />
              <Section title="서브옵션" rows={[...categorySuboptRows, ...subopts]} />
              <Section title="기타" rows={others} />
              <Section title="특이사항" rows={notes} />
            </>
          );
        })()}
      </Stack>
    </Paper>
  );

  return (
    <Container maxWidth="md" sx={{ pt: 6, pb: 6 }}>
      <Typography variant="h4" align="center" fontWeight={900} color="secondary.light" gutterBottom sx={{ mb: 2 }}>
        장비 추천 (영웅별)
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.25, mb: 3 }}>
        <TextField
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="영웅명, 라벨, 옵션으로 검색"
          variant="outlined"
          size="small"
          sx={{ width: 360 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            )
          }}
        />
        <FormControlLabel
          control={<Switch checked={showOnlyWithRecs} onChange={(e) => setShowOnlyWithRecs(e.target.checked)} size="small" />}
          label="추천 있는 영웅만 보기"
        />
      </Box>

      <Box>
        <Typography variant="h5" fontWeight={800} sx={{ mt: 2, mb: 1, color: '#FACC15' }}>
          전설 영웅 ({legendaryHeroes.length})
        </Typography>
        {groupByCategory(legendaryHeroes).map(([cat, list]) => (
          <Paper key={`legendary-cat-${cat}`} variant="outlined" sx={{ mb: 1.5, borderRadius: 2, overflow: 'hidden', borderColor: 'rgba(245, 158, 11, 0.35)' }}>
            <Box
              role="button"
              onClick={() => toggleGroup('legendary', cat)}
              sx={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                cursor: 'pointer', userSelect: 'none',
                px: 1.25, py: 1,
                bgcolor: 'rgba(245, 158, 11, 0.08)',
                '&:hover': { bgcolor: 'rgba(245, 158, 11, 0.14)' }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                {isOpen('legendary', cat) ? (
                  <KeyboardArrowDownIcon sx={{ color: '#F59E0B' }} fontSize="small" />
                ) : (
                  <KeyboardArrowRightIcon sx={{ color: '#F59E0B' }} fontSize="small" />
                )}
                <Typography variant="subtitle1" sx={{ color: '#F59E0B', fontWeight: 800 }}>
                  {cat}
                </Typography>
              </Box>
              <Chip label={list.length} size="small" sx={{ color: '#8B5CF6', bgcolor: 'rgba(250, 204, 21, 0.15)', border: '1px solid rgba(245, 158, 11, 0.35)' }} />
            </Box>
            <Collapse in={isOpen('legendary', cat)} timeout="auto" unmountOnExit>
              <Box sx={{ p: 1.25 }}>
                {list.map((hero) => renderHeroCard(hero, '#FACC15', '#F59E0B'))}
              </Box>
            </Collapse>
          </Paper>
        ))}

        <Typography variant="h5" fontWeight={800} color="primary.light" sx={{ mt: 3, mb: 1 }}>
          희귀 영웅 ({rareHeroes.length})
        </Typography>
        {groupByCategory(rareHeroes).map(([cat, list]) => (
          <Paper key={`rare-cat-${cat}`} variant="outlined" sx={{ mb: 1.5, borderRadius: 2, overflow: 'hidden', borderColor: 'rgba(16, 185, 129, 0.35)' }}>
            <Box
              role="button"
              onClick={() => toggleGroup('rare', cat)}
              sx={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                cursor: 'pointer', userSelect: 'none',
                px: 1.25, py: 1,
                bgcolor: 'rgba(16, 185, 129, 0.08)',
                '&:hover': { bgcolor: 'rgba(16, 185, 129, 0.14)' }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                {isOpen('rare', cat) ? (
                  <KeyboardArrowDownIcon sx={{ color: '#10B981' }} fontSize="small" />
                ) : (
                  <KeyboardArrowRightIcon sx={{ color: '#10B981' }} fontSize="small" />
                )}
                <Typography variant="subtitle1" sx={{ color: '#10B981', fontWeight: 800 }}>
                  {cat}
                </Typography>
              </Box>
              <Chip label={list.length} size="small" sx={{ color: '#22D3EE', bgcolor: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.35)' }} />
            </Box>
            <Collapse in={isOpen('rare', cat)} timeout="auto" unmountOnExit>
              <Box sx={{ p: 1.25 }}>
                {list.map((hero) => renderHeroCard(hero, '#26283c', '#10B981'))}
              </Box>
            </Collapse>
          </Paper>
        ))}

        {(legendaryHeroes.length + rareHeroes.length) === 0 && (
          <Typography align="center" color="text.disabled" sx={{ mt: 6 }}>
            검색 결과가 없습니다.
          </Typography>
        )}
      </Box>
    </Container>
  );
}
