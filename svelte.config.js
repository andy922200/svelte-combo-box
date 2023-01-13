import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'
const currentNodeEnv = process.env.VITE_USER_NODE_ENV
const isProdEnv = currentNodeEnv === 'production'

export default {
    // Consult https://svelte.dev/docs#compile-time-svelte-preprocess
    // for more information about preprocessors
    compilerOptions: {
        customElement: isProdEnv
    },
    preprocess: vitePreprocess(),
    'enable-ts-plugin': true
}
