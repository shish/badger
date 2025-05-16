import * as React from 'react'
import { RouterProvider, createRouter } from '@tanstack/react-router'

import { routeTree } from './routeTree.gen'
import './styles.css'
import { ShoppingListProvider } from './providers/shoppinglist'
import { SettingsProvider } from './providers/settings'
import { PocketBaseProvider } from './providers/pocketbase'

// Set up a Router instance
const router = createRouter({
    routeTree,
    defaultPreload: 'intent',
    scrollRestoration: true,
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
                    <ShoppingListProvider>
                        <RouterProvider router={router} />
                    </ShoppingListProvider>
                </SettingsProvider>
            </PocketBaseProvider>
        </React.StrictMode>
    )
}

export default App
