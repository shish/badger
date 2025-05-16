import * as React from 'react'
import { RouterProvider, createRouter } from '@tanstack/react-router'

import { routeTree } from './routeTree.gen'
import './styles.css'
import { BasketProvider } from './providers/basket'
import { SettingsProvider } from './providers/settings'
import { PocketBaseContext, PocketBaseProvider } from './providers/pocketbase'
import { useContext } from 'react'

// Set up a Router instance
const router = createRouter({
    routeTree,
    defaultPreload: 'intent',
    scrollRestoration: true,
    context: {
        // @ts-ignore
        pb: undefined
    }
})

// Register things for typesafety
declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router
    }
}
const App = () => {
    return (
        <React.StrictMode>
            <PocketBaseProvider url={'/'}>
                <SettingsProvider>
                    <BasketProvider>
                        <InnerApp />
                    </BasketProvider>
                </SettingsProvider>
            </PocketBaseProvider>
        </React.StrictMode>
    )
}

function InnerApp() {
    const { pb, user } = useContext(PocketBaseContext);
    return <RouterProvider router={router} context={{ pb: pb }} />
}
export default App
