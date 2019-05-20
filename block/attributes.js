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
    // styleDefault: {
    //     type: 'boolean',
    //     default: true,
    // },
    styleToggle: {
        type: 'boolean',
        default: false,
    },
    // styleLight: {
    //     type: 'boolean',
    //     default: false,
    // },
    // styleDark: {
    //     type: 'boolean',
    //     default: false,
    // },
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
    refreshT2Qid: {
        type: 'string',
        default: null
    },
    // selectedIndex: {
    //     type: 'string',
    //     default: '1'
    // },
    // currentQid: {
    //     type: 'string',
    //     default: null
    // },
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