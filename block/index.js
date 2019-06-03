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

window.addEventListener( 'load', function() {

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
                if ( result === 'fail' ) {
                    setResultMessage( 'setPollStart-fail' )
                }
            },
            ( error ) => {
                setResultMessage( 'setPollStart-error' )
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
                attributes: {
                    // blockAlignment,
                    // textAlignment
                }, 
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
                }],
                activeStyle: 'default',
                activeShadow: false,
                ajaxResults: '',
                showResults: false
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
            this.handleStyleCheckboxClick = this.handleStyleCheckboxClick.bind( this )
            this.handleAlignClick = this.handleAlignClick.bind( this )

            setAttributes({
                classes: classnames(
                    className,
                    // styleToggle
                ),
            })
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
            // console.log( 'this.props', this.props )
            // console.log( this.props.attributes )
            this.getPollQuestions()
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

        handleTabChange() {

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

            let i = 0
            const newAnswers = this.state.answers.map( ( answer, id ) => {
                i = id
                return { ...answer, ...{ optionorder: id } }
            })

            let answer = [{
                'qid': event,
                'oid': this.uuidv4(),
                'option': '',
                'optionorder': i + 1
            }]

            this.setState({
                answers: [ ...newAnswers, ...answer ]
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
                    } return r
                })

                a = a.length > 0 ? a : null
                this.setPoll( qid, q, a )
            }
        }
        
        handleStyleClick( style ) {

            let active = 'default'

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
                    active = 'dark'
                    return true
                } else {
                    return false
                }
            }

            const lightStyle = ( style ) => {
                if ( style === 'light' ) {
                    this.props.setAttributes( { styleLight: true } )
                    this.props.setAttributes( { styleToggle: false } )
                    active = 'light'
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
                style: s,
                activeStyle: active
            })
        }

        handleStyleCheckboxClick( event ) {

            this.props.setAttributes( { styleShadow: event } )
            this.setState({
                activeShadow: event
            })
        }

        handleAlignClick() {

            this.getPollAnswersById( this.props.attributes.answersQid )
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
                            if ( self.isNumeric( result ) && answers ) {
                                const qid = result
                                self.setAnswers( qid, answers, true )
                            } else if ( self.isNumeric( result ) ) {
                                self.setResultMessage( 'setPollQuestion-success' )
                            } else if ( result === 'fail' ) {
                                self.setResultMessage( 'setPollQuestion-fail' )
                            } else {
                                self.setResultMessage( 'setPollQuestion-unknown' )
                            }
                        },
                        ( error ) => {
                            self.setResultMessage( 'setPollQuestion-error' )
                            self.setState({
                                isLoaded: true,
                                error
                            })
                        }
                    )
            } else if ( answers ) {
                this.setAnswers( qid, answers )
            } else {
                this.setResultMessage( 'setPoll-nothing-to-save' )
            }
        }

        setAnswers( qid, answers, qSet = null ) {

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
                        ( result ) => {
                            if ( qSet ) {
                                self.setResultMessage( 'setQ&A-' + result )
                            } else {
                                self.setResultMessage( 'setAnswers-' + result )
                            }
                        },
                        ( error ) => {
                            self.setResultMessage( 'setAnswers-error' )
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
                        self.setResultMessage( 'getPollQuestions-error' )
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
                        if ( results ) {
                            self.setPollSaveDetails( results )
                        } else {
                            self.setResultMessage( 'getFirstPoll-fail' )
                        }
                    },
                    ( error ) => {
                        self.setResultMessage( 'getFirstPoll-error' )
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
                    ( results ) => {
                        if ( results ) {
                            self.setPollSaveDetails( results )
                        } else {
                            self.setResultMessage( 'getPollAnswersById-fail' )
                        }
                    },
                    ( error ) => {
                        self.setResultMessage( 'getPollAnswersById-error' )
                        self.setState({
                            isLoaded: true,
                            error
                        })
                    }
                )
        }

        setPollSaveDetails( results ) {
            const {
                attributes: {
                    textAlignment
                }
            } = this.props

            let answersByOid = []
            let uuid = this.uuidv4()
            const pollOptions = results.map( ( object, key ) => {
                answersByOid.push({
                    oid: object.oid,
                    option: decodeURIComponent( this.stripslashes( object.option ) )
                })
                return [
                    <p
                        style={ 'justify-content:' + textAlignment }
                    >
                        <input
                            id={ 'id-' + object.oid + '-' + uuid }
                            type="radio"
                            name={ "options-" + object.qid + '-' + uuid }
                            value={ object.oid }
                        />
                        <label for={ 'id-' + object.oid + '-' + uuid }>
                            { decodeURIComponent( this.stripslashes( object.option ) ) }
                        </label>
                    </p>
                ]
            })

            this.setState({
                answers: answersByOid,
                isLoadedAnswers: true,
                isLoaded: true
            }, () => {
                this.setSavePoll( pollOptions )
                this.setSavePollTitle( results.length > 0 ? results[0].question : '' )
                this.setSaveQid( results.length > 0 ? results[0].qid : '' )
            })
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
                        self.setResultMessage( 'deleteQuestionById-' + result )
                    },
                    ( error ) => {
                        self.setResultMessage( 'deleteQuestionById-error' )
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
                            self.setResultMessage( 'deleteAnswerById-' + result )
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

        setResultMessage( result ) {
            
            const transitionTimeMessage = 5000;
            const transitionTimeOpacity = 2000;
            
            const resultSwitch = ( result ) => ({
                'setPollStart-fail': 'Failed to set poll, possible database issue.',
                'setPollStart-error': 'Failed to set poll, fetch error encountered.',
                'setPoll-nothing-to-save': 'Nothing to save.',
                'setPollQuestion-success': 'Poll question successfully saved.',
                'setPollQuestion-fail': 'Poll question failed to save, possible database issue.',
                'setPollQuestion-unknown': 'Unknown issue encountered while saving poll question.',
                'setPollQuestion-error': 'Failed to save question, fetch error encountered.',
                'setQ&A-success': 'Poll question and answers successfully saved.',
                'setQ&A-fail': 'Poll question and answers failed to save, possible database issue.',
                'setAnswers-success': 'Poll answers successfully saved.',
                'setAnswers-fail': 'Poll answers failed to save, possible database issue.',
                'setAnswers-error': 'Failed to save answers, fetch error encountered.',
                'getPollQuestions-error': 'Failed to get poll questions, fetch error encountered.',
                'getFirstPoll-fail': 'Failed to get poll, possible database issue.',
                'getFirstPoll-error': 'Failed to get poll, fetch error encountered.',
                'getPollAnswersById-fail': 'Failed to get poll answers, possible database issue.',
                'getPollAnswersById-error': 'Failed to get poll answers, fetch error encountered.',
                'deleteQuestionById-success': 'Successfully deleted question.',
                'deleteQuestionById-fail': 'Failed to delete question, possible database issue.',
                'deleteQuestionById-error': 'Failed to delete questions, fetch error encountered.',
                'deleteAnswerById-success': 'Successfully deleted answer.',
                'deleteAnswerById-fail': 'Failed to delete answer, possible database issue.',
                'deleteAnswerById-error': 'Failed to delete answer, fetch error encountered.'
            })[ result ]

            // Fades in the text associated with the result
            // then sets opacity back to 0 to fade the text
            // then removes the text after fade complete
            this.setState({
                showResults: true,
                ajaxResults: resultSwitch( result )
            }, () => {
                setTimeout( () => {
                    this.setState({
                        showResults: false
                    }, () => {
                        setTimeout( () => {
                            this.setState({ ajaxResults: '' })
                        }, transitionTimeOpacity )
                    })
                }, transitionTimeMessage )
            })
        }

        // Helpers \\

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
                    styleShadow,
                    // titleColour,
                    // contentColour,
                    textAlignment,
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
                style,
                activeStyle,
                activeShadow,
                showResults,
                ajaxResults
            }  = this.state

            return [
                <Inspector { ...{ setAttributes, ...this.props }} />,
                <Controls 
                    { ...{ setAttributes, ...this.props }}
                    onStyleChange={ this.handleStyleClick }
                    onAlignChange={ this.handleAlignClick }
                />,
                <div className = {
                        classes +
                        ' editor-block' +
                        classnames({
                            ' style-toggle': styleToggle,
                            ' style-light': styleLight,
                            ' style-shadow': styleShadow
                        })
                    }
                    value={ uuid }
                    style={ { textAlign: textAlignment } }
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
                                                onStyleCheckboxChange={ this.handleStyleCheckboxClick }
                                                styleAttributes={{
                                                    'toggle': styleToggle,
                                                    'light': styleLight,
                                                    'shadow': styleShadow
                                                }}
                                                activeStyle={ activeStyle }
                                                activeShadow={ activeShadow }
                                            />
                                        </div>
                                    ]
                                }
                                return[]
                            }
                        }
                    </TabPanel>
                    <div class={
                            'potd-edit-results' + 
                            classnames({ ' potd-edit-results-show': showResults })
                        }
                    >
                        { ajaxResults }
                    </div>
                </div>
            ]
        }
    },
    save: props => {
        const { 
            attributes: { 
                textAlignment,
                blockAlignment,
                styleToggle,
                styleLight,
                styleShadow,
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
                ' style-shadow': styleShadow,
            }),
            `align${blockAlignment}`,
        )

        return (
            <div
                className={ className + ' client-block' }
                value={ uuid }
                style={ { textAlign: textAlignment } }
            >
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