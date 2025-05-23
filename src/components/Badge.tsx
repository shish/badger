import { getImageUrl } from "../data"

export const CANVAS_SIZE = 43
export const CUTTER_SIZE = 41
export const VISIBLE_SIZE = 34

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
     * badge "edges" are a circle half way between the visible circle and
     * the cutter circle, stroked wide enough to cover the gap between
     * the two
     */
    const small_r = (CUTTER_SIZE + VISIBLE_SIZE) / 4
    const small_r_stroke = (CUTTER_SIZE - VISIBLE_SIZE) / 2

    return (
        <svg
            width={`${w * scale}mm`}
            height={`${h * scale}mm`}
            viewBox={`0 0 ${w} ${h}`}
            xmlns="http://www.w3.org/2000/svg"
            className="badge"
            xmlnsXlink="http://www.w3.org/1999/xlink"
        >
            <defs>
                <circle cx={cx} cy={cy} r={VISIBLE_SIZE / 2} id="edgeBorder" />
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
                        <circle
                            cx={cx}
                            cy={cy}
                            r={VISIBLE_SIZE / 2}
                            stroke="#0008"
                            className="badgeSideMarker"
                            strokeWidth="0.5"
                            strokeDasharray="2,2"
                            fill="none"
                        />
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
    )
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
        const size = CANVAS_SIZE
        const xoff = centre - size / 2
        const yoff = centre - size / 2

        const total = data.stripes.reduce((acc, stripe) => acc + stripe.size, 0)
        const stripeSize = size / total
        let stripes: React.ReactNode[] = []
        let ypos = 0
        data.stripes.forEach((stripe, i) => {
            stripes.push(
                <rect
                    key={i}
                    x={xoff}
                    y={yoff + (ypos * size) / total}
                    width={size}
                    height={stripe.size * stripeSize}
                    fill={stripe.color}
                />
            )
            ypos += stripe.size
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
                        y="-1"
                        fontSize="2"
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
                        y="-1"
                        fontSize="2"
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
