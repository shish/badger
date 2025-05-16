import { useContext } from 'react'
import { Link } from '@tanstack/react-router'
import { Badge } from './Badge'
import { BasketContext } from '../providers/basket'

export function BadgeGridItem({ data }: { data: BadgeData }) {
    const { badges, addBadge, setBadge, removeBadge } =
        useContext(BasketContext)

    return (
        <div className="text-black text-center bg-white rounded-lg">
            <Link to="/badges/$id" params={{ id: data.id }}>
                {data.title}
                <br />
                <Badge data={data} showGuides={false} scale={1.0} />
            </Link>
            <br />
            <div className="select-none">
                <div
                    className="cursor-pointer inline-block"
                    style={{
                        width: '1.5em',
                        height: '1.5em',
                        backgroundColor: 'lightblue',
                        color: 'black',
                        borderRadius: '50%',
                        textAlign: 'center',
                        lineHeight: '1.5em',
                    }}
                    onClick={(e) => addBadge(data.id)}
                >
                    +
                </div>{' '}
                {badges[data.id] ?? 0}{' '}
                <div
                    className="cursor-pointer inline-block"
                    style={{
                        width: '1.5em',
                        height: '1.5em',
                        backgroundColor: 'lightblue',
                        color: 'black',
                        borderRadius: '50%',
                        textAlign: 'center',
                        lineHeight: '1.5em',
                    }}
                    onClick={(e) => removeBadge(data.id)}
                >
                    -
                </div>
            </div>
        </div>
    )
}
