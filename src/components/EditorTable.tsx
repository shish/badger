export function EditorTable(items: Record<string, React.ReactNode>) {
    return (
        <table className="form">
            <tbody>
                {Object.entries(items).map(([key, value]) => (
                    <tr key={key}>
                        <th>{key}</th>
                        <td>{value}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
