import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Lê o .env sem filtro de prefixo: DEV_EXTRA_HOSTS não começa com VITE_,
  // então fica só aqui no config e nunca vai para o código do navegador.
  const env = loadEnv(mode, import.meta.dirname, '')

  // Nomes de host extras aceitos pelo servidor de dev (separados por vírgula).
  // Acesso por IP já é aceito pelo Vite; isto serve para nomes como "meu-pc.local".
  const hostsExtras = (env.DEV_EXTRA_HOSTS ?? '')
    .split(',')
    .map((h) => h.trim())
    .filter(Boolean)

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      // "@/..." aponta para "src/..." (o mesmo alias está nos tsconfig)
      alias: {
        '@': path.resolve(import.meta.dirname, './src'),
      },
    },
    // Só vale para o servidor de dev (não afeta o build).
    // O host 0.0.0.0 vem do script "dev:lan", não daqui, para o "dev" padrão
    // continuar escutando apenas em localhost.
    server: {
      allowedHosts: hostsExtras,
    },
  }
})
