import React from 'react'
import { useLocalStorage } from 'usehooks-ts'

export interface ShoppingListContextType {
    badges: Record<string, number>
    addBadge: (id: string) => void
    setBadge: (id: string, number: number) => void
    removeBadge: (id: string) => void
}

export const ShoppingListContext = React.createContext<ShoppingListContextType>(
    {
        badges: {},
        addBadge: (id: string) => {},
        setBadge: (id: string, number: number) => {},
        removeBadge: (id: string) => {},
    }
)

export function ShoppingListProvider(props: { children: React.ReactNode }) {
    const [badges, setBadges] = useLocalStorage<Record<string, number>>(
        'shoppingListBadges',
        {}
    )

    function addBadge(id: string) {
        const newBadges = { ...badges }
        if (newBadges[id]) {
            newBadges[id]++
        } else {
            newBadges[id] = 1
        }
        setBadges(newBadges)
    }
    function setBadge(id: string, number: number) {
        const newBadges = { ...badges }
        if (number > 0) {
            newBadges[id] = number
        } else {
            delete newBadges[id]
        }
        setBadges(newBadges)
    }
    function removeBadge(id: string) {
        const newBadges = { ...badges }
        if (newBadges[id]) {
            newBadges[id]--
            if (newBadges[id] <= 0) {
                delete newBadges[id]
            }
        }
        setBadges(newBadges)
    }

    return (
        <ShoppingListContext.Provider
            value={{
                badges,
                addBadge,
                setBadge,
                removeBadge,
            }}
        >
            {props.children}
        </ShoppingListContext.Provider>
    )
}
