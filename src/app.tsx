import * as React from "react";
import { RouterProvider, createRouter } from "@tanstack/react-router";

import { routeTree } from "./routeTree.gen";
import "./styles.css";
import { BasketContext, BasketProvider } from "./providers/basket";
import { PocketBaseContext, PocketBaseProvider } from "./providers/pocketbase";
import { useContext } from "react";

// Set up a Router instance
const router = createRouter({
    routeTree,
    defaultPreload: "intent",
    scrollRestoration: true,
    context: {
        // @ts-ignore
        pb: undefined,
        // @ts-ignore
        basket: undefined,
    },
});

// Register things for typesafety
declare module "@tanstack/react-router" {
    interface Register {
        router: typeof router;
    }
}
const App = () => {
    return (
        <React.StrictMode>
            <PocketBaseProvider url={`${window.location.protocol}//${window.location.host}/`}>
                <BasketProvider>
                    <InnerApp />
                </BasketProvider>
            </PocketBaseProvider>
        </React.StrictMode>
    );
};

function InnerApp() {
    const { pb, user } = useContext(PocketBaseContext);
    const basket = useContext(BasketContext);
    return (
        <RouterProvider router={router} context={{ pb: pb, basket: basket }} />
    );
}
export default App;
