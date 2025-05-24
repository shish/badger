export function EditorTable(items: Record<string, React.ReactNode>) {
    return (
        <table className="w-full">
            <tbody>
                {Object.entries(items).map(([key, value]) => (
                    <tr key={key}>
                        <th>{key}</th>
                        <td>{value}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}
