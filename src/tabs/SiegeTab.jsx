import React, { useEffect, useState } from "react";
import { Box, Card, CardMedia, Container, Divider, Paper, Stack, Tooltip, Typography } from "@mui/material";
import { fetchHeroList, getGradeFromList } from "../heroList";

// 요일 순서: 월~일
// 월: 수호자의 성, 화: 포디나의 성, 수: 불멸의 성, 목: 죽음의 성, 금: 고대용의 성, 토: 혹한의 성, 일: 지옥의 성
// 각 항목은 필수 영웅 배열과 택1 세부 그룹(딜러/힐러/토템)을 가집니다. 이름은 이미지 파일명과 동일해야 합니다.
const siegeData = [
  { day: '월', title: '수호자의 성',   필수: [ { name: '에반' }, { name: '아리엘' } ], 추천: [ { name: '루리' }, { name: '리나' }, { name: '에반' }, { name: '바네사' }, { name: '연희' } ], 택1: { 딜러: [ { name: '세라' }, { name: '루리' } ], 힐러: [ { name: '리나' }, { name: '유이' } ], 토템: [ { name: '노호' }, { name: '조커' }, { name: '소이' }, { name: '바네사', note: '2초월 이상' } ] },
    skillOrder: [
      '연희1 바네사2 리나2 바네사1 루리2',
      '루리1 연희2 에반2 연희1 바네사1',
      '바네사2 리나2 루리2 루리1 리나1',
      '바네사1 연희1 바네사2 루리2 루리1',
    ],
    skillTip: '2라운드 바네사 원콤 안나면 스킬순서 4번 바네사2스킬 생략'
  },
  { day: '화', title: '포디나의 성',   필수: [ { name: '클로에' }, { name: '세라' } ], 추천: [ { name: '루리' }, { name: '리나' }, { name: '클로에' }, { name: '바네사' }, { name: '연희' } ], 택1: { 딜러: [ { name: '아리엘' }, { name: '루리' } ], 힐러: [ { name: '리나' }, { name: '유이' } ], 토템: [ { name: '바네사' }, { name: '에이스' }, { name: '레이첼' } ] },
    skillOrder: [
      '연희1 바네사2 리나2 루리2 루리1',
      '클로에2 연희2 바네사1 연희1 루리2',
      '루리1 리나1 클로에2 리나2 바네사1',
      '연희1 루리2 루리1 연희2 바네사2',
    ],
    skillTip: '죽을꺼 같으면 힐먼저'
  },
  { day: '수', title: '불멸의 성',     필수: [ { name: '클로에' }, { name: '아리엘' } ], 추천: [ { name: '루리' }, { name: '리나' }, { name: '아리엘' }, { name: '바네사' }, { name: '연희' } ], 택1: { 딜러: [ { name: '세라' }, { name: '루리' } ], 힐러: [ { name: '리나' }, { name: '유이' } ], 토템: [ { name: '에이스' }, { name: '레이첼' } ] },
    skillOrder: [
      '아리엘2 바네사2 아리엘1 리나2 바네사1',
      '루리2 루리1 연희1 아리엘1 아리엘2',
      '리나1 바네사1 루리2 루리1 아리엘1',
      '리나2 (연희1 or 바네사2) 루리2 루리1'
    ],
    skillTip: '마지막쯤 남아있는 딜러로 딜 욱여넣기'
  },
  { day: '목', title: '죽음의 성',     필수: [ { name: '진' }, { name: '리' }, { name: '타카' } ], 추천: [ { name: '타카' }, { name: '리나' }, { name: '파이' }, { name: '레이첼' }, { name: '진' }, { name: '에이스' } ], 추천딜러: [ { name: '파이' }, { name: '레이첼' } ], 택1: { 토템2: [ { name: '리나' }, { name: '에이스' }, { name: '레이첼' } ] },
    skillOrderGrouped: {
      '파이덱': [
        '진1 진2 리나2 에이스2 타카1',
        '타카2 리나1 파이2 파이1 진2',
        '에이스2 타카1 타카2 진1 리나1',
        '리나2 진2 타카2 타카1 진1',
      ],
      '레이첼덱': [
        '진1 진2 리나2 에이스2 타카1',
        '타카2 리나1 레이첼1 레이첼2 진2',
        '타카1 타카2 진1 리나2 레이첼2',
        '리나1 레이첼1 타카2 타카1 진2',
      ]
    },
    skillTip: '파이덱(고득점 가능)은 안정성이 약간 떨어지고, 레이첼덱이 상대에 따라 더 안정적'
  },
  { day: '금', title: '고대용의 성',   필수: [ { name: '유이' }, { name: '에반' }, { name: '타카' } ], 추천: [ { name: '타카' }, { name: '리나' }, { name: '레이첼' }, { name: '지크' }, { name: '유이' } ], 택1: { 서브딜러: [ { name: '비담' }, { name: '풍연' } ], 토템: [ { name: '리나' }, { name: '에이스' }, { name: '레이첼' }, { name: '바네사' } ] },
    skillOrder: [
      '타카1 타카2 레이첼2 유이1 리나2',
      '지크1 레이첼1 타카1 타카2 지크1',
      '레이첼2 유이1 리나2 타카1 타카2',
      '리나1 지크1 레이첼1 레이첼2 타카2',
    ],
    skillTip: '타카2스가 상대 체력30프로 이하일때 딜이 더들어감'
  },
  { day: '토', title: '혹한의 성',     필수: [ { name: '풍연' }, { name: '타카' } ], 추천: [ { name: '타카' }, { name: '리나' }, { name: '레이첼' }, { name: '바네사' }, { name: '풍연' } ], 택1: { 서브딜러: [ { name: '비담' }, { name: '레이첼' } ], 토템: [ { name: '리나' }, { name: '에이스' } ], 디버프해제: [ { name: '노호' }, { name: '조커' }, { name: '소이' }, { name: '바네사', note: '2초월 이상' } ] },
    skillOrder: [
      '풍연1 풍연2 레이첼2 바네사1 리나2',
      '타카1 타카2 풍연1 풍연2 레이첼1',
      '바네사1 레이첼2 타카1 타카2 리나2',
      '풍연2 바네사1 레이첼2 타카2 타카1',
    ],
    skillTip: '분쇄 이후 디버프해제 필요, 타카1스만으로 상대체력 30퍼 이하를 못만들경우 바네사2스 이후 타카2스'
  },
  { day: '일', title: '지옥의 성',     필수: [ { name: '레오' }, { name: '아수라' }, { name: '세인' }, { name: '파스칼' } ], 추천: [ { name: '파스칼' }, { name: '레오' }, { name: '에스파다' }, { name: '바네사' }, { name: '아수라' } ], 택1: { 토템: [ { name: '에이스' }, { name: '레이첼' }, { name: '리나' } ] },
    skillOrder: [
      '바네사2 바네사1 아수라1 에스파다1 파스칼2',
      '파스칼1 파스칼2 아수라2 파스칼1 파스칼2',
      '에스파다1 아수라1 파스칼1 아수라2 파스칼2',
      '파스칼1 파스칼2 에스파다2 파스칼1 파스칼2',
    ],
    skillTip: '48턴쯤 파스칼2스킬을 사용시 1스킬 쿨이 12초쯤 와야 스킬쿨이 딱 맞는데 가끔 스킬쿨이 씹힘 (씹히면 재시도)'
  },
];

