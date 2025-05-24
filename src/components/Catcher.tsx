import { CatchBoundary } from "@tanstack/react-router";

export function Catcher({ children }: { children: React.ReactNode }) {
    return             <CatchBoundary
      getResetKey={() => 'reset'}
      onCatch={(error) => console.error(error)}
    >
        {children}
    </CatchBoundary>
;
}
