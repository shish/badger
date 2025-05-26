import { getImageUrl } from "../data"
import { Catcher } from "./Catcher"

export const CANVAS_SIZE = 43
export const CUTTER_SIZE = 41
export const EDGE_VISIBLE_SIZE = 36
export const FRONT_VISIBLE_SIZE = 32
export const CENTRAL_VISIBLE_SIZE = 30
export const TEXT_SIZE = 1.3
export const TEXT_OFFSET = 0.60

export function Badge({
    data,
    showGuides = false,
    scale = 1.0,
}: {
    data: BadgeData
    showGuides?: boolean
    scale?: number
}) {
    const w = CANVAS_SIZE
    const h = CANVAS_SIZE
    const cx = w / 2
    const cy = h / 2

    /*
     * The end goal is to have a white space outside the cutter-circle
     * (semi-transparent in dev mode to see a hint of what's being cut
     * off; solid white in print mode to avoid printing anything outside)
     *
     *   123| design |321
     *
     * svg doesn't have "stroke outside the cutter circle" (where the
     * cutter circle is "|" and the stroke is 123), so we need to
     * make make a border circle which is larger than the cutter circle
     * (2), and then stroke both sides of the border (1/3)...
     *
     * Also, some printers (and, weirdly, libreoffice) can't handle shaped
     * semitransparent masks, which is why we can't white-out outside the
     * border using a mask
     */
    const big_r = (w ** 2 + h ** 2) ** 0.5 / 2
    const big_r_stroke = big_r * 2 - CUTTER_SIZE
    /*
     * fade out the area between the edge-visible-circle
     * and the cutter circle
     */
    const small_r = (CUTTER_SIZE + EDGE_VISIBLE_SIZE) / 4
    const small_r_stroke = (CUTTER_SIZE - EDGE_VISIBLE_SIZE) / 2

    return <Catcher>
        <svg
            width={`${w * scale}mm`}
            height={`${h * scale}mm`}
            viewBox={`0 0 ${w} ${h}`}
            xmlns="http://www.w3.org/2000/svg"
            className="badge"
            xmlnsXlink="http://www.w3.org/1999/xlink"
        >
            <defs>
                <circle cx={cx} cy={cy} r={FRONT_VISIBLE_SIZE / 2} id="edgeBorder" />
            </defs>
            {data.layers.map((layerData, n) => (
                <Layer key={n} badge={data} data={layerData} />
            ))}
            <g className={'guides'}>
                <circle
                    cx={cx}
                    cy={cy}
                    r={big_r}
                    stroke={showGuides ? '#fffc' : 'white'}
                    className="outsideCutter"
                    strokeWidth={big_r_stroke}
                    fill="none"
                />
                {showGuides && (
                    <>
                        <circle
                            cx={cx}
                            cy={cy}
                            r={small_r}
                            stroke="#fff8"
                            className="badgeSideArea"
                            strokeWidth={small_r_stroke}
                            fill="none"
                        />
                        <GuideDash cx={cx} cy={cy} r={EDGE_VISIBLE_SIZE/2} />
                        <GuideDash cx={cx} cy={cy} r={FRONT_VISIBLE_SIZE/2} />
                        <GuideDash cx={cx} cy={cy} r={CENTRAL_VISIBLE_SIZE/2} />
                    </>
                )}
                <circle
                    cx={cx}
                    cy={cy}
                    r={CUTTER_SIZE / 2}
                    stroke="black"
                    strokeWidth="1"
                    fill="none"
                />
            </g>
        </svg>
    </Catcher>
}

function Layer({ badge, data }: { badge: BadgeData, data: LayerData }) {
    if (data.type == 'image') {
        const centre = CANVAS_SIZE / 2
        const size = CANVAS_SIZE * (data.scale ?? 1.0)
        const xoff = centre - size / 2 + (data.offset?.[0] ?? 0)
        const yoff = centre - size / 2 + (data.offset?.[1] ?? 0)

        return (
            <g className="image">
                <image
                    href={getImageUrl(badge, data.image)}
                    x={xoff}
                    y={yoff}
                    width={size}
                    height={size}
                />
            </g>
        )
    } else if (data.type == 'hflag') {
        const centre = CANVAS_SIZE / 2
        const xsize = CANVAS_SIZE
        const ysize = FRONT_VISIBLE_SIZE
        const xoff = centre - xsize / 2
        const yoff = centre - ysize / 2

        const total = data.stripes.length
        const stripeSize = ysize / total
        let stripes: React.ReactNode[] = [
            <rect
                x={xoff}
                y={0}
                width={xsize}
                height={(CANVAS_SIZE - FRONT_VISIBLE_SIZE) / 2}
                fill={data.stripes[0]}
            />,
            <rect
                x={xoff}
                y={CANVAS_SIZE - (CANVAS_SIZE - FRONT_VISIBLE_SIZE) / 2}
                width={xsize}
                height={(CANVAS_SIZE - FRONT_VISIBLE_SIZE) / 2}
                fill={data.stripes[data.stripes.length - 1]}
            />
        ]
        data.stripes.forEach((stripe, i) => {
            stripes.push(
                <rect
                    key={i}
                    x={xoff}
                    y={yoff + (i * ysize) / total}
                    width={xsize}
                    height={stripeSize}
                    fill={stripe}
                />
            )
        })
        return <g className="hflag">{stripes}</g>
    } else if (data.type == 'edge-text') {
        let text = data.text
        text = text.replace("$TITLE$", badge.title);
        text = text.replace("$ID$", badge.id);
        return (
            <text className="edgeText">
                <textPath
                    xlinkHref="#edgeBorder"
                    startOffset={`${75 + (data.startOffset ?? 0)}%`}
                >
                    <tspan
                        y={-TEXT_OFFSET}
                        fontSize={TEXT_SIZE}
                        textAnchor="middle"
                        stroke="black"
                        strokeWidth="0.5"
                        fontWeight="bold"
                    >
                        {text}
                    </tspan>
                </textPath>
                <textPath
                    xlinkHref="#edgeBorder"
                    startOffset={`${75 + (data.startOffset ?? 0)}%`}
                >
                    <tspan
                        y={-TEXT_OFFSET}
                        fontSize={TEXT_SIZE}
                        textAnchor="middle"
                        fill="white"
                        fontWeight="bold"
                    >
                        {text}
                    </tspan>
                </textPath>
            </text>
        )
    }
    return <></>
}

function GuideDash({
    cx, cy, r
}: {
    cx: number
    cy: number
    r: number
}) {
    return [
        { stroke: "#0008", offset: 0 },
        { stroke: "#FFF8", offset: 2 }
    ].map(({stroke, offset}, i) => (
        <circle
            key={i}
            cx={cx}
            cy={cy}
            r={r}
            stroke={stroke}
            className="badgeSideMarker"
            strokeWidth="0.2"
            strokeDasharray="2,2"
            strokeDashoffset={offset}
            fill="none"
        />
    ))
}
