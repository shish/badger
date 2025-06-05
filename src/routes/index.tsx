import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
    component: HomeComponent,
});

function HomeComponent() {
    return (
        <div className="p-2 flex flex-col gap-4">
            <h1 className="text-2xl font-bold">Welcome to AutoBadger2000!</h1>
            <p>
                This is a simple web app that allows you to create and print
                badges. You can add badges to your basket and print them in a
                grid format.
            </p>
            <p>
                To get started, go to the <a href="/badges">Badge Library</a>{" "}
                and start adding badges to your basket!
            </p>
        </div>
    );
}
