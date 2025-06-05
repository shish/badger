import { CANVAS_SIZE } from "./Badge";

export function Grid({
    children,
    gap = ".5em",
    scale = 1.0,
}: {
    children: React.ReactNode;
    gap?: string;
    scale?: number;
}) {
    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: `repeat(auto-fill, minmax(${CANVAS_SIZE * scale}mm, 1fr))`,
                gridAutoFlow: "row",
                gap: gap,
            }}
        >
            {children}
        </div>
    );
}
