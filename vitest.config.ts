/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    // Garante que o Zone global do jsdom seja compartilhado
    // com o mesmo contexto que o Angular usa nos testes
    environmentOptions: {
      jsdom: {
        resources: 'usable',
      },
    },
    setupFiles: ['src/test-setup.ts'],
    include: ['src/**/*.spec.ts'],
    // singleFork: um único processo Node — sem recriação de contexto
    // entre arquivos de teste, mantendo Zone e ProxyZoneSpec vivos
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },
    // inline: força que zone.js e Angular sejam transformados pelo
    // Vite dentro do mesmo contexto de módulo (sem externalizar)
    server: {
      deps: {
        inline: [
          /zone\.js/,
          /@angular/,
          /@ngrx/,
        ],
      },
    },
    sequence: {
      hooks: 'list',
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'html'],
      include: ['src/app/**/*.ts'],
      exclude: [
        'src/app/**/*.spec.ts',
        'src/app/**/*.module.ts',
        'src/main.ts',
      ],
      thresholds: {
        lines: 60,
        functions: 60,
        branches: 60,
        statements: 60,
      },
    },
  },
});
