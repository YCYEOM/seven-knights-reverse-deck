import React from "react";
import { Card, CardMedia, Stack } from "@mui/material";

export default function HeroImages({ heroes }) {
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
