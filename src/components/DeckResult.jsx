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
            {(deck.counters || []).map((c, i) => (
              <ListItem key={i} alignItems="flex-start" sx={{ flexDirection: 'column', alignItems: 'stretch' }}>
                <ListItemText
                  primary={<span style={{ fontWeight: 600 }}>{c.enemy}</span>}
                  secondary={c.recommend && <span style={{ color: '#3B82F6', fontWeight: 700 }}>→ {c.recommend}</span>}
                />
                {/* per-counter skill orders (up to 3 sets) */}
                {(() => {
                  const sets = [c.skillOrder, c.skillOrder2, c.skillOrder3].filter(
                    (arr) => Array.isArray(arr) && arr.length > 0
                  );
                  if (sets.length === 0) return null;
                  return (
                    <Box sx={{ mt: 0.5, ml: 2, pb: 1 }}>
                      <Stack spacing={1}>
                        {sets.map((lines, sIdx) => (
                          <Box key={sIdx}>
                            {sets.length > 1 && (
                              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800, display: 'block', mb: 0.25 }}>
                                세트 {sIdx + 1}
                              </Typography>
                            )}
                            <Stack spacing={0.25}>
                              {lines.map((line, idx) => (
                                <Typography key={idx} variant="caption" color="text.secondary">{idx + 1}. {line}</Typography>
                              ))}
                            </Stack>
                          </Box>
                        ))}
                      </Stack>
                    </Box>
                  );
                })()}
              </ListItem>
            ))}
          </List>
        </Box>

        {/* 스킬 순서: 최대 3개 세트 지원 (skillOrder, skillOrder2, skillOrder3) */}
        {(() => {
          const skillSets = [deck.skillOrder, deck.skillOrder2, deck.skillOrder3].filter(
            (arr) => Array.isArray(arr) && arr.length > 0
          );
          if (skillSets.length === 0) return null;
          return (
            <Box sx={{ mt: 2 }}>
              <Typography fontWeight={800} color="text.secondary" mb={1}>스킬 순서</Typography>
              <Stack spacing={1.5}>
                {skillSets.map((lines, sIdx) => (
                  <Box key={sIdx}>
                    {skillSets.length > 1 && (
                      <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 800, mb: 0.5 }}>
                        세트 {sIdx + 1}
                      </Typography>
                    )}
                    <Stack spacing={0.5}>
                      {lines.map((line, idx) => (
                        <Typography key={idx} variant="body2" color="text.secondary">{idx + 1}. {line}</Typography>
                      ))}
                    </Stack>
                  </Box>
                ))}
              </Stack>
            </Box>
          );
        })()}

        {deck.avoid && deck.avoid.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography fontWeight={700} color="error.light" mb={1}>피해야 할 조합</Typography>
            <List dense>
              {deck.avoid.map((name, i) => (
                <ListItem key={i}>
                  <ListItemText primary={<span style={{ fontWeight: 700, color: '#ef4444' }}>{name}</span>} />
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