function HeroCard({ name, heroList, borderColor, note }) {
  if (!name) return null;
  const grade = getGradeFromList(name, heroList);
  const card = (
    <Card elevation={2} sx={{ width: 56, height: 70, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `2px solid ${borderColor}`, bgcolor: '#181A20' }}>
      <CardMedia
        component="img"
        image={`${import.meta.env.BASE_URL}heroes/${grade}/${name}.png`}
        alt={name}
        sx={{ width: 52, height: 66, objectFit: 'cover', borderRadius: 1.5 }}
        onError={e => { e.target.onerror = null; e.target.src = `${import.meta.env.BASE_URL}heroes/placeholder.png`; }}
      />
    </Card>
  );
  return note ? (
    <Tooltip title={note} arrow>
      {card}
    </Tooltip>
  ) : card;
}

function GroupRow({ title, names, heroList, color }) {
  return (
    <Box>
      <Typography fontWeight={700} color={color} sx={{ mb: 1 }}>{title}</Typography>
      <Stack direction="row" spacing={1}>
        {names && names.length > 0 ? (
          names.map((n) => <HeroCard key={n.name} name={n.name} note={n.note} heroList={heroList} borderColor={color === 'secondary.light' ? '#A78BFA' : color === 'primary.light' ? '#3B82F6' : '#22c55e'} />)
        ) : (
          <Typography color="text.disabled">이미지 준비중</Typography>
        )}
      </Stack>
    </Box>
  );
}

