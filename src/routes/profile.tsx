import { createFileRoute } from '@tanstack/react-router'
import { PocketBaseContext } from '../providers/pocketbase';
import { useContext } from 'react';

export const Route = createFileRoute('/profile')({
  component: RouteComponent,
})

function RouteComponent() {
    const { pb, user } = useContext(PocketBaseContext);
  return <div>Hello "/user"!</div>
}
