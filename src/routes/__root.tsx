import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import PocketBase from "pocketbase";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Catcher } from "../components/Catcher";
import { BasketContextType } from "../providers/basket";

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
