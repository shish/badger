export function Ruler({ scale }: { scale: number }) {
    return (
        <div className="text-center">
            <svg
                width={`${100 * scale}mm`}
                height="3mm"
                viewBox={`0 0 ${100 * scale} 3`}
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
            >
                <rect x="0" y="1" width={100 * scale} height="1" fill="black" />
                <rect x="0" y="0" width="1" height="3" fill="black" />
                <rect
                    x={100 * scale - 1}
                    y="0"
                    width="1"
                    height="3"
                    fill="black"
                />
            </svg>{" "}
            100mm ({100 * scale}%)
        </div>
    );
}
