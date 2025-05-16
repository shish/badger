import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useLocalStorage } from 'usehooks-ts'
import { useReactToPrint } from 'react-to-print'
import { useContext, useEffect, useRef, useState } from 'react'

import { Grid } from '../components/Grid'
import { Ruler } from '../components/Ruler'
import { Badge, CANVAS_SIZE } from '../components/Badge'
import { BadgeGridItem } from '../components/BadgeGridItem'
import { ShoppingListContext } from '../providers/shoppinglist'
import { SettingsContext } from '../providers/settings'
import { PocketBaseContext } from '../providers/pocketbase'

export const Route = createFileRoute('/')({
    component: HomeComponent,
})

function HomeComponent() {
    const [badgeData, setBadgeData] = useState<Record<string, BadgeData>>({})
    const { badges } = useContext(ShoppingListContext)
    const { printScale } = useContext(SettingsContext)
    const contentRef = useRef<HTMLDivElement>(null)
    const { pb, user } = useContext(PocketBaseContext);

    useEffect(() => {
        pb
            .collection('badges')
            .getList<BadgeData>(1, 20)
            .then((r) => setBadgeData(Object.fromEntries(r.items.map((item) => [item.id, item]))))
            .catch((e) => console.log(e));
    }, []);

    return (
        <div className="p-2 flex flex-col gap-4">
            <Controls pageRef={contentRef} />
            <br />
            {/* for editing */}
            <Grid>
                {Object
                    .entries(badges)
                    .filter(([id, count]) => badgeData.hasOwnProperty(id))
                    .map(([id, count]) => (
                        <BadgeGridItem key={id} data={badgeData[id]} />
                    )
                )}
            </Grid>
            {/* for printing */}
            <div style={{ display: 'none' }}>
                <div ref={contentRef}>
                    <Ruler scale={printScale} />
                    <Grid gap={'5mm'} scale={printScale}>
                        {Object
                            .entries(badges)
                            .filter(([id, count]) => badgeData.hasOwnProperty(id))
                            .map(([id, count]) =>
                            Array.from({ length: count }).map((_, index) => (
                                <Badge
                                    key={`${id}-${index}`}
                                    data={badgeData[id]}
                                    scale={printScale}
                                />
                            ))
                        )}
                    </Grid>
                </div>
            </div>
        </div>
    )
}

function Controls({
    pageRef,
}: {
    pageRef: React.RefObject<HTMLDivElement | null>
}) {
    const { printScale, setPrintScale } = useContext(SettingsContext)
    const reactToPrintFn = useReactToPrint({
        documentTitle: 'Badges',
        contentRef: pageRef,
    })

    return (
        <div>
            Scale %:{' '}
            <input
                type="number"
                value={printScale * 100}
                onChange={(e) => {
                    setPrintScale(e.target.valueAsNumber / 100)
                }}
            />
            <br />
            <button onClick={reactToPrintFn}>
                Print
            </button>
        </div>
    )
}
