import { UserConfig, ConfigEnv, loadEnv } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import sveltePreprocess from 'svelte-preprocess'
import autoprefixer from 'autoprefixer'

export default ({ mode }: ConfigEnv): UserConfig => {
    const env = loadEnv(mode, process.cwd())
    const currentNodeEnv = env.VITE_USER_NODE_ENV
    const isProdEnv = currentNodeEnv === 'production'
    
    return {
        build: {
            lib: {
                entry: './src/main.ts',
                name: 'MySvelteComboBox',
            }
        },
        plugins: [
            svelte({
                compilerOptions: {
                    customElement: isProdEnv
                },
                preprocess: sveltePreprocess({
                    sourceMap: !isProdEnv,
                    postcss: {
                        plugins: [autoprefixer()]
                    }
                })
            })
        ]
    }
}