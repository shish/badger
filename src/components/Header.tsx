import { useContext } from "react";
import { PocketBaseContext } from "../providers/pocketbase";
import { Link, useNavigate } from "@tanstack/react-router";
import { Separated } from "./Separated";
import { LAYER_DEFAULTS } from "../data";

export function Header() {
    const { user, logout } = useContext(PocketBaseContext);
    const navigate = useNavigate();

    const aps = { className: "font-bold" };
    return (
        <div className="p-2 flex gap-2 text-lg flex-col sm:flex-row">
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
                        Badge Library
                    </Link>
                    {user && <NewBadgeButton user={user} />}
                </Separated>
            </div>

            <div className="flex-1" />

            <div className="flex-row">
                <Separated separator=" | ">
                    {user && (
                        <Link to="/profile" activeProps={aps}>
                            Profile
                        </Link>
                    )}
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
                    {!user && (
                        <Link to="/login" activeProps={aps}>
                            Login
                        </Link>
                    )}
                    <Link to="/" activeProps={aps}>
                        About
                    </Link>
                </Separated>
            </div>
        </div>
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

    return <button onClick={() => newBadge()}>New Badge</button>;
}
