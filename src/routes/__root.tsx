import * as React from 'react'
import { Link, Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

export const Route = createRootRoute({
    component: RootComponent,
})

function RootComponent() {
    return (
        <>
            <div className="p-2 flex gap-2 text-lg">
                <Link
                    to="/"
                    activeProps={{
                        className: 'font-bold',
                    }}
                    activeOptions={{ exact: true }}
                >
                    Page
                </Link>{' | '}
                <Link
                    to="/badges"
                    activeProps={{
                        className: 'font-bold',
                    }}
                    activeOptions={{ exact: true }}
                >
                    Badge Library
                </Link>{' | '}
                <Link
                    to="/about"
                    activeProps={{
                        className: 'font-bold',
                    }}
                >
                    About
                </Link>
            </div>
            <hr />
            <Outlet />
            <TanStackRouterDevtools position="bottom-right" />
        </>
    )
}
