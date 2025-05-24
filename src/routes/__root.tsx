import {
    Outlet,
    createRootRouteWithContext,
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import PocketBase from 'pocketbase';
import { Header } from '../components/Header'

interface MyRouterContext {
    pb: PocketBase
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
    component: RootComponent,
})

function RootComponent() {
    return (
        <>
            <Header />
            <hr />
            <Outlet />
            <TanStackRouterDevtools position="bottom-right" />
        </>
    )
}
