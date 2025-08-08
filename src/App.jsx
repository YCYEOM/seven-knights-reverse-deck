import React, { useState, useEffect } from "react";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Container, Box, Typography, TextField, Paper, Card, CardContent, CardMedia, Chip, Stack, List, ListItem, ListItemIcon, Divider, AppBar, Toolbar, CssBaseline, ListItemText } from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import SearchIcon from '@mui/icons-material/Search';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';

const lolchessTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: { main: '#3B82F6' }, // blue-500
        secondary: { main: '#A78BFA' }, // purple-400
        background: {
            default: '#181A20',
            paper: '#23243a',
        },
        text: {
            primary: '#F1F5F9',
            secondary: '#A3A3A3',
            disabled: '#6B7280',
        },
    },
    typography: {
        fontFamily: 'Pretendard, Noto Sans KR, sans-serif',
        h3: { fontWeight: 900 },
        h5: { fontWeight: 700 },
        body1: { fontWeight: 500 },
    },
    shape: { borderRadius: 14 },
});

function HeroImages({ heroes }) {
    if (!heroes || heroes.length === 0) return null;
    return (
        <Stack direction="row" spacing={1.2} justifyContent="center" alignItems="center" sx={{ mb: 2, flexWrap: 'wrap' }}>
            {heroes.map(({ name, grade }) => (
                <Card
                    key={name}
                    elevation={0}
                    sx={{
                        width: 56,
                        height: 70,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 2.5,
                        border: grade === 'legendary' ? '2.5px solid #FFD600' : grade === 'rare' ? '2.5px solid #6C63D8' : '2.5px solid #3B82F6',
                        background: 'linear-gradient(135deg,#23243a 60%,#23243a 100%)',
                        mx: 0.5,
                        my: 0.5,
                        boxShadow: '0 4px 16px 0 rgba(0,0,0,0.18)'
                    }}
                >
                    <CardMedia
                        component="img"
                        image={`${import.meta.env.BASE_URL}heroes/${grade}/${name}.png`}
                        alt={name}
                        sx={{ width: 52, height: 66, objectFit: 'cover', borderRadius: 1.5, filter: 'drop-shadow(0 2px 6px #0008)' }}
                        onError={e => { e.target.onerror=null; e.target.src=`${import.meta.env.BASE_URL}heroes/placeholder.png`; }}
                    />
                </Card>
            ))}
        </Stack>
    );
}

function DeckSelector({ decks, onSelect }) {
    const [input, setInput] = useState("");
    const [filtered, setFiltered] = useState(decks);

    useEffect(() => {
        setFiltered(
            decks.filter(
                (d) =>
                    d.combination.includes(input) ||
                    d.type.includes(input) ||
                    d.counters.some((c) => c.enemy.includes(input))
            )
        );
    }, [input, decks]);

    return (
        <Box mb={4}>
            <TextField
                fullWidth
                variant="outlined"
                placeholder="상대 조합 또는 키워드 입력 (예: 루디, 태오, 방덱 등)"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                InputProps={{
                    startAdornment: <SearchIcon sx={{ color: '#A78BFA', mr: 1, fontSize: 24 }} />,
                    style: {
                        background: 'rgba(36,40,60,0.97)',
                        borderRadius: 16,
                        border: 'none',
                        boxShadow: '0 2px 12px 0 #0005',
                        color: '#F1F5F9',
                        fontWeight: 600,
                        fontSize: 17
                    }
                }}
                sx={{
                    mb: 1,
                    '& .MuiOutlinedInput-root': {
                        background: 'rgba(36,40,60,0.97)',
                        borderRadius: 2.5,
                        border: 'none',
                        boxShadow: '0 2px 12px 0 #0005',
                        color: '#F1F5F9',
                        fontWeight: 600,
                        fontSize: 17,
                        '& fieldset': { border: 'none' },
                        '&:hover fieldset': { border: 'none' },
                        '&.Mui-focused fieldset': { border: '2px solid #A78BFA' },
                    },
                    input: { color: '#F1F5F9', fontWeight: 600, fontSize: 17 },
                }}
            />
            <Paper
                variant="outlined"
                sx={{
                    maxHeight: 360,
                    minHeight: 120,
                    bgcolor: 'background.paper',
                    borderRadius: 1, // 더 작게 조정
                    borderColor: 'primary.dark',
                    boxShadow: 3,
                    p: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                }}
            >
                <PerfectScrollbar style={{ maxHeight: 360, minHeight: 120 }} option={{ suppressScrollX: true }}>
                    <List disablePadding>
                        {filtered.length === 0 && (
                            <ListItem>
                                <Typography color="text.disabled" sx={{ width: '100%', textAlign: 'center', py: 2 }}>
                                    검색 결과 없음
                                </Typography>
                            </ListItem>
                        )}
                        {filtered.map((deck) => (
                            <React.Fragment key={deck.id}>
                                <ListItem
                                    button
                                    onClick={() => onSelect(deck)}
                                    sx={{
                                        bgcolor: 'transparent',
                                        borderRadius: 2.5,
                                        my: 1,
                                        mx: 1.5,
                                        boxShadow: '0 2px 10px 0 #0003',
                                        transition: 'all 0.15s',
                                        '&:hover': {
                                            bgcolor: 'primary.dark',
                                            transform: 'scale(1.025)',
                                            boxShadow: '0 4px 18px 0 #3B82F688',
                                        },
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 2,
                                        p: 2,
                                    }}
                                >
                                    <ListItemIcon sx={{ minWidth: 38 }}>
                                        <SportsEsportsIcon color="primary" fontSize="medium" />
                                    </ListItemIcon>
                                    <Box>
                                        <Typography fontWeight={700} color="primary.light" sx={{ fontSize: 17, mb: 0.5 }}>
                                            [{deck.type}]
                                        </Typography>
                                        <Typography color="text.primary" sx={{ fontSize: 16, fontWeight: 600 }}>
                                            {deck.combination}
                                        </Typography>
                                    </Box>
                                </ListItem>
                                <Divider sx={{ bgcolor: 'primary.dark', opacity: 0.18 }} />
                            </React.Fragment>
                        ))}
                    </List>
                </PerfectScrollbar>
            </Paper>
        </Box>
    );
}

