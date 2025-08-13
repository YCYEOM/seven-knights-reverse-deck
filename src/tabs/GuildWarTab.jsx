import React, { useEffect, useState } from "react";
import { Container, Typography, Box } from "@mui/material";
import DeckSelector from "../components/DeckSelector";
import DeckResult from "../components/DeckResult";

export default function GuildWarTab() {
  const [decks, setDecks] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const ts = import.meta.env.DEV ? `?t=${Date.now()}` : '';
    const base = import.meta.env.BASE_URL || '/';
    const url = `${base}deckdata.json${ts}`; // single source in public/, copied to dist on build

    (async () => {
      try {
        const res = await fetch(url, { cache: 'no-store' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        setDecks(json);
        if (import.meta.env.DEV) console.info(`[GuildWar] loaded deckdata from: ${url}`);
      } catch (e) {
        console.error('[GuildWar] failed to load deckdata.json from public path:', e);
      }
    })();
  }, []);

  return (
    <Container maxWidth="sm" sx={{ pt: 6, pb: 6 }}>
      <Typography variant="h4" align="center" fontWeight={900} color="primary.light" gutterBottom sx={{ mb: 3 }}>
        길드전 덱 추천
      </Typography>
      <Typography align="center" color="text.primary" fontWeight={700} sx={{ mb: 3, fontSize: 20 }}>
        상대 조합에 따라 최적의 덱과 전략을 추천해드립니다.
      </Typography>
      <DeckSelector decks={decks} onSelect={setSelected} />
      {selected && <DeckResult deck={selected} />}
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
  );
}
