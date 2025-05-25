export const LAYER_DEFAULTS: Record<LayerType, LayerData> = {
    image: {
        type: 'image',
        image: '',
        scale: 1.0,
        offset: [0, 0],
    },
    hflag: {
        type: 'hflag',
        stripes: [
            { color: '#ff0000', size: 1 },
            { color: '#00ff00', size: 1 },
            { color: '#0000ff', size: 1 },
        ],
    },
    'edge-text': {
        type: 'edge-text',
        text: 'Hello',
    },
}

export function getImageUrl(badge: BadgeData, image: string) {
    // When we first pick an image but haven't saved it, badge.files
    // will conain a File object, and layer.image will be the exact
    // name of the file
    const file = badge.files
        .filter((f) => f instanceof File)
        .find((f) => f.name === image)
    if (file) {
        return URL.createObjectURL(file)
    }

    // After uploading, badge.files will contain the filename of the
    // file on the server, which will be different to the name the user
    // specified (it is sanitised, and has a random string of chars added
    // to the end), but layer.image still contains the original filename,
    // so we need to do some fuzzy matching
    let [base, ext] = image.split('.', 2)
    base = base.replaceAll('-', '_') + '_'
    const filename = badge.files
        .filter((f) => typeof f === 'string')
        .find((f) => f.startsWith(base) && f.endsWith(ext))
    return `/api/files/${badge.collectionId}/${badge.id}/${filename}`
}

/*
function simpleBadge(title: string, image: string): BadgeData {
    return {
        title: title,
        tags: ['q+', 'pride', 'flag'],
        layers: [
            {
                type: 'image',
                image: image,
                scale: 1.0,
                offset: [0, 0],
            },
            {
                type: 'edge-text',
                text: title,
            },
        ],
    }
}

export const defaultBadgeData: Record<string, BadgeData> = {
    agender: simpleBadge('Agender', 'agender.svg'),
    aromantic: simpleBadge('Aromantic', 'aromantic.svg'),
    asexual: simpleBadge('Asexual', 'asexual.svg'),
    bisexual: simpleBadge('Bisexual', 'bisexual.svg'),
    demiromantic: simpleBadge('Demiromantic', 'demiromantic.svg'),
    demisexual: simpleBadge('Demisexual', 'demisexual.svg'),
    genderfluid: simpleBadge('Genderfluid', 'genderfluid.svg'),
    genderqueer: simpleBadge('Genderqueer', 'genderqueer.svg'),
    intersex: simpleBadge('Intersex', 'intersex.svg'),
    nonbinary: simpleBadge('Nonbinary', 'nonbinary.svg'),
    pansexual: simpleBadge('Pansexual', 'pansexual.svg'),
    polyamorous: {
        title: 'Polyamorous',
        tags: ['q+'],
        layers: [
            {
                type: 'image',
                image: 'polyamorous.svg',
                offset: [15, 4],
                scale: 1.5,
            },
            {
                type: 'edge-text',
                text: 'Polyamory',
            },
        ],
    },
    polyamorousRound: {
        title: "Polyamorous (Shish's Version)",
        tags: ['q+'],
        layers: [
            {
                type: 'image',
                image: 'polyamorous-round.svg',
                scale: 1.0,
                offset: [0, 0],
            },
            {
                type: 'edge-text',
                text: "Polyamory (Shish's Version)",
                startOffset: -16.5,
            },
        ],
    },
    pride: simpleBadge('Pride', 'pride.svg'),
    prideProgress: {
        title: 'Pride Progress',
        tags: ['q+'],
        layers: [
            {
                type: 'hflag',
                stripes: [
                    { color: '#FF3C00', size: 1 },
                    { color: '#ffffff', size: 1 },
                    { color: '#A500B5', size: 1 },
                ],
            },
            {
                type: 'image',
                image: 'pride-progress.svg',
                scale: 2,
                offset: [-7, 0],
            },
            {
                type: 'edge-text',
                text: 'Pride Progress',
            },
        ],
    },
    prideProgressIntersex: {
        title: 'Pride Progress Intersex',
        tags: ['q+'],
        layers: [
            {
                type: 'hflag',
                stripes: [
                    { color: '#FF3C00', size: 1 },
                    { color: '#fdd817', size: 1 },
                    { color: '#A500B5', size: 1 },
                ],
            },
            {
                type: 'image',
                image: 'pride-progress-intersex.svg',
                scale: 2,
                offset: [2, 0],
            },
            {
                type: 'edge-text',
                text: 'Pride Progress Intersex',
            },
        ],
    },
    relationshipAnarchy: {
        title: 'Relationship Anarchy',
        tags: ['q+'],
        layers: [
            {
                type: 'image',
                image: 'relationship-anarchy.png',
                scale: 1.5,
                offset: [0, 0],
            },
            {
                type: 'edge-text',
                text: 'Relationship Anarchy',
            },
        ],
    },
    transgender: {
        title: 'Transgender',
        tags: ['q+'],
        layers: [
            {
                type: 'hflag',
                stripes: [
                    { color: '#55CDFC', size: 3 },
                    { color: '#F7A8B8', size: 2 },
                    { color: '#FFFFFF', size: 2 },
                    { color: '#F7A8B8', size: 2 },
                    { color: '#55CDFC', size: 3 },
                ],
            },
            {
                type: 'edge-text',
                text: 'Transgender',
            },
        ],
    },
}
*/
