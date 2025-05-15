import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { defaultBadgeData } from '../data'
import { useContext, useRef, useState } from 'react'
import { Badge } from '../components/badge'
import { ShoppingListContext } from '../providers/shoppinglist'
import { EditorTable } from '../components/editortable'
import { LAYER_DEFAULTS } from '../data';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCross, faPlus, faXmark } from '@fortawesome/free-solid-svg-icons'

export const Route = createFileRoute('/badges/$id')({
    component: RouteComponent,
})

function RouteComponent() {
    const { addBadge } = useContext(ShoppingListContext)
    const [badgeData, setBadgeData] =
        useState<Record<string, BadgeData>>(defaultBadgeData)
    const { id } = Route.useParams()
    const [edit, setEdit] = useState(false)
    const [data, setData] = useState<BadgeData>(badgeData[id])
    const navigate = useNavigate()

    return (
        <div className="p-2 flex">
            <div>
                <table>
                    <tbody>
                        <tr>
                            <th>actions</th>
                            {edit ? (
                                <td>
                                    <button onClick={(e) => setEdit(false)}>
                                        Save
                                    </button>
                                    {' '}
                                    <button
                                        onClick={(e) => {
                                            setData(badgeData[id])
                                            setEdit(false)
                                        }}
                                    >
                                        Cancel
                                    </button>
                                </td>
                            ) : (
                                <td>
                                    <button
                                        onClick={(e) => {
                                            addBadge(id)
                                            navigate({ to: '/' })
                                        }}
                                    >
                                        Add to Page
                                    </button>
                                    {' '}
                                    <button onClick={(e) => setEdit(true)}>
                                        Edit
                                    </button>
                                    {' '}
                                    <button
                                        onClick={(e) =>
                                            alert('Not implemented')
                                        }
                                    >
                                        Delete
                                    </button>
                                </td>
                            )}
                        </tr>
                        <tr>
                            <th>title</th>
                            <td>
                                {edit ? (
                                    <input
                                        type="text"
                                        defaultValue={data.title}
                                        onChange={(e) =>
                                            setData({
                                                ...data,
                                                title: e.target.value,
                                            })
                                        }
                                    />
                                ) : (
                                    data.title
                                )}
                            </td>
                        </tr>
                        <tr>
                            <th>tags</th>
                            <td>
                                {edit ? (
                                    <input
                                        type="text"
                                        defaultValue={data.tags.join(', ')}
                                        onChange={(e) =>
                                            setData({
                                                ...data,
                                                title: e.target.value,
                                            })
                                        }
                                    />
                                ) : (
                                    data.tags.map((tag, i) => [
                                        i > 0 && ', ',
                                        <Link
                                            key={tag}
                                            to="/badges"
                                            search={{ tag: tag }}
                                        >
                                            {tag}
                                        </Link>,
                                    ])
                                )}
                            </td>
                        </tr>
                        <tr>
                            <th>preview</th>
                            <td>
                                <Badge data={data} scale={2} showGuides={edit} />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            {edit && <LayerEditor data={data} setData={setData} />}
        </div>
    )
}

function LayerEditor({
    data,
    setData,
}: {
    data: BadgeData
    setData: (data: BadgeData) => void
}) {
    function updateLayer(n: number, layer: LayerData): void {
        const newLayers = data.layers.map((l, i) => (i === n ? layer : l))
        setData({
            ...data,
            layers: newLayers,
        })
    }
    function deleteLayer(n: number): void {
        const newLayers = data.layers.filter((_, i) => i !== n)
        setData({
            ...data,
            layers: newLayers,
        })
    }

    return (
        <div>
            <table className="zebra layerEditor">
                <tbody>
                    {data.layers.map((layer, i) => (
                        <tr key={i}>
                            <th>{layer.type}</th>
                            <td>
                                {layer.type === 'image' ? (
                                    <LayerEditorImage
                                        layer={layer}
                                        updateLayer={(layer) =>
                                            updateLayer(i, layer)
                                        }
                                    />
                                ) : layer.type == 'edge-text' ? (
                                    <LayerEditorEdgeText
                                        layer={layer}
                                        updateLayer={(layer) =>
                                            updateLayer(i, layer)
                                        }
                                    />
                                ) : layer.type == 'hflag' ? (
                                    <LayerEditorHFlag
                                        layer={layer}
                                        updateLayer={(layer) =>
                                            updateLayer(i, layer)
                                        }
                                    />
                                ) : (
                                    <LayerEditorJSON
                                        layer={layer}
                                        updateLayer={(layer) =>
                                            updateLayer(i, layer)
                                        }
                                    />
                                )}
                            </td>
                            <td>
                                <button
                                    className="delete small"
                                    onClick={(e) => deleteLayer(i)}
                                >
                                    <FontAwesomeIcon icon={faXmark} />
                                </button>
                            </td>
                        </tr>
                    ))}
                    <LayerAdder data={data} setData={setData} />
                </tbody>
            </table>
        </div>
    )
}