export default function SiegeTab() {
  const [heroList, setHeroList] = useState({ rare: [], legendary: [] });
  useEffect(() => { fetchHeroList().then(setHeroList); }, []);

  return (
    <Container maxWidth="lg" sx={{ pt: 6, pb: 6 }}>
      <Typography variant="h4" align="center" fontWeight={900} color="secondary.light" gutterBottom sx={{ mb: 3 }}>
        공성전 덱 추천 (요일별)
      </Typography>
      <Box>
        {siegeData.map((fort) => (
          <Paper key={fort.title} elevation={4} sx={{ mb: 4, p: 3, borderRadius: 4, bgcolor: '#23243a', border: '2px solid #26283c' }}>
            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
              <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 1 }}>{fort.day}</Typography>
              <Typography variant="h6" fontWeight={800} color="primary.light">{fort.title}</Typography>
            </Stack>

            <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} alignItems="flex-start">
              {/* 좌측: 필수 */}
              <Box sx={{ minWidth: 240 }}>
                <Typography fontWeight={700} color="secondary.light" sx={{ mb: 1 }}>필수</Typography>
                <Stack direction="row" spacing={1}>
                  {fort.필수 && fort.필수.length > 0 ? (
                    fort.필수.map(h => (
                      <HeroCard key={h.name} name={h.name} heroList={heroList} borderColor="#A78BFA" />
                    ))
                  ) : (
                    <Typography color="text.disabled">이미지 준비중</Typography>
                  )}
                </Stack>
              </Box>

              {/* 가운데: 추천 */}
              <Box sx={{ minWidth: 240 }}>
                <Typography fontWeight={700} color="#FFD600" sx={{ mb: 1 }}>추천</Typography>
                <Stack direction="column" spacing={1}>
                  <Stack direction="row" spacing={1}>
                    {fort.추천 && fort.추천.length > 0 ? (
                      fort.추천
                        .filter(h => !(fort.추천딜러 && fort.추천딜러.some(d => d.name === h.name)))
                        .map(h => (
                          <HeroCard key={h.name} name={h.name} heroList={heroList} borderColor="#FFD600" />
                        ))
                    ) : (
                      <Typography color="text.disabled">이미지 준비중</Typography>
                    )}
                  </Stack>

                  {fort.추천딜러 && fort.추천딜러.length > 0 && (
                    <Box>
                      <Typography variant="caption" color="#FFD600" sx={{ pl: 0.5, display: 'block', mb: 0.5 }}>서브딜러 (택1)</Typography>
                      <Stack direction="row" spacing={1}>
                        {fort.추천딜러.map(h => (
                          <HeroCard key={h.name} name={h.name} heroList={heroList} borderColor="#FFD600" />
                        ))}
                      </Stack>
                    </Box>
                  )}
                </Stack>
              </Box>

              {/* 구분선 (반응형에서만 표시) */}
              <Divider flexItem orientation="vertical" sx={{ display: { xs: 'none', md: 'block' }, borderColor: '#2f3046' }} />

              {/* 우측: 택1/택2 - 동적 그룹 렌더링 */}
              <Stack direction="row" spacing={4} flexWrap="wrap">
                {(() => {
                  const rows = [];
                  const g = fort.택1 || {};
                  if (g.딜러) rows.push(<GroupRow key="딜러" title="딜러 (택1)" names={g.딜러} heroList={heroList} color="primary.light" />);
                  if (g.서브딜러) rows.push(<GroupRow key="서브딜러" title="서브딜러 (택1)" names={g.서브딜러} heroList={heroList} color="primary.light" />);
                  if (g.힐러) rows.push(<GroupRow key="힐러" title="힐러 (택1)" names={g.힐러} heroList={heroList} color="secondary.light" />);
                  if (g.디버프해제) rows.push(<GroupRow key="디버프해제" title="디버프해제 (택1)" names={g.디버프해제} heroList={heroList} color="#FFD600" />);
                  if (g.토템) rows.push(<GroupRow key="토템" title="토템 (택1)" names={g.토템} heroList={heroList} color="#22c55e" />);
                  if (g.토템2) rows.push(<GroupRow key="토템2" title="토템 (택2)" names={g.토템2} heroList={heroList} color="#22c55e" />);
                  return rows;
                })()}
              </Stack>
            </Stack>

            {/* 스킬 순서 표시 (단일/그룹 모두 지원) */}
            {(fort.skillOrderGrouped || (fort.skillOrder && fort.skillOrder.length > 0)) && (
              <Box sx={{ mt: 2 }}>
                <Divider sx={{ borderColor: '#2f3046', mb: 1 }} />
                <Typography variant="subtitle2" color="secondary.light" sx={{ mb: 1, fontWeight: 800 }}>스킬 순서</Typography>
                {fort.skillOrderGrouped ? (
                  <Stack spacing={1.5}>
                    {Object.entries(fort.skillOrderGrouped).map(([variant, lines]) => (
                      <Box key={variant}>
                        <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 800, mb: 0.5 }}>{variant}</Typography>
                        <Stack spacing={0.5}>
                          {lines.map((line, idx) => (
                            <Typography key={idx} variant="body2" color="text.secondary">{idx + 1}. {line}</Typography>
                          ))}
                        </Stack>
                      </Box>
                    ))}
                  </Stack>
                ) : (
                  <Stack spacing={0.5}>
                    {fort.skillOrder.map((line, idx) => (
                      <Typography key={idx} variant="body2" color="text.secondary">{idx + 1}. {line}</Typography>
                    ))}
                  </Stack>
                )}
              </Box>
            )}

            {fort.skillTip && (
              <Box sx={{ mt: 1.5 }}>
                <Typography variant="body2" color="text.secondary">팁: {fort.skillTip}</Typography>
              </Box>
            )}
          </Paper>
        ))}
      </Box>
    </Container>
  );
}
