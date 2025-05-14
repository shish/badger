export function Ruler({ scale }: { scale: number }) {
    return (
        <div className="ruler printOnly">
            <svg
                width={`${100 * scale}mm`}
                height="1mm"
                viewBox={`0 0 ${100 * scale} 1`}
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
            >
                <rect x="0" y="0" width={100 * scale} height="1" fill="black" />
            </svg>{' '}
            100mm ({100 * scale}%)
        </div>
    )
}
