import { resolve } from 'path'
import { createVuePlugin as Vue } from 'vite-plugin-vue2'
// import Dts from 'vite-plugin-dts'
import CssInjected from 'vite-plugin-css-injected-by-js'
import { PKG_NAME } from '@zanejs/constants'
import type { UserConfigExport } from 'vite'

export default (): UserConfigExport => {
  const packageDir = './src'
  const entry = resolve(__dirname, './src/index.ts')
  const outDir = resolve(__dirname, 'dist/cjs')
  return {
    mode: 'production',
    plugins: [
      Vue(),
      // Dts({
      //   insertTypesEntry: true,
      //   cleanVueFileName: true,
      //   skipDiagnostics: false,
      //   tsConfigFilePath: '../../tsconfig.web.json',
      //   include: [packageDir],
      //   entryRoot: packageDir,
      // }),
      CssInjected({
        styleId: `${PKG_NAME}-theme-chalk`,
      }),
    ],
    build: {
      target: 'modules',
      minify: true, // 压缩
      chunkSizeWarningLimit: 2, // 超过 2kb 警告提示
      reportCompressedSize: false,
      emptyOutDir: false,
      outDir,
      lib: {
        entry,
        formats: ['cjs'],
        fileName: (): string => {
          return 'index.cjs'
        },
      },
      rollupOptions: {
        external: ['vue'],
        output: {
          preserveModules: true,
          preserveModulesRoot: packageDir,
          sourcemap: true,
        },
      },
    },
  }
}
