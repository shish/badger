import { createFileRoute } from "@tanstack/react-router";
import { PocketBaseContext } from "../providers/pocketbase";
import { useContext } from "react";
import { EditorTable } from "../components/EditorTable";

export const Route = createFileRoute("/profile")({
    component: ProfileComponent,
});

function ProfileComponent() {
    const { pb, user } = useContext(PocketBaseContext);

    if (!user) {
        return <div>Please log in to view your profile.</div>;
    }

    return (
        <div className="p-2">
            <EditorTable
                name={user.name}
                created={user.created.split(" ")[0]}
            />
        </div>
    );
}
