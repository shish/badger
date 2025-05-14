import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useLocalStorage } from 'usehooks-ts'
import { useReactToPrint } from 'react-to-print'
import { useRef, useState } from 'react'

import { defaultBadgeData, defaultPageData } from '../data'
import { Ruler } from '../components/ruler'
import { Badge } from '../components/badge'

export const Route = createFileRoute('/')({
    component: HomeComponent,
})

function HomeComponent() {
    const [badgeData, setBadgeData] =
        useState<Record<string, BadgeData>>(defaultBadgeData)
    const [pageData, setPageData] = useState<PageData>(defaultPageData)
    const [showGuides, setShowGuides] = useLocalStorage<boolean>(
        'showGuides',
        true
    )
    const [error, setError] = useState<string | null>(null)
    const contentRef = useRef<HTMLDivElement>(null)

    return (
        <div className="p-2 flex flex-col gap-4">
            <div className="flex gap-4">
                <div className="flex-none">
                    <Controls
                        showGuides={showGuides}
                        setShowGuides={setShowGuides}
                        pageData={pageData}
                        setPageData={setPageData}
                        pageRef={contentRef}
                    />
                </div>
                <div className="flex-1">
                    <p>Page data (TODO: Make a GUI editor for this)</p>
                    <p className="text-red-500">{error}</p>
                    <textarea
                        style={{ width: '100%', height: '100%' }}
                        rows={5}
                        defaultValue={JSON.stringify(pageData.badges, null, 2)}
                        onChange={(e) => {
                            try {
                                const newPageData = JSON.parse(e.target.value)
                                setPageData({
                                    ...pageData,
                                    badges: newPageData,
                                })
                                setError(null)
                            }
                            catch (e) {
                                setError('Invalid JSON')
                            }
                        }}
                    />
                </div>
            </div>
            <br />
            {/* for editing */}
            <div className="bg-white text-center">
                <Page
                    pageData={pageData}
                    badgeData={badgeData}
                    showGuides={showGuides}
                />
            </div>
            {/* for printing */}
            <div style={{ display: 'none' }}>
                <div ref={contentRef}>
                    <Ruler scale={pageData.scale} />
                    <Page
                        pageData={pageData}
                        badgeData={badgeData}
                        showGuides={false}
                    />
                </div>
            </div>
        </div>
    )
}

function Controls({
    showGuides,
    setShowGuides,
    pageData,
    setPageData,
    pageRef,
}: {
    showGuides: boolean
    setShowGuides: (showGuides: boolean) => void
    pageData: PageData
    setPageData: (pageData: PageData) => void
    pageRef: React.RefObject<HTMLDivElement>
}) {
    const reactToPrintFn = useReactToPrint({
        documentTitle: 'Badges',
        contentRef: pageRef
    })

    return (
        <div>
            <label>
                <input
                    type="checkbox"
                    checked={showGuides}
                    onChange={(e) => setShowGuides(e.target.checked)}
                />{' '}
                Show guides
            </label>
            <br />
            Scale %:{' '}
            <input
                type="number"
                value={pageData.scale * 100}
                onChange={(e) => {
                    const newScale = e.target.valueAsNumber
                    if (!isNaN(newScale)) {
                        setPageData({ ...pageData, scale: newScale / 100 })
                    }
                }}
            />
            <br />
            <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={reactToPrintFn}
            >Print</button>
        </div>
    )
}

function Page({
    pageData,
    badgeData,
    showGuides,
}: {
    pageData: PageData
    badgeData: Record<string, BadgeData>
    showGuides: boolean
}) {
    return (
        Object.entries(pageData.badges).map(([name, count]) => (
            <>
                {Array.from({ length: count }).map((_, index) => (
                    <Badge
                        key={`${name}-${index}`}
                        data={badgeData[name]}
                        showGuides={showGuides}
                        scale={pageData.scale}
                    />
                ))}
            </>
        ))
    )
}
