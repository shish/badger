import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

import { Grid } from '../components/Grid'
import { BadgeGridItem } from '../components/BadgeGridItem'

type BadgeSearchSortOptions = 'title' | '-created' | '-updated'

type BadgeSearch = {
    page?: number
    search?: string
    sort?: BadgeSearchSortOptions
    // tag?: string[]
}

export const Route = createFileRoute('/badges/')({
    // Turn URL query params into a typed object
    validateSearch: (search: Record<string, unknown>): BadgeSearch => {
      return {
        page: Number(search?.page ?? 1),
        search: (search.search as string) || '',
        sort: (search.sort as BadgeSearchSortOptions) || 'title',
        // tag: search?.tag as string[] || '',
      }
    },
    // Flag which query params are used to load data
    loaderDeps: ({ search: { page, search, sort } }) => ({ page, search, sort }),
    // Load the data
    loader: async ({ context, deps: { page, search, sort } }) => {
        let filters = [];
        if (search) {
            filters.push(`(title~"${search}" || tags~"${search}")`);
        }
        return {
            badgeList: (await context.pb
                .collection('badges')
                .getList<BadgeData>(page, 20, {
                    filter: filters.length > 0 ? filters.join(" && ") : undefined,
                    "sort": sort,
                })
            ),
        }
    },
    // Use the component to render the data
    component: BadgeIndexComponent,
})

function BadgeIndexComponent() {
    const { badgeList } = Route.useLoaderData()
    const [search, setSearch] = useState(Route.useSearch().search || '')
    const [sort, setSort] = useState(Route.useSearch().sort || 'title')
    const navigate = Route.useNavigate()

    function handleSearch(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        navigate({
            search: (prev) => ({
                ...prev,
                page: 1, // Reset to first page on new search
                sort: sort,
                search: search.trim() || undefined, // Remove empty search
            }),
            // replace: true,
        })
    }

    return (
        <div className="p-2 flex flex-col gap-2">
            <form onSubmit={handleSearch} className="flex flex-row gap-2">
                <label htmlFor='search'>
                    Search:
                </label>
                <input
                    id="search"
                    type="text"
                    defaultValue={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <select
                    className="w-20"
                    defaultValue={sort}
                    onChange={(e) => setSort(e.target.value as BadgeSearchSortOptions)}
                >
                    <option value="title">Title</option>
                    <option value="-created">Created (newest first)</option>
                    <option value="-updated">Updated (newest first)</option>
                </select>
                <button type="submit" className="act small">
                    Search
                </button>
            </form>
            <div className="flex flex-row gap-2 justify-center items-center">
                <button
                  onClick={() => {
                    navigate({
                      search: (prev) => ({ page: (prev.page ?? 1) - 1 }),
                    })
                  }}
                >
                    &lt;&lt;
                </button>
                <span>
                    {badgeList.totalItems} badges found, page {badgeList.page} of {badgeList.totalPages}
                </span>
                <button
                  onClick={() => {
                    navigate({
                      search: (prev) => ({ page: (prev.page ?? 1) + 1 }),
                    })
                  }}
                >
                    &gt;&gt;
                </button>
            </div>
            <Grid>
                {badgeList.items
                    .map((badge) => (
                        <BadgeGridItem key={badge.id} data={badge} />
                    ))}
            </Grid>
        </div>
    )
}
