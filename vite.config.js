import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages는 /Us-QnA/ 하위 경로에서 서빙되지만, Vercel은 도메인 루트에서
// 서빙되므로 base가 다르다. Vercel 빌드 환경에는 VERCEL 환경변수가 자동으로
// 심어지므로 이를 기준으로 자동 분기한다.
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: process.env.VERCEL ? '/' : '/Us-QnA/',
})
