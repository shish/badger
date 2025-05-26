export function EditorTable(items: Record<string, React.ReactNode>) {
    return (
        <table className="w-full">
            <tbody>
                {Object.entries(items).map(([key, value]) => (
                    <tr key={key}>
                        <th className="w-0 pr-2 text-right">{key}</th>
                        <td>{value}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}
