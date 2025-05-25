import { defineConfig } from '@rsbuild/core'
import { pluginReact } from '@rsbuild/plugin-react'
import { TanStackRouterRspack } from '@tanstack/router-plugin/rspack'

export default defineConfig({
    plugins: [pluginReact()],
    tools: {
        rspack: {
            plugins: [
                TanStackRouterRspack({
                    target: 'react',
                    autoCodeSplitting: false,
                }),
            ],
        },
    },
    html: {
        title: 'AutoBadger2000',
        favicon: './src/assets/favicon.svg',
    },
    server: {
        proxy: {
            '/api': 'http://localhost:3030',
        },
    },
})
