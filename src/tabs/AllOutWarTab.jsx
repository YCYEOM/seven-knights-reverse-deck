import React, { useEffect, useState } from "react";
import { Box, Card, CardMedia, Container, Paper, Stack, Typography, Divider } from "@mui/material";
import { fetchHeroList, getGradeFromList } from "../heroList";

// TODO: 총력전(보스/스테이지)별 조합 데이터를 아래 형식으로 추가하세요.
// 예)
// {
//   title: '예시 보스',
//   추천: [ { name: '루리' }, { name: '레이첼' } ],
//   택1: [ [ { name: '세인' } ], [ { name: '쥬피' } ] ], // 여러 묶음 중 택1
// }
const allOutWarData = [
  {
    title: '파이공덱',
    추천: [ { name: '파이' }, { name: '태오' }, { name: '델론즈' }, { name: '아일린' }, { name: '콜트' } ],
    스킬추천: [
      '추천1 파이1스 > 콜트1스 > 콜트2스',
      '추천2 파이1스 > 태오2스 > 콜트2스 (방덱저격)'
    ],
  },
  {
    title: '태오공덱',
    추천: [ { name: '태오' }, { name: '델론즈' }, { name: '아일린' }, { name: '에이스' } ],
    택1: [ [ { name: '스파이크' }, { name: '유신' } ] ],
    스킬추천: [
      '추천 아일린2스 > 태오2스> 태오1스'
    ],
  },
  {
    title: '마덱1',
    추천: [ { name: '멜키르' }, { name: '바네사' }, { name: '린' }, { name: '연희' } ],
    택1: [ [ { name: '유신' }, { name: '쥬리' } ] ],
    스킬추천: [
      '추천1 린2스 > 멜키르2스 > 연희2스 (방덱저격)',
      '추천2 린2스 > 멜키르1스 > 연희2스',
      '추천3 린2스 > 쥬리2스 > 연희2스'
    ],
  },
  {
    title: '마덱2',
    추천: [ { name: '니아' }, { name: '멜키르' }, { name: '연희' } ],
    // "택2" 요구를 두 개의 선택 그룹으로 표시합니다.
    택1: [
      [ { name: '로지' }, { name: '린' }, { name: '유신' }, { name: '바네사' } ],
    ],
    스킬추천: [
      '추천1 니아2스 > 멜키르2스 > 연희2스 or 린2스'
    ],
  },
  {
    title: '방덱1',
    추천: [ { name: '카르마' }, { name: '루디' }, { name: '엘리스' }, { name: '제이브' } ],
    택1: [ [ { name: '헬레니아' }, { name: '로지' } ] ],
    스킬추천: [
      '추천1 루디2스 > 헬레1스 > 카르마2스'
    ],
  },
  {
    title: '방덱2',
    추천: [ { name: '제이브' }, { name: '루디' }, { name: '엘리스' }, { name: '룩' } ],
    택1: [ [ { name: '로지' }, { name: '스파이크' }, { name: '챈슬러' } ] ],
    스킬추천: [
      '추천1 루디2스 > 룩2스 > 제이브1스',
      '추천2 루디2스 > 챈슬러2스 > 제이브1스'
    ],
  },
  {
    title: '즉사덱',
    추천: [ { name: '크리스' }, { name: '녹스' }, { name: '카린' } ],
    // 추천 하위에서 에반/룩은 택1로 선택하도록 별도 그룹 제공
    추천택1: [ [ { name: '에반' }, { name: '룩' } ] ],
    // 우측 택1은 기존처럼 엘리스/아일린/로지
    택1: [
      [ { name: '엘리스' }, { name: '아일린' }, { name: '로지' } ],
    ],
    스킬추천: [
      '추천1 녹스1스 > 에반 or 룩 2스 > 크리스2스',
      '추천2 녹스1스 > 크리스2스 > 녹스2스',
      '추천3 녹스1스 > 헬레1스 > 크리스2스',
      '추천4 에반2스 > 헬레1스 > 크리스2스'
    ],
  },
];

export default function AllOutWarTab() {
  const [heroList, setHeroList] = useState({ rare: [], legendary: [] });
  useEffect(() => { fetchHeroList().then(setHeroList); }, []);

  return (
    <Container maxWidth="md" sx={{ pt: 6, pb: 6 }}>
      <Typography variant="h4" align="center" fontWeight={900} color="secondary.light" gutterBottom sx={{ mb: 3 }}>
        총력전 덱 추천
      </Typography>
      <Box>
        {allOutWarData.map((section) => (
          <Paper key={section.title} elevation={4} sx={{ mb: 4, p: 3, borderRadius: 4, bgcolor: '#23243a', border: '2px solid #26283c' }}>
            <Typography variant="h6" fontWeight={800} color="primary.light" sx={{ mb: 2 }}>
              {section.title}
            </Typography>

            <Stack direction="row" spacing={4} alignItems="flex-start">
              {/* 좌측: 추천 */}
              <Box>
                <Typography fontWeight={700} color="#FFD600" sx={{ mb: 1 }}>추천</Typography>
                <Stack direction="row" spacing={1}>
                  {section.추천 && section.추천.length > 0 ? (
                    section.추천.map(hero => (
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
                {section.추천택1 && section.추천택1.length > 0 && (
                  <Box sx={{ mt: 1.5 }}>
                    <Typography variant="caption" color="#FFD600" sx={{ mb: 0.5, display: 'block' }}>추천 택1</Typography>
                    <Stack direction="row" spacing={2}>
                      {section.추천택1.map((group, idx) => (
                        <Stack key={idx} direction="row" spacing={1}>
                          {group.map(hero => (
                            <Card key={hero.name} elevation={2} sx={{ width: 56, height: 70, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed #FFD600', bgcolor: '#181A20' }}>
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
                      ))}
                    </Stack>
                  </Box>
                )}
              </Box>

              {/* 우측: 택1 (여러 묶음 그룹을 가질 수 있음) */}
              {section.택1 && section.택1.length > 0 && (
                <Box>
                  <Typography fontWeight={700} color="primary.light" sx={{ mb: 1 }}>택1</Typography>
                  <Stack direction="row" spacing={2}>
                    {section.택1.map((group, idx) => (
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
                    ))}
                  </Stack>
                </Box>
              )}
            </Stack>

            {section.스킬추천 && section.스킬추천.length > 0 && (
              <>
                <Divider sx={{ my: 2, borderColor: '#2E3148' }} />
                <Box>
                  <Typography fontWeight={700} color="#9CA3AF" sx={{ mb: 1 }}>스킬 순서</Typography>
                  <Stack spacing={0.5}>
                    {section.스킬추천.map((line, idx) => (
                      <Typography key={idx} color="#E5E7EB" variant="body2">{line}</Typography>
                    ))}
                  </Stack>
                </Box>
              </>
            )}
          </Paper>
        ))}
      </Box>
    </Container>
  );
}
