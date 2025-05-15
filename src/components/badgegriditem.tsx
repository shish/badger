import { useContext } from 'react'
import { Link } from '@tanstack/react-router'
import { Badge } from './badge'
import { ShoppingListContext } from '../providers/shoppinglist'

export function BadgeGridItem({ id, data }: { id: string; data: BadgeData }) {
    const { badges, addBadge, setBadge, removeBadge } =
        useContext(ShoppingListContext)

    return (
        <div className="text-black text-center bg-white rounded-lg">
            <Link to="/badges/$id" params={{ id: id }}>
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
                    onClick={(e) => addBadge(id)}
                >
                    +
                </div>{' '}
                {badges[id] ?? 0}{' '}
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
                    onClick={(e) => removeBadge(id)}
                >
                    -
                </div>
            </div>
        </div>
    )
}
