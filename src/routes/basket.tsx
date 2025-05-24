import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useLocalStorage } from 'usehooks-ts'
import { useReactToPrint } from 'react-to-print'
import { useContext, useEffect, useRef, useState } from 'react'

import { Grid } from '../components/Grid'
import { Ruler } from '../components/Ruler'
import { Badge, CANVAS_SIZE } from '../components/Badge'
import { BadgeGridItem } from '../components/BadgeGridItem'
import { BasketContext } from '../providers/basket'
import { SettingsContext } from '../providers/settings'
import { PocketBaseContext } from '../providers/pocketbase'

export const Route = createFileRoute('/basket')({
    component: BasketComponent,
    loader: async ({ context }) => {
        const badgeList = await context.pb.collection('badges').getList<BadgeData>(1, 20);

        return {
            // FIXME: load from basket list instead of loading all badges
            badgeDB: Object.fromEntries(badgeList.items.map((item) => [item.id, item])),
        }
    }
})

function BasketComponent() {
    const { badgeDB } = Route.useLoaderData()
    const { badges } = useContext(BasketContext)
    const { printScale } = useContext(SettingsContext)
    const contentRef = useRef<HTMLDivElement>(null)
    const { pb, user } = useContext(PocketBaseContext);

    return (
        <div className="flex flex-col gap-2 p-2">
            <Controls pageRef={contentRef} />
            <br />
            {/* for editing */}
            <Grid>
                {Object
                    .entries(badges)
                    .filter(([id, count]) => badgeDB.hasOwnProperty(id))
                    .map(([id, count]) => (
                        <BadgeGridItem key={id} data={badgeDB[id]} />
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
                            .filter(([id, count]) => badgeDB.hasOwnProperty(id))
                            .map(([id, count]) =>
                            Array.from({ length: count }).map((_, index) => (
                                <Badge
                                    key={`${id}-${index}`}
                                    data={badgeDB[id]}
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
        <div className="flex flex-row gap-2">
            <div>Scale&nbsp;%</div>
            <input
                type="number"
                value={printScale * 100}
                onChange={(e) => {
                    setPrintScale(e.target.valueAsNumber / 100)
                }}
            />
            <button className="act small" onClick={reactToPrintFn}>
                Print
            </button>
        </div>
    )
}
