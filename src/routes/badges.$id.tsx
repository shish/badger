import { createFileRoute, Link } from '@tanstack/react-router'
import { useContext, useEffect, useRef, useState } from 'react'
import { Badge } from '../components/Badge'
import { BasketContext } from '../providers/basket'
import { EditorTable } from '../components/EditorTable'
import { LAYER_DEFAULTS, getImageUrl } from '../data'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faXmark, faEdit, faCaretUp, faCaretDown, faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { PocketBaseContext } from '../providers/pocketbase'
import { TagList } from '../components/TagList'
import { Separated } from '../components/Separated'

export const Route = createFileRoute('/badges/$id')({
    loader: async ({ context, params: { id } }) => {
        return {
            initBadgeData: await context.pb
                .collection('badges')
                .getOne<BadgeData>(id, { expand: 'tags' }),
        }
    },
    component: BadgeViewComponent,
})

function BadgeViewComponent() {
    const { initBadgeData } = Route.useLoaderData()
    const navigate = Route.useNavigate()

    const { addBadge } = useContext(BasketContext)
    const { pb, user } = useContext(PocketBaseContext)

    const [edit, setEdit] = useState(!initBadgeData.public)
    const [badgeData, setBadgeData] = useState<BadgeData>(initBadgeData)

    // When clicking "new badge" we get a new initBadgeData
    useEffect(
        () => setBadgeData(initBadgeData),
        [initBadgeData]
    );
    function resetBadge() {
        setBadgeData(initBadgeData)
    }

    function saveBadge() {
        if (!badgeData) return
        pb.collection('badges')
            .update<BadgeData>(badgeData.id, badgeData)
            .then((d) => setBadgeData(d))
            .catch((e) => console.log(e))
    }

    function deleteBadge() {
        pb.collection('badges')
            .delete(badgeData.id)
            .then(() => navigate({ to: '/' }))
            .catch((e) => console.log(e))
    }

    const buttons = <div>
        <Separated>
            {edit && (
                <button
                    className="act"
                    onClick={(e) => {
                        saveBadge()
                        setEdit(false)
                    }}
                >
                    Save
                </button>
            )}
            {edit && (
                <button
                    className="act"
                    onClick={(e) => {
                        resetBadge()
                        setEdit(false)
                    }}
                >
                    Cancel
                </button>
            )}
            {!edit && (
                <button
                    className="act"
                    onClick={(e) => {
                        addBadge(badgeData.id)
                        navigate({ to: '/' })
                    }}
                >
                    Add to Basket
                </button>
            )}
            {!edit && badgeData.owner == user?.id && (
                <button
                    className="act"
                    onClick={(e) => setEdit(true)}
                >
                    Edit
                </button>
            )}
            {!edit && badgeData.owner == user?.id && (
                <button
                    className="act"
                    onClick={(e) => {
                        deleteBadge()
                    }}
                >
                    Delete
                </button>
            )}
        </Separated>
    </div >;
    return (
        <div className="p-2 flex flex-col sm:flex-row">
            <div className="flex flex-col">
                {buttons}
                <InfoEditor
                    badgeData={badgeData}
                    edit={edit}
                    setBadgeData={setBadgeData}
                />
                <div className="bg-white border rounded-lg p-2 text-center">
                    <Badge data={badgeData} scale={2} showGuides={edit} />
                </div>
            </div>
            {edit && <LayersEditor data={badgeData} setData={setBadgeData} />}
        </div>
    )
}

function InfoEditor({
    badgeData,
    edit,
    setBadgeData,
}: {
    badgeData: BadgeData
    edit: boolean
    setBadgeData: (data: BadgeData) => void
}) {
    return <table>
        <tbody>
            <tr>
                <th>title</th>
                <td>
                    {edit ? (
                        <input
                            type="text"
                            defaultValue={badgeData.title}
                            onChange={(e) =>
                                setBadgeData({
                                    ...badgeData,
                                    title: e.target.value,
                                })
                            }
                        />
                    ) : (
                        badgeData.title
                    )}
                </td>
            </tr>
            <tr>
                <th>tags</th>
                <td>
                    {edit ? (
                        <input
                            type="text"
                            defaultValue={badgeData.tags.join(", ")}
                            onChange={(e) =>
                                setBadgeData({
                                    ...badgeData,
                                    tags: e.target.value.split(", ").map((tag) => tag.trim()),
                                })
                            }
                        />
                    ) : (
                        <TagList
                            tags={badgeData.tags}
                        />
                    )}
                </td>
            </tr>
            <tr>
                <th>public</th>
                <td>
                    {edit ? (
                        <input
                            type="checkbox"
                            defaultChecked={badgeData.public}
                            onChange={(e) =>
                                setBadgeData({
                                    ...badgeData,
                                    public: e.target.checked,
                                })
                            }
                        />
                    ) : (
                        badgeData.public ? "Yes" : "No"
                    )}
                </td>
            </tr>
        </tbody>
    </table>
}

