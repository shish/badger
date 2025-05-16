import { createFileRoute } from '@tanstack/react-router'
import { useContext, useState } from 'react'
import { PocketBaseContext } from '../providers/pocketbase'

export const Route = createFileRoute('/login')({
    component: RouteComponent,
})

function RouteComponent() {
    const { pb, user, login } = useContext(PocketBaseContext)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    return (
        <table>
            <tbody>
                <tr>
                    <td>Email</td>
                    <td>
                        <input
                            type="email"
                            defaultValue={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </td>
                </tr>
                <tr>
                    <td>Password</td>
                    <td>
                        <input
                            type="password"
                            defaultValue={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </td>
                </tr>
                <tr>
                    <td colSpan={2}>
                        <button onClick={() => login(email, password)}>
                            Login
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
    )
}
