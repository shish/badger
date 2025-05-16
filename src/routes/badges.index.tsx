import { Link, createFileRoute } from '@tanstack/react-router'
import { useContext, useEffect, useRef, useState } from 'react'
import { useLocalStorage } from 'usehooks-ts'

import { CANVAS_SIZE } from '../components/Badge'
import { Grid } from '../components/Grid'
import { BadgeGridItem } from '../components/BadgeGridItem'
import { PocketBaseContext } from '../providers/pocketbase'
import { RecordModel } from 'pocketbase'

export const Route = createFileRoute('/badges/')({
    component: RouteComponent,
})

function RouteComponent() {
    const [badgeData, setBadgeData] = useState<BadgeData[]>([]);
    const [search, setSearch] = useState('')
    const { pb, user } = useContext(PocketBaseContext);

    useEffect(() => {
        pb
            .collection('badges')
            .getList<BadgeData>(1, 20)
            .then((r) => setBadgeData(r.items))
            .catch((e) => console.log(e));
    }, []);

    return (
        <div className="p-2">
            <label>
                Search:{' '}
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </label>
            <Grid>
                {badgeData
                    .filter((data) =>
                        data.title.toLowerCase().includes(search.toLowerCase())
                    )
                    .map((data) => (
                        <BadgeGridItem key={data.id} data={data} />
                    ))}
            </Grid>
        </div>
    )
}
