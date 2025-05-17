export function Separated({
    children,
    separator = " ",
}: {
    children: React.ReactNode[];
    separator?: React.ReactNode;
}) : React.ReactNode[] {
    let out = [];
    for (let i = 0; i < children.length; i++) {
        if (children[i]) {
            out.push(children[i]);
            if (i < children.length - 1) {
                out.push(separator);
            }
        }
    }
    return out;
}
