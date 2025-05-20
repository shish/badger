import { createFileRoute, Link } from '@tanstack/react-router'
import { useContext, useEffect, useRef, useState } from 'react'
import { Badge } from '../components/Badge'
import { BasketContext } from '../providers/basket'
import { EditorTable } from '../components/EditorTable'
import { LAYER_DEFAULTS, getImageUrl } from '../data'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faXmark } from '@fortawesome/free-solid-svg-icons'
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
    const [data, setData] = useState<BadgeData>(initBadgeData)

    // When clicking "new badge" we get a new initBadgeData
    useEffect(
        () => setData(initBadgeData),
        [initBadgeData]
    );
    function resetBadge() {
        setData(initBadgeData)
    }

    function saveBadge() {
        if (!data) return
        pb.collection('badges')
            .update<BadgeData>(data.id, data)
            .then((d) => setData(d))
            .catch((e) => console.log(e))
    }

    function deleteBadge() {
        pb.collection('badges')
            .delete(data.id)
            .then(() => navigate({ to: '/' }))
            .catch((e) => console.log(e))
    }

    const infoBody = (
        <tbody>
            <tr>
                <td colSpan={2}>
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
                                    addBadge(data.id)
                                    navigate({ to: '/' })
                                }}
                            >
                                Add to Basket
                            </button>
                        )}
                        {!edit && data.owner == user?.id && (
                            <button
                                className="act"
                                onClick={(e) => setEdit(true)}
                            >
                                Edit
                            </button>
                        )}
                        {!edit && data.owner == user?.id && (
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
                </td>
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
                            defaultValue={data.tags.join(", ")}
                            onChange={(e) =>
                                setData({
                                    ...data,
                                    tags: e.target.value.split(", ").map((tag) => tag.trim()),
                                })
                            }
                        />
                    ) : (
                        <TagList
                            tags={data.tags}
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
                            defaultChecked={data.public}
                            onChange={(e) =>
                                setData({
                                    ...data,
                                    public: e.target.checked,
                                })
                            }
                        />
                    ) : (
                        data.public ? "Yes" : "No"
                    )}
                </td>
            </tr>
            <tr>
                <td colSpan={2}>
                    <Badge data={data} scale={2} showGuides={edit} />
                </td>
            </tr>
        </tbody>
    )
    return (
        <div className="p-2 flex">
            <table>{infoBody}</table>
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
                    <LayerAdder badgeData={data} setBadgeData={setData} />
                </tbody>
            </table>
        </div>
    )
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
                    {layer.image.length > 0 && <img className="layerImageThumb" src={getImageUrl(badge, layer.image)} alt="layer" />}
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
                                /*
                                const reader = new FileReader()
                                reader.onload = (e) => {
                                    updateLayer({
                                        ...layer,
                                        image: e.target.result as string,
                                    })
                                }
                                reader.readAsDataURL(file)
                                */
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