function DeckResult({ deck }) {
    if (!deck) return null;
    return (
        <Card elevation={8} sx={{ borderRadius: 4, mb: 4, bgcolor: 'background.paper', px: 2, py: 3, border: '2px solid #26283c', boxShadow: '0 6px 32px 0 #000a' }}>
            <CardContent>
                <HeroImages heroes={deck.heroes} />
                <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                    <GroupIcon color="secondary" />
                    <Typography variant="h6" fontWeight={800} color="primary.light" sx={{ flex: 1 }}>{deck.combination}</Typography>
                </Stack>
                <Stack direction="row" spacing={2} mb={2}>
                    <Chip label={deck.type} color="primary" sx={{ fontWeight: 700, fontSize: 15, px: 1.5, bgcolor: '#23243a', color: '#3B82F6', border: '1.5px solid #3B82F6' }} />
                    {deck.condition && <Chip label={`조건: ${deck.condition}`} color="secondary" sx={{ fontWeight: 700, fontSize: 15, px: 1.5, bgcolor: '#23243a', color: '#A78BFA', border: '1.5px solid #A78BFA' }} />}
                </Stack>
                <Box>
                    <Typography fontWeight={700} color="text.secondary" mb={1}>상대 조합별 전략</Typography>
                    <List dense>
                        {deck.counters.map((c, i) => (
                            <ListItem key={i}>
                                <ListItemText
                                    primary={<span style={{ fontWeight: 600 }}>{c.enemy}</span>}
                                    secondary={c.recommend && <span style={{ color: '#3B82F6', fontWeight: 700 }}>→ {c.recommend}</span>}
                                />
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </CardContent>
        </Card>
    );
}

export default function App() {
    const [decks, setDecks] = useState([]);
    const [selected, setSelected] = useState(null);

    useEffect(() => {
        fetch(import.meta.env.BASE_URL + 'deckdata.json')
            .then((r) => r.json())
            .then(setDecks);
    }, []);

    return (
        <ThemeProvider theme={lolchessTheme}>
            <CssBaseline />
            <AppBar position="static" elevation={0} sx={{ bgcolor: 'background.paper', borderBottom: '2px solid #23243a', mb: 4 }}>
                <Toolbar sx={{ justifyContent: 'center', minHeight: 64 }}>
                    <Typography variant="h4" fontWeight={900} color="primary.light" sx={{ letterSpacing: 1.5 }}>
                        세븐나이츠 리버스 덱 추천
                    </Typography>
                </Toolbar>
            </AppBar>
            <Container maxWidth="sm" sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
                <Box textAlign="center" mb={4}>
                    <Typography variant="h5" fontWeight={700} color="text.primary">
                        상대 조합에 따라 최적의 덱과 전략을 추천해드립니다.
                    </Typography>
                </Box>
                <DeckSelector decks={decks} onSelect={setSelected} />
                <DeckResult deck={selected} />
                {!selected && (
                    <Typography align="center" color="text.disabled" fontStyle="italic" mt={4}>
                        상대 조합이나 키워드를 입력하면 추천 덱이 바로 나옵니다.
                    </Typography>
                )}
                <Box mt={8} textAlign="center">
                    <Typography variant="caption" color="text.secondary">
                        2025 세븐나이츠 리버스 덱 추천 | made by{'크리조트, 엉씰'}
                    </Typography>
                </Box>
            </Container>
        </ThemeProvider>
    );
}