function LayersEditor({
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
        <div className="flex flex-col gap-2">
            <LayerAdder badgeData={data} setBadgeData={setData} />
            {data.layers.map((layer, i) => (
                <LayerEditor
                    data={data}
                    setData={setData}
                    layer={layer}
                    updateLayer={updateLayer}
                    deleteLayer={deleteLayer}
                    i={i}
                    key={i}
                />
            ))}
        </div>
    )
}

function LayerEditor({
    data,
    setData,
    layer,
    updateLayer,
    deleteLayer,
    i
} : {
    data: BadgeData
    setData: (data: BadgeData) => void
    layer: LayerData
    updateLayer: (n: number, layer: LayerData) => void
    deleteLayer: (n: number) => void
    i: number
}) {
    const [ raw, setRaw ] = useState<boolean>(false)

    return <div className="flex-auto border rounded-lg border-green-600 bg-green-950">
        <div className="flex flex-row border-b-2 rounded-t-lg border-green-600 p-2 gap-2 bg-green-900">
            <button
                className="act small"
                disabled={i <= 0}
                onClick={(e) =>
                    setData({
                        ...data,
                        layers: [
                            ...data.layers.slice(0, i - 1),
                            data.layers[i],
                            data.layers[i - 1],
                            ...data.layers.slice(i + 1),
                        ],
                    })
                }
            >
                <FontAwesomeIcon icon={faChevronUp} />
            </button>
            <button
                className="act small"
                disabled={i >= data.layers.length - 1}
                onClick={(e) =>
                    setData({
                        ...data,
                        layers: [
                            ...data.layers.slice(0, i),
                            data.layers[i + 1],
                            data.layers[i],
                            ...data.layers.slice(i + 2),
                        ],
                    })
                }
            >
                <FontAwesomeIcon icon={faChevronDown} />
            </button>
            <div>{layer.type}</div>
            <div className="flex-1" />
            <button
                className="act small"
                onClick={(e) => setRaw(!raw)}
            >
                <FontAwesomeIcon icon={faEdit} />
            </button>
            <button
                className="delete small"
                onClick={(e) => deleteLayer(i)}
            >
                <FontAwesomeIcon icon={faXmark} />
            </button>
        </div>
        {raw ? (
            <LayerEditorJSON
                layer={layer}
                updateLayer={(layer) =>
                    updateLayer(i, layer)
                }
            />
        ) : layer.type === 'image' ? (
            <LayerEditorImage
                badge={data}
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
    </div>

}

function LayerEditorImage({
    badge,
    layer,
    updateLayer,
}: {
    badge: BadgeData
    layer: LayerData & { type: 'image' }
    updateLayer: (layer: LayerData) => void
}) {
    return (
        <EditorTable
            file={
                <>
                    {layer.image.length > 0 && <img className="max-w-20 max-h-20" src={getImageUrl(badge, layer.image)} alt="layer" />}
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                                badge.files.push(file)
                                updateLayer({
                                    ...layer,
                                    image: file.name,
                                })
                            }
                        }}
                    />
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
                            offset: [e.target.valueAsNumber, layer.offset[1]],
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
                            offset: [layer.offset[0], e.target.valueAsNumber],
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
    return (
        <EditorTable
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
    )
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
            stripes={
                <input
                    type="text"
                    defaultValue={layer.stripes
                        .map((s) => s.color + ':' + s.size)
                        .join(', ')}
                    onChange={(e) =>
                        updateLayer({
                            ...layer,
                            stripes: e.target.value
                                .split(', ')
                                .map((color) => ({
                                    color: color.split(':')[0],
                                    size: color.split(':')[1]
                                        ? parseFloat(color.split(':')[1])
                                        : 1,
                                })),
                        })
                    }
                />
            }
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
                rows={5}
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
    badgeData,
    setBadgeData,
}: {
    badgeData: BadgeData
    setBadgeData: (data: BadgeData) => void
}) {
    const [type, setType] = useState<LayerType>('image')

    return (
        <tr>
            <th>New layer</th>
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
                        let defaults = LAYER_DEFAULTS[type];
                        if(defaults.type == "edge-text") {
                            defaults.text = badgeData.title
                        }
                        setBadgeData({
                            ...badgeData,
                            layers: [...badgeData.layers, defaults],
                        })
                    }}
                >
                    <FontAwesomeIcon icon={faPlus} />
                </button>
            </td>
        </tr>
    )
}
