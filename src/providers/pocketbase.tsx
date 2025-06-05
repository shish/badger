import { createContext, useCallback, useMemo, useState } from "react";
import PocketBase, { RecordModel } from "pocketbase";

type PocketBaseContextType = {
    pb: PocketBase;
    user: RecordModel | null;
    register: (
        name: string,
        email: string,
        password: string,
        passwordConfirm: string,
    ) => void;
    login: (email: string, password: string) => void;
    oauth: (provider: string) => void;
    logout: () => void;
};

export const PocketBaseContext = createContext<PocketBaseContextType>({} as PocketBaseContextType);

export function PocketBaseProvider(props: any) {
    const pb = useMemo(() => new PocketBase(props.url), []);
    const [ user, setUser ] = useState<RecordModel | null>(pb.authStore.record);

    function register(
        name: string,
        email: string,
        password: string,
        passwordConfirm: string,
    ) {
        pb.collection("users")
            .create({
                name,
                email,
                password,
                passwordConfirm,
            })
            .then((_user) => {
                login(email, password);
            })
            .catch((err) => {
                console.error(err);
                setUser(null);
            });
    }

    function login(email: string, password: string) {
        pb.collection("users")
            .authWithPassword(email, password)
            .then((auth) => {
                setUser(auth.record);
            })
            .catch((err) => {
                console.error(err);
                setUser(null);
            });
    }

    function oauth(provider: string) {
        pb.collection("users")
            .authWithOAuth2({ provider })
            .then((auth) => {
                console.log("Login OK");
                setUser(auth.record);
            })
            .catch((err) => {
                console.log("OAuth error:");
                console.error(err);
                setUser(null);
            });
    }

    function logout() {
        pb.authStore.clear();
        setUser(null);
    }

    return (
        <PocketBaseContext value={{ pb, user, register, login, oauth, logout }}>
            {props.children}
        </PocketBaseContext>
    );
}
