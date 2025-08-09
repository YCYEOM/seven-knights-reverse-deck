import React, { useEffect, useState } from "react";
import { Box, Card, CardMedia, Container, Paper, Stack, Typography } from "@mui/material";
import { fetchHeroList, getGradeFromList } from "../heroList";

// TODO: 사용자 제공 이미지(조합) 기준으로 아래 영웅명 배열을 채워주세요.
// 예) { title: '파멸의 눈동자', 필수: [ { name: '유이' }, { name: '헤브니아' } ], 택1: [ [ { name: '라니아' }, { name: '스파이크' } ] ] }
const raidData = [
  {
    title: '파멸의 눈동자',
    필수: [ { name: '유이' }, { name: '에반' }, { name: '레이첼' } ],
    추천: [ { name: '세인' }, { name: '에반' }, { name: '에이스' }, { name: '유이' }, { name: '레이첼' } ],
    // 택1: 세인 또는 쥬피 중 택1
    택1: [ [ { name: '세인' } ], [ { name: '쥬피' } ] ],
  },
  {
    title: '우마왕',
    필수: [ { name: '유이' }, { name: '에반' }, { name: '블랙로즈' }, { name: '카론' } ],
    추천: [ { name: '에스파다' }, { name: '블랙로즈' }, { name: '카론' }, { name: '연희' }, { name: '리나' } ],
    // 택1: 에스파다 또는 스니퍼 중 택1
    택1: [ [ { name: '에스파다' } ], [ { name: '스니퍼' } ] ],
  },
  {
    title: '강철의 포식자',
    필수: [ { name: '빅토리아' }, { name: '루시' }, { name: '아수라' } ],
    추천: [ { name: '파스칼' }, { name: '빅토리아' }, { name: '루시' }, { name: '에이스' }, { name: '아수라' } ],
    // 택1: 아수라 또는 유리 중 택1
    택1: [ [ { name: '아수라' } ], [ { name: '유리' } ] ],
  },
];

export default function RaidTab() {
  const [heroList, setHeroList] = useState({ rare: [], legendary: [] });
  useEffect(() => {
    fetchHeroList().then(setHeroList);
  }, []);

  return (
    <Container maxWidth="md" sx={{ pt: 6, pb: 6 }}>
      <Typography variant="h4" align="center" fontWeight={900} color="primary.light" gutterBottom sx={{ mb: 3 }}>
        레이드 덱 추천
      </Typography>
      <Box>
        {raidData.map((raid) => (
          <Paper key={raid.title} elevation={4} sx={{ mb: 4, p: 3, borderRadius: 4, bgcolor: '#23243a', border: '2px solid #26283c' }}>
            <Typography variant="h6" fontWeight={800} color="primary.light" sx={{ mb: 2 }}>
              {raid.title}
            </Typography>
            <Stack direction="row" spacing={4} alignItems="flex-start">
              {/* 좌측: 필수 */}
              <Box>
                <Typography fontWeight={700} color="secondary.light" sx={{ mb: 1 }}>필수</Typography>
                <Stack direction="row" spacing={1}>
                  {raid.필수 && raid.필수.length > 0 ? (
                    raid.필수.map(hero => (
                      <Card key={hero.name} elevation={2} sx={{ width: 56, height: 70, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #A78BFA', bgcolor: '#181A20' }}>
                        <CardMedia
                          component="img"
                          image={`${import.meta.env.BASE_URL}heroes/${getGradeFromList(hero.name, heroList)}/${hero.name}.png`}
                          alt={hero.name}
                          sx={{ width: 52, height: 66, objectFit: 'cover', borderRadius: 1.5 }}
                          onError={e => { e.target.onerror = null; e.target.src = `${import.meta.env.BASE_URL}heroes/placeholder.png`; }}
                        />
                      </Card>
                    ))
                  ) : (
                    <Typography color="text.disabled">이미지 준비중</Typography>
                  )}
                </Stack>
              </Box>

              {/* 가운데: 추천 */}
              <Box>
                <Typography fontWeight={700} color="#FFD600" sx={{ mb: 1 }}>추천</Typography>
                <Stack direction="row" spacing={1}>
                  {raid.추천 && raid.추천.length > 0 ? (
                    raid.추천.map(hero => (
                      <Card key={hero.name} elevation={2} sx={{ width: 56, height: 70, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #FFD600', bgcolor: '#181A20' }}>
                        <CardMedia
                          component="img"
                          image={`${import.meta.env.BASE_URL}heroes/${getGradeFromList(hero.name, heroList)}/${hero.name}.png`}
                          alt={hero.name}
                          sx={{ width: 52, height: 66, objectFit: 'cover', borderRadius: 1.5 }}
                          onError={e => { e.target.onerror = null; e.target.src = `${import.meta.env.BASE_URL}heroes/placeholder.png`; }}
                        />
                      </Card>
                    ))
                  ) : (
                    <Typography color="text.disabled">이미지 준비중</Typography>
                  )}
                </Stack>
              </Box>

              {/* 우측: 택1 (여러 묶음 그룹을 가질 수 있음) */}
              <Box>
                <Typography fontWeight={700} color="primary.light" sx={{ mb: 1 }}>택1</Typography>
                <Stack direction="row" spacing={2}>
                  {raid.택1 && raid.택1.length > 0 ? (
                    raid.택1.map((group, idx) => (
                      <Stack key={idx} direction="row" spacing={1}>
                        {group.map(hero => (
                          <Card key={hero.name} elevation={2} sx={{ width: 56, height: 70, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #3B82F6', bgcolor: '#181A20' }}>
                            <CardMedia
                              component="img"
                              image={`${import.meta.env.BASE_URL}heroes/${getGradeFromList(hero.name, heroList)}/${hero.name}.png`}
                              alt={hero.name}
                              sx={{ width: 52, height: 66, objectFit: 'cover', borderRadius: 1.5 }}
                              onError={e => { e.target.onerror = null; e.target.src = `${import.meta.env.BASE_URL}heroes/placeholder.png`; }}
                            />
                          </Card>
                        ))}
                      </Stack>
                    ))
                  ) : (
                    <Typography color="text.disabled">이미지 준비중</Typography>
                  )}
                </Stack>
              </Box>
            </Stack>
          </Paper>
        ))}
      </Box>
    </Container>
  );
}
