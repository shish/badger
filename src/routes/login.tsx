import { createFileRoute } from '@tanstack/react-router'
import { useContext, useState } from 'react'
import { PocketBaseContext } from '../providers/pocketbase'

export const Route = createFileRoute('/login')({
    component: LoginComponent,
})

function LoginComponent() {
    const navigate = Route.useNavigate()

    const { pb, user, login } = useContext(PocketBaseContext)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    function loginAndRedirect() {
        login(email, password);
        navigate({ to: '/profile' })
    }
    return (
        <form onSubmit={(e) => {
            e.preventDefault()
            loginAndRedirect()
        }}>
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
                            <button className="act" onClick={() => loginAndRedirect()}>
                                Login
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </form>
    )
}
