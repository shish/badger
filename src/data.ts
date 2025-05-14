function simpleBadge(title: string, image: string): BadgeData {
    return {
        title: title,
        layers: [
            {
                type: 'image',
                image: image,
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
        layers: [
            {
                type: 'image',
                image: 'polyamorous-round.svg',
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
        layers: [
            {
                type: 'image',
                image: 'relationship-anarchy.png',
                scale: 1.5,
            },
            {
                type: 'edge-text',
                text: 'Relationship Anarchy',
            },
        ],
    },
    transgender: {
        title: 'Transgender',
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

export const defaultPageData = {
    scale: 1.04,
    badges: {
        agender: 1,
        aromantic: 1,
        asexual: 1,
        bisexual: 1,
        demiromantic: 1,
        demisexual: 1,
        genderfluid: 1,
        genderqueer: 1,
        intersex: 1,
        nonbinary: 1,
        pansexual: 1,
        polyamorous: 1,
        polyamorousRound: 1,
        pride: 1,
        prideProgress: 1,
        prideProgressIntersex: 1,
        relationshipAnarchy: 1,
        transgender: 1,
    },
}
