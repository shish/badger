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
                    autoCodeSplitting: true,
                }),
            ],
        },
    },
    html: {
        title: 'AutoBadger1000',
        favicon: './src/assets/favicon.svg',
    },
})
