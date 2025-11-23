import { Link, useNavigate } from "@tanstack/react-router";
import { useContext } from "react";
import { LAYER_DEFAULTS } from "../data";
import { PocketBaseContext } from "../providers/pocketbase";
import { Separated } from "./Separated";

export function Header() {
    const { user, logout } = useContext(PocketBaseContext);
    const navigate = useNavigate();

    const aps = { className: "font-bold" };
    return (
        <header className="p-2 flex gap-2 text-lg flex-col sm:flex-row">
            <div className="flex-row">
                <Separated separator=" | ">
                    <Link
                        to="/basket"
                        activeProps={aps}
                        activeOptions={{ exact: true }}
                    >
                        Basket
                    </Link>
                    <Link to="/badges" activeProps={aps}>
                        Library
                    </Link>
                    {user && <NewBadgeButton user={user} />}
                </Separated>
            </div>

            <div className="flex-1" />

            <div className="flex-row">
                <Separated separator=" | ">
                    <Link to="/profile" activeProps={aps}>
                        {user ? "Profile" : "Login"}
                    </Link>
                    {user && (
                        <button
                            onClick={() => {
                                logout();
                                navigate({ to: "/" });
                            }}
                        >
                            Logout
                        </button>
                    )}
                    <Link to="/" activeProps={aps}>
                        About
                    </Link>
                </Separated>
            </div>
        </header>
    );
}

function NewBadgeButton({ user }: { user: any }) {
    const { pb } = useContext(PocketBaseContext);
    const navigate = useNavigate();

    function newBadge() {
        pb.collection("badges")
            .create<BadgeData>({
                owner: user.id,
                title: "New badge!",
                public: true,
                layers: [
                    LAYER_DEFAULTS["hflag"],
                    LAYER_DEFAULTS["edge-text"],
                    {
                        type: "edge-text",
                        text: "shish.io",
                        startOffset: -50,
                    },
                ],
                tags: ["pride", "flag"],
                files: [],
            })
            .then((r) =>
                navigate({
                    to: "/badges/$id",
                    params: { id: r.id },
                }),
            );
    }

    return <button onClick={() => newBadge()}>Create</button>;
}
