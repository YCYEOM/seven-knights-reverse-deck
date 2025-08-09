import React, { useEffect, useState } from "react";
import { Box, Paper, TextField, Typography, List, ListItem, ListItemIcon, Divider } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';

export default function DeckSelector({ decks, onSelect }) {
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
          borderRadius: 1,
          borderColor: 'primary.dark',
          boxShadow: 3,
          p: 0,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <PerfectScrollbar style={{ maxHeight: 220, minHeight: 80 }} option={{ suppressScrollX: true }}>
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
