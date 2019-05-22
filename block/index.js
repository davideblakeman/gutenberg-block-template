import "./i18n.js"

/**
 * Block dependencies
 */
import classnames from 'classnames'
import icons from './icons'
import Inspector from './inspector'
import Controls from './controls'
import attributes from './attributes'
// import colourAttributes from './colours'
import PotDSelect from './components/PotdSelect'
import PotDSettings from './components/PotdSettings'
import PotDStyle from './components/PotdStyle'
import './style.scss'
import './editor.scss'

// var el = wp.element.createElement
// var { withState } = wp.compose.withState
// var withState = wp.compose.withState

/**
 * Internal block libraries
 */
const { __ } = wp.i18n
const { registerBlockType } = wp.blocks
// const {
//     RichText,
//     ColorPalette
// } = wp.editor
const { 
    TabPanel,
    Spinner
} = wp.components
const { Component } = wp.element
const { select } = wp.data
// const { withSelect } = wp.data

// console.log( wp.components )
// console.log( wp.data )

window.addEventListener( 'load', function( event ) {
    var publishBtn = document.querySelector( '.editor-post-publish-button' )
    if ( publishBtn ) {
        publishBtn.addEventListener( 'click', () => {
            const blocks = document.querySelectorAll( '.wp-block-gutenbergtemplateblock-templateblock.editor-block' )
            if ( blocks.length ) {
                const postId = select( 'core/editor' ).getCurrentPostId()
                for ( let block of blocks ) {
                    let uuid = block.attributes.value.nodeValue
                    setPollStart( uuid, postId )
                }
            }
        })
    }
})

const setPollStart = ( uuid, postId ) => {
    var self = this
    let url = gutenbergtemplateblock_ajax_object.ajax_url + 
              '?action=gutenbergtemplateblock_setPollByUUID' + 
              '&uuid=' + uuid +
              '&postId=' + postId +
              '&security=' + gutenbergtemplateblock_ajax_object.security

    fetch( url )
        .then( response => {
            return response.json()
        })
        .then(
            ( result ) => {
                // console.log( 'setPollStart: ', result )
            },
            ( error ) => {
                self.setState({
                    isLoaded: true,
                    error
                })
            }
        )
}

