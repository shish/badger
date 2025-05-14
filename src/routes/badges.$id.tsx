import { createFileRoute } from '@tanstack/react-router'
import { defaultBadgeData, defaultPageData } from '../data'
import { useRef, useState } from 'react'
import { Badge } from '../components/badge'

export const Route = createFileRoute('/badges/$id')({
  component: RouteComponent,
})

function RouteComponent() {
    const [badgeData, setBadgeData] =
        useState<Record<string, BadgeData>>(defaultBadgeData)
    const { id } = Route.useParams()
    const [ showGuides, setShowGuides ] = useState(true);
    const data = badgeData[id];

    return <div className="p-2 flex">
        <div>
            <table>
                <tr><th>id</th><td>{id}</td></tr>
                <tr><th>title</th><td>{data.title}</td></tr>
                <tr><th>tags</th><td>TODO</td></tr>
                <tr>
                    <th>preview</th>
                    <td>
                        <label>
                            <input
                                type="checkbox"
                                checked={showGuides}
                                onChange={(e) => setShowGuides(e.target.checked)}
                            />{' '}
                            Show guides
                        </label>
                        <br />
                        <Badge data={data} showGuides={showGuides} scale={2} />
                    </td>
                </tr>
            </table>
        </div>
        <pre>{JSON.stringify(data.layers, null, 2)}</pre>
    </div>;
}