function LayerEditorImage({
    layer,
    updateLayer,
}: {
    layer: LayerData & { type: 'image' }
    updateLayer: (layer: LayerData) => void
}) {
    return (
        <EditorTable
            file={
                <>
                    <input
                        type="text"
                        defaultValue={layer.image}
                        onChange={(e) =>
                            updateLayer({ ...layer, image: e.target.value })
                        }
                    />
                    <br />
                    <input type="file" accept="image/*" onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                            const reader = new FileReader()
                            reader.onload = (e) => {
                                // TODO: upload file and return URL
                                //updateLayer({
                                //    ...layer,
                                //    image: e.target.result as string,
                                //})
                            }
                            reader.readAsDataURL(file)
                        }
                    }} />
                </>
            }
            scale={
                <input
                    type="number"
                    defaultValue={layer.scale * 100}
                    onChange={(e) =>
                        updateLayer({
                            ...layer,
                            scale: e.target.valueAsNumber / 100,
                        })
                    }
                />
            }
            xoff={
                <input
                    type="number"
                    defaultValue={layer.offset[0]}
                    onChange={(e) =>
                        updateLayer({
                            ...layer,
                            offset: [
                                e.target.valueAsNumber,
                                layer.offset[1],
                            ],
                        })
                    }
                />
            }
            yoff={
                <input
                    type="number"
                    defaultValue={layer.offset[1]}
                    onChange={(e) =>
                        updateLayer({
                            ...layer,
                            offset: [
                                layer.offset[0],
                                e.target.valueAsNumber,
                            ],
                        })
                    }
                />
            }
        />
    )
}

function LayerEditorEdgeText({
    layer,
    updateLayer,
}: {
    layer: LayerData & { type: 'edge-text' }
    updateLayer: (layer: LayerData) => void
}) {
    return <EditorTable
        text={
            <input
                type="text"
                defaultValue={layer.text}
                onChange={(e) =>
                    updateLayer({ ...layer, text: e.target.value })
                }
            />
        }
        offset={
            <input
                type="number"
                defaultValue={layer.startOffset}
                onChange={(e) =>
                    updateLayer({
                        ...layer,
                        startOffset: e.target.valueAsNumber,
                    })
                }
            />
        }
    />
}

function LayerEditorHFlag({
    layer,
    updateLayer,
}: {
    layer: LayerData & { type: 'hflag' }
    updateLayer: (layer: LayerData) => void
}) {
    return (
        <EditorTable
            stripes={<input
                type="text"
                defaultValue={layer.stripes.map((s) => s.color + ":" + s.size).join(', ')}
                onChange={(e) =>
                    updateLayer({
                        ...layer,
                        stripes: e.target.value.split(', ').map((color) => ({
                            color: color.split(":")[0],
                            size: color.split(":")[1] ? parseFloat(color.split(":")[1]) : 1,
                        })),
                    })
                }
            />}
        />
    )
}

function LayerEditorJSON({
    layer,
    updateLayer,
}: {
    layer: LayerData
    updateLayer: (layer: LayerData) => void
}) {
    return (
        <div>
            <textarea
                defaultValue={JSON.stringify(layer, null, 2)}
                onChange={(e) => {
                    try {
                        const newLayer = JSON.parse(e.target.value)
                        updateLayer(newLayer)
                    } catch (e) {
                        console.error(e)
                    }
                }}
            />
        </div>
    )
}

function LayerAdder({
    data,
    setData,
}: {
    data: BadgeData
    setData: (data: BadgeData) => void
}) {
    const [type, setType] = useState<LayerType>('image')

    return (
        <tr>
            <th>New</th>
            <td>
                <select
                    value={type}
                    onChange={(e) => setType(e.target.value as LayerType)}
                >
                    <option value="image">Image</option>
                    <option value="hflag">Horizontal Flag</option>
                    <option value="edge-text">Edge Text</option>
                </select>
            </td>
            <td>
                <button
                    className="add small"
                    onClick={(e) => {
                        setData({
                            ...data,
                            layers: [...data.layers, LAYER_DEFAULTS[type]],
                        })
                    }}
                >
                    <FontAwesomeIcon icon={faPlus} />
                </button>
            </td>
        </tr>
    )
}
