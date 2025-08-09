import React, { useEffect, useState } from "react";
import { Box, Card, CardMedia, Container, Paper, Stack, Typography } from "@mui/material";
import { fetchHeroList, getGradeFromList } from "../heroList";

const growthDungeonData = [
  {
    title: '불의 원소 던전',
    필수: [ { name: '유이' }, { name: '헤브니아' } ],
    추천: [ { name: '파스칼' }, { name: '노호' }, { name: '유이' }, { name: '바네사' }, { name: '리나' } ],
    택1: [ [ { name: '라니아' }, { name: '스파이크' } ] ]
  },
  {
    title: '물의 원소 던전',
    필수: [ { name: '유이' }, { name: '클로에' }, { name: '제인' } ],
    추천: [ { name: '파스칼' }, { name: '리나' }, { name: '바네사' }, { name: '풍연' }, { name: '제인' } ],
    택1: [ [ { name: '쥬피' }, { name: '레이' }, { name: '에반' } ] ]
  },
  {
    title: '땅의 원소 던전',
    필수: [ { name: '유이' }, { name: '에반' }, { name: '레이첼' } ],
    추천: [ { name: '파스칼' }, { name: '레이첼' }, { name: '에반' }, { name: '바네사' }, { name: '리나' } ],
    택1: [ [ { name: '유리' }, { name: '벨리카' }, { name: '제이브' }, { name: '스니퍼' } ] ]
  },
  {
    title: '빛의 원소 던전',
    필수: [ { name: '유이' }, { name: '에반' }, { name: '클로에' }, { name: '조커' } ],
    추천: [ { name: '태오' }, { name: '조커' }, { name: '에반' }, { name: '유이' }, { name: '클로에' } ],
    택1: [ [ { name: '레이첼' }, { name: '세인' } ] ]
  },
  {
    title: '암흑의 원소 던전',
    필수: [ { name: '유이' }, { name: '레오' }, { name: '리' } ],
    추천: [ { name: '파스칼' }, { name: '레오' }, { name: '바네사' }, { name: '아리엘' }, { name: '클로에' } ],
    택1: [ [ { name: '소이' }, { name: '비담' } ] ]
  },
  {
    title: '골드 던전',
    필수: [ { name: '파스칼' }, { name: '빅토리아' } ],
    추천: [ { name: '파스칼' }, { name: '빅토리아' }, { name: '레이첼' }, { name: '아리엘' }, { name: '리나' } ],
    택1: [ [ { name: '레이첼' }, { name: '레오' }, { name: '아수라' } ] ]
  }
];

export default function GrowthDungeonTab() {
  const [heroList, setHeroList] = useState({ rare: [], legendary: [] });
  useEffect(() => {
    fetchHeroList().then(setHeroList);
  }, []);

  return (
    <Container maxWidth="md" sx={{ pt: 6, pb: 6 }}>
      <Typography variant="h4" align="center" fontWeight={900} color="secondary.light" gutterBottom sx={{ mb: 3 }}>
        성장던전 덱 추천
      </Typography>
      <Box>
        {growthDungeonData.map((dungeon) => (
          <Paper key={dungeon.title} elevation={4} sx={{ mb: 4, p: 3, borderRadius: 4, bgcolor: '#23243a', border: '2px solid #26283c' }}>
            <Typography variant="h6" fontWeight={800} color="primary.light" sx={{ mb: 2 }}>
              {dungeon.title}
            </Typography>
            <Stack direction="row" spacing={4} alignItems="flex-start">
              <Box>
                <Typography fontWeight={700} color="secondary.light" sx={{ mb: 1 }}>필수</Typography>
                <Stack direction="row" spacing={1}>
                  {dungeon.필수 && dungeon.필수.map(hero => (
                    <Card key={hero.name} elevation={2} sx={{ width: 56, height: 70, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #A78BFA', bgcolor: '#181A20' }}>
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
              </Box>
              {dungeon.추천 && (
                <Box>
                  <Typography fontWeight={700} color="#FFD600" sx={{ mb: 1 }}>추천</Typography>
                  <Stack direction="row" spacing={1}>
                    {dungeon.추천.map(hero => (
                      <Card key={hero.name} elevation={2} sx={{ width: 56, height: 70, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #FFD600', bgcolor: '#181A20' }}>
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
                </Box>
              )}
              <Box>
                <Typography fontWeight={700} color="primary.light" sx={{ mb: 1 }}>택1</Typography>
                <Stack direction="row" spacing={2}>
                  {dungeon.택1 && dungeon.택1.map((group, i) => (
                    <Stack key={i} direction="row" spacing={1}>
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
            </Stack>
          </Paper>
        ))}
      </Box>
    </Container>
  );
}
