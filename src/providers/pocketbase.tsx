import { createContext, useState } from 'react'
import PocketBase, { LocalAuthStore, RecordModel } from 'pocketbase';

type PocketBaseContextType = {
    pb: PocketBase;
    user: RecordModel|null;
    register: (name: string, email: string, password: string, passwordConfirm: string) => void;
    login: (email: string, password: string) => void;
    logout: () => void;
};

export const PocketBaseContext = createContext<PocketBaseContextType>({
    pb: new PocketBase('/'),
    user: null,
    register: (_name: string, _email: string, _password: string, _passwordConfirm: string) => {},
    login: (_email: string, _password: string) => {},
    logout: () => {},
});

export function PocketBaseProvider(props: any) {
    const pb = new PocketBase(props.url);
    const [ user, setUser ] = useState<RecordModel|null>(pb.authStore.record);

    function register(name: string, email: string, password: string, passwordConfirm: string) {
        pb.collection('users').create({
            name,
            email,
            password,
            passwordConfirm,
        })
            .then((_user) => {login(email, password);})
            .catch((err) => {console.error(err); setUser(null);});
    }

    function login(email: string, password: string) {
        pb.collection('users').authWithPassword(email, password)
            .then((auth) => {setUser(auth.record);})
            .catch((err) => {console.error(err); setUser(null);})
    }

    function logout() {
        pb.authStore.clear();
        setUser(null);
    }

    return (
        <PocketBaseContext.Provider value={{ pb, user, register, login, logout }}>
            {props.children}
        </PocketBaseContext.Provider>
    );
}
