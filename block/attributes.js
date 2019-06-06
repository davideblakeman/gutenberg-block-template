const attributes = {
    initialised: {
        type: 'string',
        default: false
    },
    title: {
        type: 'array',
        source: 'children',
        selector: '.gutenbergtemplateblock-title'
    },
    content: {
        type: 'array',
        source: 'children',
        selector: '.gutenbergtemplateblock-content'
    },
    styleToggle: {
        type: 'boolean',
        default: false,
    },
    styleLight: {
        type: 'boolean',
        default: false,
    },
    // styleShadow: {
    //     type: 'boolean',
    //     default: false,
    // },
    styleTitleShadow: {
        type: 'boolean',
        default: false,
    },
    styleOptionsShadow: {
        type: 'boolean',
        default: false,
    },
    textAlignment: {
        type: 'string'
    },
    blockAlignment: {
        type: 'string',
        default: 'wide',
    },
    titleColour: {
        type: 'string',
        default: '#000000'
    },
    backgroundColour: {
        type: 'string',
        default: null
    },
    fontColour: {
        type: 'string',
        default: null
    },
    radiusControl: {
        type: 'number',
        default: null
    },
    borderWidth: {
        type: 'string',
        default: null
    },
    borderColour: {
        type: 'string',
        default: null
    },
    borderStyle: {
        type: 'string',
        default: null
    },
    radioControl: {
        type: 'boolean',
        default: 'a'
    },
    imageUrl: {
        type: 'string',
        source: 'attribute',
        attribute: 'src',
        selector: 'img',
        default: ''
    },
    imageId: {
        type: 'number',
    },
    imageAlt: {
        type: 'string',
        source: 'attribute',
        attribute: 'alt',
        selector: 'img',
        default: null
    },
    pollQuestionId: {
        type: 'string',
        default: '0'
    },
    refreshQid: {
        type: 'string',
        default: null
    },
    refreshT2Qid: {
        type: 'string',
        default: null
    },
    tabRefresh: {
        type: 'boolean',
        default: false
    },
    tabT2Refresh: {
        type: 'boolean',
        default: false
    },
    poll: {
        type: 'array',
        default: null
    },
    isLoaded: {
        type: 'boolean',
        default: false
    },
    error: {
        type: 'string', //?
        default: null
    },
    pollTitle: {
        type: 'string',
        default: null
    },
    answersQid: {
        type: 'string',
        default: null
    },
    firstPollId: {
        type: 'string',
        default: null
    },
    classes: {
        type: 'string',
        default: null
    },
    uuid: {
        type: 'string',
        default: null
    }
}

export default attributes