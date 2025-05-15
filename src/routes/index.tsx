import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useLocalStorage } from 'usehooks-ts'
import { useReactToPrint } from 'react-to-print'
import { useContext, useRef, useState } from 'react'

import { defaultBadgeData } from '../data'
import { Grid } from '../components/grid'
import { Ruler } from '../components/ruler'
import { Badge, CANVAS_SIZE } from '../components/badge'
import { BadgeGridItem } from '../components/badgegriditem'
import { ShoppingListContext } from '../providers/shoppinglist'
import { SettingsContext } from '../providers/settings'

export const Route = createFileRoute('/')({
    component: HomeComponent,
})

function HomeComponent() {
    const [badgeData, setBadgeData] =
        useState<Record<string, BadgeData>>(defaultBadgeData)
    const { badges } = useContext(ShoppingListContext)
    const { printScale } = useContext(SettingsContext)
    const contentRef = useRef<HTMLDivElement>(null)

    return (
        <div className="p-2 flex flex-col gap-4">
            <Controls pageRef={contentRef} />
            <br />
            {/* for editing */}
            <Grid>
                {Object.entries(badges).map(([id, count]) => (
                    <BadgeGridItem key={id} id={id} data={badgeData[id]} />
                ))}
            </Grid>
            {/* for printing */}
            <div style={{ display: 'none' }}>
                <div ref={contentRef}>
                    <Ruler scale={printScale} />
                    <Grid gap={'5mm'} scale={printScale}>
                        {Object.entries(badges).map(([name, count]) =>
                            Array.from({ length: count }).map((_, index) => (
                                <Badge
                                    key={`${name}-${index}`}
                                    data={badgeData[name]}
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
