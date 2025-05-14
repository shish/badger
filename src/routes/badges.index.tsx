import { Link, createFileRoute } from '@tanstack/react-router'
import { defaultBadgeData, defaultPageData } from '../data'
import { useRef, useState } from 'react'
import { Badge } from '../components/badge'

export const Route = createFileRoute('/badges/')({
  component: RouteComponent,
})

function RouteComponent() {
    const [badgeData, setBadgeData] =
        useState<Record<string, BadgeData>>(defaultBadgeData)
    const [ search, setSearch ] = useState("");

    return <div className="p-2">
        <p>Click any badge to see details</p>
        <label>
            Search:{' '}
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} />
        </label>
        <div className="bg-white text-center">
            {Object
                .entries(badgeData)
                .filter(([id, data]) => id.includes(search))
                .map(([id, data]) => (
                    <Link to="/badges/$id" params={{id: id}}>
                        <Badge
                            data={data}
                            showGuides={false}
                            scale={1.0}
                        />
                    </Link>
                )
            )}
        </div>
    </div>;
}
