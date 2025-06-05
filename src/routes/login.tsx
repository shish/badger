import { createFileRoute } from "@tanstack/react-router";
import { useContext, useState } from "react";
import { PocketBaseContext } from "../providers/pocketbase";

export const Route = createFileRoute("/login")({
    component: LoginComponent,
});

function LoginComponent() {
    return (
        <>
            <LoginBox />
            <RegisterBox />
        </>
    );
}

function LoginBox() {
    const navigate = Route.useNavigate();

    const { pb, user, login } = useContext(PocketBaseContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    function loginAndRedirect() {
        login(email, password);
        navigate({ to: "/profile" });
    }
    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                loginAndRedirect();
            }}
        >
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
                            <button
                                className="act"
                                onClick={() => loginAndRedirect()}
                            >
                                Login
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </form>
    );
}

function RegisterBox() {
    const navigate = Route.useNavigate();

    const { pb, user, register } = useContext(PocketBaseContext);
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");

    function registerAndRedirect() {
        register(name, email, password, passwordConfirm);
        navigate({ to: "/profile" });
    }
    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                registerAndRedirect();
            }}
        >
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
                        <td>Name</td>
                        <td>
                            <input
                                type="text"
                                defaultValue={name}
                                onChange={(e) => setName(e.target.value)}
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
                        <td>Password Confirm</td>
                        <td>
                            <input
                                type="password"
                                defaultValue={passwordConfirm}
                                onChange={(e) =>
                                    setPasswordConfirm(e.target.value)
                                }
                            />
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={2}>
                            <button
                                className="act"
                                onClick={() => registerAndRedirect()}
                            >
                                Register
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </form>
    );
}
