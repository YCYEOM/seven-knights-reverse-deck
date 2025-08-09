import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// base 경로를 환경변수(VITE_BASE)로부터 읽고, 없으면 기본값('/' 로컬/사용자페이지 호환) 사용
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const base = env.VITE_BASE || '/';
  return {
    base,
    plugins: [react()],
    server: { port: 5173 },
  };
});
