import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import type PocketBase from "pocketbase";
import { Catcher } from "../components/Catcher";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import type { BasketContextType } from "../providers/basket";

interface MyRouterContext {
    pb: PocketBase;
    basket: BasketContextType;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
    component: RootComponent,
});

function RootComponent() {
    return (
        <>
            <Header />
            <Catcher>
                <Outlet />
            </Catcher>
            <Footer />
            <TanStackRouterDevtools position="bottom-right" />
        </>
    );
}
