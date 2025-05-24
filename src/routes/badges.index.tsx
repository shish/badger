import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

import { Grid } from '../components/Grid'
import { BadgeGridItem } from '../components/BadgeGridItem'

type BadgeSearchSortOptions = 'newest' | 'oldest' | 'price'

type BadgeSearch = {
    page?: number
    filter?: string
    sort?: BadgeSearchSortOptions
    tag?: string[]
}

export const Route = createFileRoute('/badges/')({
    // Turn URL query params into a typed object
    validateSearch: (search: Record<string, unknown>): BadgeSearch => {
      return {
        page: Number(search?.page ?? 1),
        filter: (search.filter as string) || '',
        sort: (search.sort as BadgeSearchSortOptions) || 'newest',
        tag: search?.tag as string[] || '',
      }
    },
    // Flag which query params are used to load data
    loaderDeps: ({ search: { page, filter, sort, tag } }) => ({ page, filter, sort, tag }),
    // Load the data
    loader: async ({ context, deps: { page, filter, sort, tag } }) => {
        return {
            badgeList: (await context.pb.collection('badges').getList<BadgeData>(page, 20, {"sort": "title"})).items
        } as {
            badgeList: BadgeData[]
        }
    },
    // Use the component to render the data
    component: BadgeIndexComponent,
})

function BadgeIndexComponent() {
    const { badgeList } = Route.useLoaderData()
    const navigate = Route.useNavigate()

    const [search, setSearch] = useState('')

    return (
        <div className="p-2">
            <label className="flex flex-row gap-2">
                <div>Search:</div>
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </label>
            <Grid>
                {badgeList
                    .filter((badge) =>
                        badge.title.toLowerCase().includes(search.toLowerCase())
                    )
                    .map((badge) => (
                        <BadgeGridItem key={badge.id} data={badge} />
                    ))}
            </Grid>
            <button
              onClick={() => {
                navigate({
                  search: (prev) => ({ page: (prev.page ?? 1) + 1 }),
                })
              }}
            >
              Next Page
            </button>
        </div>
    )
}
