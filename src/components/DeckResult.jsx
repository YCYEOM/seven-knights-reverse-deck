import React from "react";
import { Card, CardContent, Typography, Chip, Stack, Box, List, ListItem, ListItemText } from "@mui/material";
import GroupIcon from '@mui/icons-material/Group';
import HeroImages from "./HeroImages";

export default function DeckResult({ deck }) {
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
