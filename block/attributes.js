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
    contentColour: {
        type: 'string',
        default: '#000000'
    },
    radioControl: {
        type: 'boolean',
        default: 'a'
    },
    // questions: {
    //     type: 'array',
    //     default: [{ 
    //         value: null, 
    //         label: 'Select Poll Question' 
    //     }]
    // }, 
    // selectedPoll: {
    //     type: 'string',
    //     default: '0'
    // }
    // pollOptionsHidden: {
    //     type: 'string',
    //     default: false
    // },
    pollQuestionId: {
        type: 'string',
        default: '0'
    },
    refreshQid: {
        type: 'string',
        default: null
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
    pollQuestionTitle: {
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
    }
}

export default attributes;