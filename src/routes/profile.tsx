import { createFileRoute } from '@tanstack/react-router'
import { PocketBaseContext } from '../providers/pocketbase';
import { useContext } from 'react';

export const Route = createFileRoute('/profile')({
  component: ProfileComponent,
})

function ProfileComponent() {
    const { pb, user } = useContext(PocketBaseContext);
    return <pre>{ JSON.stringify(user, null, 2)}</pre>
}
