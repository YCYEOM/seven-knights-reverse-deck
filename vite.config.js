import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/seven-knights-reverse-deck/', // 본인 저장소명으로 꼭 수정!
  plugins: [react()],
  server: {
    port: 5173,
  },
});
