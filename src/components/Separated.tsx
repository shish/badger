export function Separated({
    children,
    separator = " ",
}: {
    children: React.ReactNode[];
    separator?: React.ReactNode;
}): React.ReactNode[] {
    let out = [];
    let filteredChildren = children.filter((child) => !!child);
    for (let i = 0; i < filteredChildren.length; i++) {
        out.push(filteredChildren[i]);
        if (i < filteredChildren.length - 1) {
            out.push(separator);
        }
    }
    return out;
}
