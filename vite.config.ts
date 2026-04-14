import path from 'path';
import { defineConfig } from '@lark-apaas/fullstack-vite-preset';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'client/src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // 核心框架单独打包
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // UI 组件库单独打包
          'radix-ui': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-select',
            '@radix-ui/react-popover',
            '@radix-ui/react-tabs',
            '@radix-ui/react-accordion',
          ],
          // 图表和富文本编辑器单独打包
          'editor': ['@tiptap/react', '@tiptap/core', '@tiptap/starter-kit'],
          'charts': ['echarts', 'echarts-for-react', 'recharts'],
        },
      },
    },
    // 提高 chunk 大小警告阈值（临时方案）
    chunkSizeWarningLimit: 1000,
  },
});