registerBlockType( 'gutenbergtemplateblock/templateblock', 
{
    title: __( 'Template - Block!', 'gutenbergtemplateblock' ),
    description: __( 'A gutenberg block template.', 'gutenbergtemplateblock' ),
    icon: {
        background: 'rgba(254, 243, 224, 0.52)',
        src: icons.logo,
    },         
    category: 'common',
    keywords: [
        __( 'Poll', 'gutenbergtemplateblock' ),
        __( 'Vote', 'gutenbergtemplateblock' ),
        __( 'Day', 'gutenbergtemplateblock' )
    ],
    attributes,
    getEditWrapperProps( { blockAlignment } ) {
        if ( 'left' === blockAlignment || 'right' === blockAlignment || 'full' === blockAlignment ) {
            return { 'data-align': blockAlignment }
        }
    },
    edit: class extends Component {
        constructor( props ) {
            super( ...arguments )
            // console.log( 'constructor' )
            const {
                // attributes: {
                //     styleDefault,
                //     styleToggle,
                //     styleLight,
                //     styleDark,
                // }, 
                className, 
                setAttributes,
                // answersQid,
                // uuid
            } = props

            this.state = {
                isLoaded: false,
                isLoadedAnswers: true,
                error: null,
                questions: [],
                answers: [{
                    qid: '',
                    oid: '',
                    option: ''
                }],
                tabChange: null,
                selectChange: null,
                // answersQid: null,
                // firstQid: null,
                editing: false,
                newQuestion: false,
                style: [{
                    default: true,
                    toggle: false,
                    light: false,
                    dark: false,
                }]
            }
            
            if ( typeof this.props.attributes.uuid === undefined || this.props.attributes.uuid === null ) {
                this.setSaveUUID( this.uuidv4() )
            }

            this.onChangeTitle = this.onChangeTitle.bind( this )
            this.onChangeContent = this.onChangeContent.bind( this )
            this.setSavePoll = this.setSavePoll.bind( this )
            this.setSavePollTitle = this.setSavePollTitle.bind( this )
            this.setSaveQid = this.setSaveQid.bind( this )
            this.setSaveUUID = this.setSaveUUID.bind( this )
            this.handleSelectChange = this.handleSelectChange.bind( this )
            this.handleTabChange = this.handleTabChange.bind( this )
            this.handleAddQuestionClick = this.handleAddQuestionClick.bind( this )
            this.handleAddAnswerClick = this.handleAddAnswerClick.bind( this )
            this.handleInputChange = this.handleInputChange.bind( this )
            this.handlePositionChange = this.handlePositionChange.bind( this )
            this.handleSelectInputChange = this.handleSelectInputChange.bind( this )
            this.handleDeleteQuestionClick = this.handleDeleteQuestionClick.bind( this )
            this.handleDeleteAnswerClick = this.handleDeleteAnswerClick.bind( this )
            this.handleCancelClick = this.handleCancelClick.bind( this )
            this.handleSaveClick = this.handleSaveClick.bind( this )
            this.deleteQuestionById = this.deleteQuestionById.bind( this )
            this.deleteAnswerById = this.deleteAnswerById.bind( this )
            this.setPoll = this.setPoll.bind( this )
            this.setAnswers = this.setAnswers.bind( this )
            this.handleStyleClick = this.handleStyleClick.bind( this )

            setAttributes({
                classes: classnames(
                    className,
                    // styleToggle
                ),
            })

            // console.log( 'attributes', this.props.attributes )
            // console.log( 'className', className )
        }

        /**
         * componentDidMount()
         * Invoked immediately after a component is mounted (inserted into the tree).
         * Initialization that requires DOM nodes should go here. If you need to load
         * data from a remote endpoint, this is a good place to instantiate the network
         * request.
         */
        componentDidMount() {
            // console.log( 'componentDidMount' )
            // console.log( this.props )
            // console.log( this.props.attributes )
            this.getPollQuestions()
            
            // let s = [{
            //     default: false,
            //     toggle: false,
            //     light: false,
            //     dark: true,
            // }]

            // this.setState({
            //     style: s
            // }, () => console.log( 'this.state', this.state ) )
        }
        
        // Events \\
        onChangeTitle( title ) { this.props.setAttributes( { title } ) }
        onChangeContent( content ) { this.props.setAttributes( { content } ) }
        setSavePoll( poll ) { this.props.setAttributes( { poll } ) }
        setSavePollTitle( pollTitle ) { this.props.setAttributes( { pollTitle } ) }
        setSaveQid( answersQid ) { this.props.setAttributes( { answersQid } ) }
        setSaveUUID( uuid ) { this.props.setAttributes( { uuid } ) }

        // Handle Events \\
        handleSelectChange( event, editable = null ) {
            if ( editable ) {
                this.setState({ editing: true })
            }

            this.getPollAnswersById( event )
        }

        handleTabChange( event ) {
            this.setState({
                editing: false,
                newQuestion: false
            })

            this.getPollQuestions()
        }

        handleAddQuestionClick() {
            let qid = this.uuidv4()
            let question = [{
                'value': qid,
                'label': 'New Question Title',
                edited: true
            }]

            let answer = [
                {
                    'qid': qid,
                    'oid': this.uuidv4(),
                    'option': 'Answer 1',
                    edited: true
                },
                {
                    'qid': qid,
                    'oid': this.uuidv4(),
                    'option': ''
                }
            ]

            this.setState({
                questions: question,
                answers: answer,
                editing: true,
                newQuestion: true
            })
        }
        
        /** 
         * https://medium.freecodecamp.org/handling-state-in-react-four-immutable-approaches-to-consider-d1f5c00249d5
         * let user = this.state.user // this is a reference, not a copy...
         * Never mutate this.state directly, as calling setState() afterwards may 
         * replace the mutation you made. Treat this.state as if it were immutable.
         * Warning: Watch Out For Nested Objects!
         */
        handleAddAnswerClick( event ) {
            let answer = [
                {
                    'qid': event,
                    'oid': this.uuidv4(),
                    'option': ''
                }
            ]

            this.setState({
                answers: [ ...this.state.answers, ...answer ]
            })
        }

        handleInputChange( event, name ) {
            let newAnswers = this.state.answers.map( ( answer, id ) => {
                if ( name[0] !== id ) return answer
                return { ...answer, ...{ option: event, edited: true } }
            })
            
            this.setState({ answers: newAnswers })
        }

        handlePositionChange( positions ) {
            let newAnswers = this.state.answers.map( ( answer, id ) => {
                let a
                positions.forEach( ( v, k, self ) => {
                    if ( id === k ) {
                        a = { ...answer, ...{ edited: true, optionorder: v } }
                    }
                })
                return a
            })
            
            this.setState({ answers: newAnswers })
        }

        handleSelectInputChange( event, index ) {
            let newQuestions = this.state.questions.map( ( question, id ) => {
                if ( index !== id ) return question
                return { ...question, ...{ label: event, edited: true } }
            })

            this.setState({ questions: newQuestions })
        }

        /**
         * https://stackoverflow.com/questions/29527385/removing-element-from-array-in-component-state
         */
        handleDeleteQuestionClick( index, qid ) {
            // Change to <Notice/> ?
            if ( confirm( `Are you sure you wish to PERMANENTLY delete this poll and all it's answers?` ) ) {
                let newQuestions = [
                    ...this.state.questions.slice( 0, index ),
                    ...this.state.questions.slice( index + 1 ) 
                ]

                this.setState({
                    questions: newQuestions,
                    editing: false
                }, () => this.deleteQuestionById( qid ) )
            }
        }

        handleDeleteAnswerClick( index, oid ) {
            // Change to <Notice/> ?
            if ( confirm( 'Are you sure you wish to PERMANENTLY delete this poll answer?' ) ) {
                let newAnswers = [
                    ...this.state.answers.slice( 0, index ),
                    ...this.state.answers.slice( index + 1 )
                ]

                this.setState({ answers: newAnswers }, () => {
                    this.deleteAnswerById( oid )
                })
            }
        }

        handleCancelClick() {
            // Change to <Notice/> ?
            if ( confirm( 'Selecting another poll will cancel all unsaved text changes.' ) ) {
                this.handleTabChange()
            }
        }

        handleSaveClick( event ) {
            // Change to <Notice/> ?
            if ( confirm( 'Are you sure you wish to save changes?' ) ) {

                /** 
                 * https://codeburst.io/learn-understand-javascripts-reduce-function-b2b0406efbdc
                 * reduce( callback( accumulator, val, index, arr ), initialValue )
                 */

                let saveQuestion = this.state.questions.reduce( ( result, value ) => {
                    if ( value.edited ) {
                        result.push({
                            value: this.isNumeric( value.value ) ? value.value : 'new',
                            label: value.label
                        })
                    } return result
                }, [] )

                let saveAnswers = this.state.answers.reduce( ( result, value  ) => {
                    if ( value.edited ) {
                        result.push({
                            oid: this.isNumeric( value.oid ) ? value.oid : 'new',
                            option: value.option,
                            optionorder: value.optionorder
                        })
                    } return result
                }, [] )

                let qid = saveQuestion.length > 0 ? saveQuestion[0].value : event
                let q = saveQuestion.length > 0 ? saveQuestion[0].label : null

                let a = saveAnswers.map( ( object, key ) => {
                    let r = 'oid=' + object.oid + '&a=' + object.option + '&optionorder='

                    if ( object.optionorder === 0 || object.optionorder ) {
                        r += object.optionorder
                    } else {
                        r += key
                    }

                    return r
                })

                a = a.length > 0 ? a : null
                this.setPoll( qid, q, a )
            }
        }
        
        handleStyleClick( style ) {
            // console.log( 'handleStyleClick', style )
            // const {
            //     attributes: {
            //         styleToggle
            //     }
            // } = this.props

            const defaultStyle = ( style ) => {
                if ( style === true || style === 'default' ) {
                    this.props.setAttributes( { styleToggle: false } )
                    this.props.setAttributes( { styleLight: false } )
                    return true
                } else {
                    return false
                }
            }

            const darkStyle = ( style ) => {
                if ( style === false || style === 'dark' ) {
                    this.props.setAttributes( { styleToggle: true } )
                    this.props.setAttributes( { styleLight: false } )
                    return true
                } else {
                    return false
                }
            }

            const lightStyle = ( style ) => {
                if ( style === 'light' ) {
                    this.props.setAttributes( { styleLight: true } )
                    this.props.setAttributes( { styleToggle: false } )
                } else {
                    return false
                }
            }

            const s = [{
                default: defaultStyle( style ),
                light: lightStyle( style ),
                dark: darkStyle( style )
            }]

            this.setState({
                style: s
            })
            // }, () => console.log( 'this.state', this.state.style[0] ) )
        }

        setPoll( qid, question, answers ) {
            if ( qid && question ) {
                var self = this
                let url = gutenbergtemplateblock_ajax_object.ajax_url +
                          '?action=gutenbergtemplateblock_setPollQuestionById' +
                          '&qid=' + qid +
                          '&q=' + question +
                          '&security=' + gutenbergtemplateblock_ajax_object.security
                
                fetch( url )
                    .then( response => {
                        return response.json()
                    })
                    .then(
                        ( result ) => {
                            if ( result && answers ) {
                                let qid = result
                                this.setAnswers( qid, answers )
                            }
                        },
                        ( error ) => {
                            self.setState({
                                isLoaded: true,
                                error
                            })
                        }
                    )
            } else if ( answers ) {
                this.setAnswers( qid, answers )
            } else {
                console.log( 'setPoll nothing to save' )
            }
        }

        setAnswers( qid, answers ) {
            var self = this

            for ( let i = 0; i < answers.length; i++ ) {
                let url = gutenbergtemplateblock_ajax_object.ajax_url +
                          '?action=gutenbergtemplateblock_setPollAnswerById' +
                          '&qid=' + qid +
                          '&' + answers[i] +
                          '&security=' + gutenbergtemplateblock_ajax_object.security

                fetch( url )
                    .then( response => {
                        return response.json()
                    })
                    .then(
                        ( results ) => {
                            console.log( 'setAnswers results', results )
                        },
                        ( error ) => {
                            self.setState({
                                isLoaded: true,
                                error
                            })
                        }
                    )
            }
        }

        /** 
         * https://reactjs.org/docs/state-and-lifecycle.html#state-updates-may-be-asynchronous
         * // Correct
         * this.setState((state, props) => ({
         *     counter: state.counter + props.increment
         * }))
         */

        // Helpers \\
        getPollQuestions() {
            const { answersQid } = this.props.attributes
            
            if ( this.state.isLoaded ) {
                this.setState({ isLoaded: false })
            }
            
            var self = this
            let url = gutenbergtemplateblock_ajax_object.ajax_url + 
                      '?action=gutenbergtemplateblock_getPollQuestions&security=' + 
                      gutenbergtemplateblock_ajax_object.security
            
            fetch( url )
                .then( response => {
                    return response.json()
                })
                .then(
                    ( results ) => {
                        self.setState({ questions: results }, () => {
                            if ( this.isNumeric( answersQid ) ) {
                                this.getPollAnswersById( answersQid )
                            } else {
                                self.getFirstPoll()
                            }
                        })
                    },
                    ( error ) => {
                        self.setState({
                            isLoaded: true,
                            error
                        })
                    }
                )
        }

        getFirstPoll() {
            if ( this.state.isLoaded ) {
                this.setState({ isLoaded: false })
            }
            
            var self = this
            let url = gutenbergtemplateblock_ajax_object.ajax_url + 
                      '?action=gutenbergtemplateblock_getFirstPoll&security=' + 
                      gutenbergtemplateblock_ajax_object.security
    
            fetch( url )
                .then( response => {
                    return response.json()
                })
                .then(
                    ( results ) => {
                        let answersByOid = []
                        let uuid = this.uuidv4()
                        const pollOptions = results.map( ( object, key ) => {
                            answersByOid.push({
                                oid: object.oid,
                                option: decodeURIComponent( self.stripslashes( object.option ) )
                            })
                            return [
                                <p>
                                    <input
                                        id={ 'id-' + object.oid + '-' + uuid }
                                        type="radio"
                                        name={ "options-" + object.qid + '-' + uuid }
                                        value={ object.oid }
                                    />
                                    <label for={ 'id-' + object.oid + '-' + uuid }>
                                        { decodeURIComponent( self.stripslashes( object.option ) ) }
                                    </label>
                                </p>
                            ]
                            // return [
                            //     <p>
                            //         <label>
                            //             <input
                            //                 type="radio"
                            //                 name="options"
                            //                 value={ object.oid }
                            //             />
                            //             { decodeURIComponent( self.stripslashes( object.option ) ) }
                            //         </label>
                            //     </p>
                            // ]
                        })
                        
                        self.setSavePoll( pollOptions )
                        self.setSavePollTitle( results.length > 0 ? results[0].question : '' )
                        self.setSaveQid( results.length > 0 ? results[0].qid : '' )

                        self.setState({
                            isLoaded: true,
                            answers: answersByOid
                        })
                    },
                    ( error ) => {
                        self.setState({
                            isLoaded: true,
                            error
                        })
                    }
                )
        }

        getPollAnswersById( qid ) {
            this.setState({ isLoadedAnswers: false })

            var self = this
            let url = gutenbergtemplateblock_ajax_object.ajax_url +
                      '?action=gutenbergtemplateblock_getPollAnswersById' +
                      '&qid=' + qid +
                      '&security=' + gutenbergtemplateblock_ajax_object.security
            
            fetch( url )
                .then( response => {
                    return response.json()
                })
                .then(
                    ( result ) => {
                        let answersByOid = []
                        let uuid = this.uuidv4()
                        const pollOptions = result.map( ( object, key ) => {
                            answersByOid.push({
                                oid: object.oid,
                                option: decodeURIComponent( self.stripslashes( object.option ) )
                            })
                            return [
                                <p>
                                    <input
                                        id={ 'id-' + object.oid + '-' + uuid }
                                        type="radio"
                                        name={ "options-" + object.qid + '-' + uuid }
                                        value={ object.oid }
                                    />
                                    <label for={ 'id-' + object.oid + '-' + uuid }>
                                        { decodeURIComponent( self.stripslashes( object.option ) ) }
                                    </label>
                                </p>
                            ]
                            // return [
                            //     <p>
                            //         <label>
                            //             <input
                            //                 type="radio"
                            //                 name="options"
                            //                 value={ object.oid }
                            //             />
                            //             { decodeURIComponent( self.stripslashes( object.option ) ) }
                            //         </label>
                            //     </p>
                            // ]
                        })

                        self.setState({
                            answers: answersByOid,
                            isLoadedAnswers: true,
                            isLoaded: true
                        }, () => {
                            self.setSavePoll( pollOptions )
                            self.setSavePollTitle( result.length > 0 ? result[0].question : '' )
                            self.setSaveQid( result.length > 0 ? result[0].qid : '' )
                        })
                    },
                    ( error ) => {
                        self.setState({
                            isLoaded: true,
                            error
                        })
                    }
                )
        }

        deleteQuestionById( qid ) {
            var self = this
            let url = gutenbergtemplateblock_ajax_object.ajax_url + 
                      '?action=gutenbergtemplateblock_deleteQuestionById' + 
                      '&qid=' + qid +
                      '&security=' + gutenbergtemplateblock_ajax_object.security
    
            fetch( url )
                .then( response => {
                    return response.json()
                })
                .then(
                    ( result ) => {
                        console.log( 'deleteQuestionById: ', result )
                    },
                    ( error ) => {
                        self.setState({
                            isLoaded: true,
                            error
                        })
                    }
                )
        }

        deleteAnswerById( oid ) {
            if ( this.isNumeric( oid ) ) {
                var self = this
                let url = gutenbergtemplateblock_ajax_object.ajax_url + 
                          '?action=gutenbergtemplateblock_deleteAnswerById' + 
                          '&oid=' + oid +
                          '&security=' + gutenbergtemplateblock_ajax_object.security
        
                fetch( url )
                    .then( response => {
                        return response.json()
                    })
                    .then(
                        ( result ) => {
                            console.log( 'deleteAnswerById: ', result )
                        },
                        ( error ) => {
                            self.setState({
                                isLoaded: true,
                                error
                            })
                        }
                    )
            }
        }

        /** 
         * https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
         *  ES6 and the crypto API
         */
        uuidv4() {
            return ( [1e7]+-1e3+-4e3+-8e3+-1e11 ).replace( /[018]/g, c =>
                ( c ^ crypto.getRandomValues( new Uint8Array(1) )[0] & 15 >> c / 4 ).toString(16)
            )
        }

        /**
         * https://stackoverflow.com/questions/9716468/pure-javascript-a-function-like-jquerys-isnumeric
         */
        isNumeric( n ) {
            return !isNaN( parseFloat( n ) ) && isFinite( n )
        }

        /**
         * http://locutus.io/php/strings/stripslashes/
         */
        stripslashes( str ) {
            return ( str + '' )
                .replace( /\\(.?)/g, ( s, n1 ) => {
                    switch ( n1 ) {
                        case '\\':
                            return '\\'
                        case '0':
                            return '\u0000'
                        case '':
                            return ''
                        default:
                            return n1
                    }
                })
        }

        render() {
            const { 
                className, 
                setAttributes,
                attributes: {
                    classes,
                    styleToggle,
                    styleLight,
                    // titleColour,
                    // contentColour,
                    // textAlignment,
                    // title,
                    // content,
                    answersQid,
                    uuid
            }} = this.props
            
            const {
                isLoaded,
                isLoadedAnswers,
                questions,
                answers,
                editing,
                newQuestion,
                style
            }  = this.state

            return [
                <Inspector { ...{ setAttributes, ...this.props }} />,
                <Controls 
                    { ...{ setAttributes, ...this.props }}
                    onStyleChange={ this.handleStyleClick }
                />,
                <div className = {
                        classes +
                        ' editor-block' +
                        classnames({
                            ' style-toggle': styleToggle,
                            ' style-light': styleLight,
                        })
                    }
                    value={ uuid }
                >
                    <TabPanel
                        className="my-tab-panel"
                        activeClass="active-tab"
                        onSelect={ this.handleTabChange }
                        tabs={[
                            {
                                name: 'tab1',
                                title: 'Select',
                                className: 'tab-one'
                            },
                            {
                                name: 'tab2',
                                title: 'Edit',
                                className: 'tab-two'
                            },
                            {
                                name: 'tab3',
                                title: 'Settings',
                                className: 'tab-three'
                            },
                            {
                                name: 'tab4',
                                title: 'Style',
                                className: 'tab-four'
                            }
                        ]}
                    >
                        {
                            ( tab ) => {
                                if ( tab.name === 'tab1' ) {
                                    return [
                                        <div className = { classes }>
                                            { isLoaded ? 
                                                <PotDSelect
                                                    onSelectChange={ this.handleSelectChange }
                                                    questions={ questions }
                                                    answers={ answers }
                                                    editable={ false }
                                                    isLoadedAnswers={ isLoadedAnswers }
                                                    existingBlockQid={ answersQid }
                                                    uuid={ uuid }
                                                />
                                                :
                                                <div>
                                                    <Spinner/>
                                                    <div>Loading...</div>
                                                </div>
                                            }
                                        </div>
                                    ]
                                } else if ( tab.name === 'tab2' ) {
                                    return [
                                        <div className={ className }>
                                            { isLoaded ?
                                                <PotDSelect
                                                    onSelectChange={ this.handleSelectChange }
                                                    questions={ questions }
                                                    answers={ answers }
                                                    editable={ true }
                                                    editing={ editing }
                                                    isLoadedAnswers={ isLoadedAnswers }
                                                    inNewQuestion={ newQuestion }
                                                    onAddQuestionClick={ this.handleAddQuestionClick }
                                                    onAddAnswerClick={ this.handleAddAnswerClick }
                                                    onInputChange={ this.handleInputChange }
                                                    onPositionChange={ this.handlePositionChange }
                                                    onSelectInputChange={ this.handleSelectInputChange }
                                                    onDeleteQuestionClick={ this.handleDeleteQuestionClick }
                                                    onDeleteAnswerClick={ this.handleDeleteAnswerClick }
                                                    onCancelClick={ this.handleCancelClick }
                                                    onSaveClick={ this.handleSaveClick }
                                                />
                                                :
                                                <div>
                                                    <Spinner />
                                                    <div>Loading...</div>
                                                </div>
                                            }
                                        </div>
                                    ]
                                } else if ( tab.name === 'tab3' ) {
                                    return [
                                        <div className={ className }>
                                            <PotDSettings/>
                                        </div>
                                    ]
                                } else if ( tab.name === 'tab4' ) {
                                    return [
                                        <div className={ className }>
                                            <PotDStyle
                                                onStyleRadioChange={ this.handleStyleClick }
                                            />
                                        </div>
                                    ]
                                }
                                return[]
                            }
                        }
                    </TabPanel>
                </div>
            ]
        }
    },
    save: props => {
        const { 
            attributes: { 
                // textAlignment, 
                // blockAlignment,
                styleToggle,
                styleLight,
                pollTitle,
                poll,
                answersQid,
                uuid
            }
        } = props

        const className = classnames(
            'wp-block-gutenbergtemplateblock-templateblock',
            // { 'style-toggle': styleToggle },
            classnames({
                ' style-toggle': styleToggle,
                ' style-light': styleLight,
            })
        )

        return (
            <div className = { className + ' client-block' } value={ uuid }>
                <h3>{ pollTitle }</h3>
                <div class={"group-" + uuid}>
                    { poll }
                </div>
                <div>
                    <button class="potd-vote-btn" value={ answersQid }>Vote!</button>
                    <button class="potd-results-btn" value={ answersQid }>Results</button>
                </div>
                <div class="potd-result"></div>
            </div>
        )
    }
})