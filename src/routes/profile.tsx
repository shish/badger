import { createFileRoute } from "@tanstack/react-router";
import { AuthProviderInfo } from "pocketbase";
import { useContext, useEffect, useState } from "react";
import { EditorTable } from "../components/EditorTable";
import { PocketBaseContext } from "../providers/pocketbase";

export const Route = createFileRoute("/profile")({
    component: ProfileOrLoginComponent,
});

function ProfileOrLoginComponent() {
    const { pb, user } = useContext(PocketBaseContext);

    if (user) {
        return (
            <div className="p-2">
                <EditorTable
                    name={user.name}
                    created={user.created.split(" ")[0]}
                />
            </div>
        );
    } else {
        return (
            <div className="flex flex-col gap-4 sm:flex-row">
                <LoginBox />
                <OAuthBox />
                <RegisterBox />
            </div>
        );
    }
}

function OAuthBox() {
    const { oauth, pb } = useContext(PocketBaseContext);
    const [providers, setProviders] = useState<AuthProviderInfo[]>([]);
    const navigate = Route.useNavigate();

    useEffect(() => {
        pb.collection("users")
            .listAuthMethods()
            .then((res) => {
                setProviders(res.oauth2.providers);
            });
    }, [pb]);

    function loginAndRedirect(provider: string) {
        oauth(provider);
        navigate({ to: "/profile" });
    }

    return (
        <div className="flex-1">
            <fieldset className="border border-solid border-gray-300 p-2 m-2 grid gap-2 grid-cols-2">
                <legend className="text-sm">Login with ...</legend>
                {providers.map((provider) => (
                    <button
                        key={provider.name}
                        className="act small"
                        onClick={(e) => loginAndRedirect(provider.name)}
                    >
                        {provider.displayName}
                    </button>
                ))}
            </fieldset>
        </div>
    );
}

function LoginBox() {
    const navigate = Route.useNavigate();

    const { login } = useContext(PocketBaseContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    function loginAndRedirect() {
        login(email, password);
        navigate({ to: "/profile" });
    }
    return (
        <form
            className="flex-1"
            onSubmit={(e) => {
                e.preventDefault();
                loginAndRedirect();
            }}
        >
            <fieldset className="flex-1 border border-solid border-gray-300 p-2 m-2">
                <legend className="text-sm">Login with Email</legend>
                <table className="form">
                    <tbody>
                        <tr>
                            <th>Email</th>
                            <td>
                                <input
                                    type="email"
                                    defaultValue={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>Password</th>
                            <td>
                                <input
                                    type="password"
                                    defaultValue={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                />
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={2}>
                                <button
                                    className="act small"
                                    onClick={() => loginAndRedirect()}
                                >
                                    Login
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </fieldset>
        </form>
    );
}

function RegisterBox() {
    const navigate = Route.useNavigate();

    const { register } = useContext(PocketBaseContext);
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");

    function registerAndRedirect() {
        register(name, email, password, password);
        navigate({ to: "/profile" });
    }
    return (
        <form
            className="flex-1"
            onSubmit={(e) => {
                e.preventDefault();
                registerAndRedirect();
            }}
        >
            <fieldset className="flex-1 border border-solid border-gray-300 p-2 m-2">
                <legend className="text-sm">Register with Email</legend>
                <table className="form">
                    <tbody>
                        <tr>
                            <th>Email</th>
                            <td>
                                <input
                                    type="email"
                                    defaultValue={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>Name</th>
                            <td>
                                <input
                                    type="text"
                                    defaultValue={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>Password</th>
                            <td>
                                <input
                                    type="password"
                                    defaultValue={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                />
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={2}>
                                <button
                                    className="act small"
                                    onClick={() => registerAndRedirect()}
                                >
                                    Register
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </fieldset>
        </form>
    );
}
