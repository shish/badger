import * as React from 'react'
import {
    Link,
    Outlet,
    createRootRoute,
    useNavigate,
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { useContext } from 'react'
import { PocketBaseContext } from '../providers/pocketbase'

export const Route = createRootRoute({
    component: RootComponent,
})

function RootComponent() {
    const { pb, user, logout } = useContext(PocketBaseContext)
    const navigate = useNavigate()

    function newBadge() {
        if (!user) return

        pb.collection('badges')
            .create<BadgeData>({
                owner: user.id,
                title: 'New badge!',
                public: false,
                layers: [
                    {
                        type: 'hflag',
                        stripes: [
                            { color: 'red', size: 2 },
                            { color: 'green', size: 1 },
                            { color: 'blue', size: 2 },
                        ],
                    },
                    {
                        type: 'edge-text',
                        text: 'Hello world',
                    },
                ],
                tags: '',
                files: [],
            })
            .then((r) =>
                navigate({
                    to: '/badges/$id',
                    params: { id: r.id },
                })
            )
    }

    const aps = { className: 'font-bold' }
    return (
        <>
            <div className="p-2 flex gap-2 text-lg">
                <Link to="/" activeProps={aps} activeOptions={{ exact: true }}>
                    Page
                </Link>
                {' | '}
                <Link
                    to="/badges"
                    activeProps={aps}
                    activeOptions={{ exact: true }}
                >
                    Badge Library
                </Link>
                {user && (
                    <>
                        {' | '}
                        <button onClick={() => newBadge()}>New Badge</button>
                    </>
                )}
                <div className="flex-1" />

                {user ? (
                    <>
                        <Link to="/profile" activeProps={aps}>
                            Profile
                        </Link>
                        {' | '}
                        <button
                            onClick={() => {
                                logout()
                                navigate({ to: '/' })
                            }}
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" activeProps={aps}>
                            Login
                        </Link>
                    </>
                )}
                {' | '}
                <Link to="/about" activeProps={aps}>
                    About
                </Link>
            </div>
            <hr />
            <Outlet />
            <TanStackRouterDevtools position="bottom-right" />
        </>
    )
}
