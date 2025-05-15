import { Link, createFileRoute } from '@tanstack/react-router'
import { defaultBadgeData } from '../data'
import { useRef, useState } from 'react'
import { useLocalStorage } from 'usehooks-ts'

import { CANVAS_SIZE } from '../components/badge'
import { Grid } from '../components/grid'
import { BadgeGridItem } from '../components/badgegriditem'

export const Route = createFileRoute('/badges/')({
    component: RouteComponent,
})

function RouteComponent() {
    const [badgeData, setBadgeData] =
        useState<Record<string, BadgeData>>(defaultBadgeData)
    const [search, setSearch] = useState('')

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
                {Object.entries(badgeData)
                    .filter(([id, data]) =>
                        data.title.toLowerCase().includes(search.toLowerCase())
                    )
                    .map(([id, data]) => (
                        <BadgeGridItem key={id} id={id} data={data} />
                    ))}
            </Grid>
        </div>
    )
}
