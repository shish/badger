import React from 'react'
import { useLocalStorage } from 'usehooks-ts'

export interface SettingsContextType {
    printScale: number
    setPrintScale: (newScale: number) => void
}

export const SettingsContext = React.createContext<SettingsContextType>({
    printScale: 1.0,
    setPrintScale: (newScale: number) => {},
})

export function SettingsProvider(props: { children: React.ReactNode }) {
    const [printScale, setPrintScale] = useLocalStorage<number>(
        'settingsPrintScale',
        1.0
    )

    return (
        <SettingsContext.Provider
            value={{
                printScale,
                setPrintScale,
            }}
        >
            {props.children}
        </SettingsContext.Provider>
    )
}
