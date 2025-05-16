import { createContext, useState } from 'react'
import PocketBase, { RecordModel } from 'pocketbase';

/*
// list and filter "example" collection records
const result = await pb.collection('example').getList(1, 20, {
    filter: 'status = true && created > "2022-08-01 10:00:00"'
});

// authenticate as auth collection record
const userData = await pb.collection('users').authWithPassword('test@example.com', '123456');

// or as super-admin
const adminData = await pb.admins.authWithPassword('test@example.com', '123456');
*/
type PocketBaseContextType = {
    pb: PocketBase;
    user: RecordModel|null;
    register: (name: string, username: string, email: string, password: string, passwordConfirm: string) => void;
    login: (email: string, password: string) => void;
    logout: () => void;
};

export const PocketBaseContext = createContext<PocketBaseContextType>({
    pb: new PocketBase('/'),
    user: null,
    register: (_name: string, _username: string, _email: string, _password: string, _passwordConfirm: string) => {},
    login: (_email: string, _password: string) => {},
    logout: () => {},
});

export function PocketBaseProvider(props: any) {
    const pb = new PocketBase(props.url);
    const [ user, setUser ] = useState<RecordModel|null>(null);

    function register(name: string, username: string, email: string, password: string, passwordConfirm: string) {
        pb.collection('users').create({
            name,
            username,
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
