import "./i18n.js";

/**
 * Block dependencies
 */
import classnames from 'classnames';
import icons from './icons';
import Inspector from "./inspector";
import Controls from "./controls";
import attributes from "./attributes";
import colourAttributes from "./colours";
import PotdSelect from "./components/PotdSelect";
import './style.scss';
import './editor.scss';

// var el = wp.element.createElement;
// var { withState } = wp.compose.withState;
// var withState = wp.compose.withState;

/**
 * Internal block libraries
 */
const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
const { 
    RichText,
    ColorPalette
} = wp.editor;
const { 
    TabPanel
} = wp.components;
const { Component } = wp.element;

// console.log( wp.components );

registerBlockType( 'gutenbergtemplateblock/templateblock', 
{
    title: __( 'Template - Block!', 'gutenbergtemplateblock' ),
    description: __( 'A gutenberg block template.', 'gutenbergtemplateblock' ),
    icon: {
        background: 'rgba(254, 243, 224, 0.52)',
        src: icons.dynamic,
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
            return { 'data-align': blockAlignment };
        }
    },
    edit: class extends Component {
        constructor( props ) {
            super( ...arguments );
            const {
                attributes: {
                    styleToggle,
                }, 
                className, 
                setAttributes
            } = props;
            this.state = {
                isLoaded: false,
                error: null,
                questions: [],
                answers: [{ 
                    qid: '',
                    oid: '', 
                    option: '' 
                }],
                tabChange: null,
                selectChange: null,
                answersQid: null,
                firstQid: null,
                editing: false,
                newQuestion: false
            };
            
            this.onChangeTitle = this.onChangeTitle.bind( this );
            this.onChangeContent = this.onChangeContent.bind( this );
            this.setSavePoll = this.setSavePoll.bind( this );
            this.setSavePollTitle = this.setSavePollTitle.bind( this );
            this.handleSelectChange = this.handleSelectChange.bind( this );
            this.handleTabChange = this.handleTabChange.bind( this );
            this.handleAddQuestionClick = this.handleAddQuestionClick.bind( this );
            this.handleAddAnswerClick = this.handleAddAnswerClick.bind( this );
            this.handleInputChange = this.handleInputChange.bind( this );
            this.handleSelectInputChange = this.handleSelectInputChange.bind( this );
            this.handleDeleteQuestionClick = this.handleDeleteQuestionClick.bind( this );
            this.handleDeleteAnswerClick = this.handleDeleteAnswerClick.bind( this );
            this.handleCancelClick = this.handleCancelClick.bind( this );
            this.handleSaveClick = this.handleSaveClick.bind( this );
            this.setPoll = this.setPoll.bind( this );
            this.setAnswers = this.setAnswers.bind( this );

            setAttributes({
                classes: classnames(
                    className,
                    { 'style-toggle': styleToggle }
                )
            });
        }

        /** componentDidMount()
         * Invoked immediately after a component is mounted (inserted into the tree).
         * Initialization that requires DOM nodes should go here. If you need to load
         * data from a remote endpoint, this is a good place to instantiate the network
         * request.
         */
        componentDidMount() {
            this.getPollQuestions();
        }
        
        // Events \\
        onChangeTitle( title ) { this.props.setAttributes( { title } ) }
        onChangeContent( content ) { this.props.setAttributes( { content } ) }
        setSavePoll( poll ) { this.props.setAttributes( { poll } ) }
        setSavePollTitle( pollTitle ) { this.props.setAttributes( { pollTitle } ) }

        // Handle Events \\
        handleSelectChange( event, editable = null ) {
            if ( editable ) {
                this.setState({ editing: true });
            }

            this.getPollAnswersById( event );
        }

        handleTabChange( event ) {
            this.setState({
                editing: false,
                newQuestion: false
            });

            this.getPollQuestions();
        }

        handleAddQuestionClick() {
            let qid = this.uuidv4();
            let question = [{
                'value': qid,
                'label': 'New Question Title',
                edited: true
            }];

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
            ];

            this.setState({
                questions: question,
                answers: answer,
                editing: true,
                newQuestion: true
            });
        }
        
        /** https://medium.freecodecamp.org/handling-state-in-react-four-immutable-approaches-to-consider-d1f5c00249d5
         * let user = this.state.user; // this is a reference, not a copy...
         * Never mutate this.state directly, as calling setState() afterwards may 
         * replace the mutation you made. Treat this.state as if it were immutable.
         * Warning: Watch Out For Nested Objects!
         */
        handleAddAnswerClick( event ) {
            console.log( 'handleAddAnswerClick', event );
            let answer = [
                {
                    'qid': event,
                    'oid': this.uuidv4(),
                    'option': ''
                }
            ];

            this.setState({
                answers: [ ...this.state.answers, ...answer ]
            });
        }

        handleInputChange( event, name ) {
            let newAnswers = this.state.answers.map( ( answer, id ) => {
                if ( name[0] !== id ) return answer;
                return { ...answer, ...{ option: event, edited: true } };
            });
            
            this.setState({ answers: newAnswers });
        }

        handleSelectInputChange( event, index ) {
            let newQuestions = this.state.questions.map( ( question, id ) => {
                if ( index !== id ) return question;
                return { ...question, ...{ label: event, edited: true } };
            });

            this.setState({ questions: newQuestions });
        }

        // https://stackoverflow.com/questions/29527385/removing-element-from-array-in-component-state
        handleDeleteQuestionClick( index ) {
            if ( confirm( 'Are you sure you wish to delete this poll question?' ) ) {
                let newQuestions = [
                    ...this.state.questions.slice( 0, index ),
                    ...this.state.questions.slice( index + 1 ) 
                ];

                this.setState({
                    questions: newQuestions,
                    editing: false
                });
            }
        }

        handleDeleteAnswerClick( index ) {
            if ( confirm( 'Are you sure you wish to delete this poll answer?' ) ) {
                let newAnswers = [
                    ...this.state.answers.slice( 0, index ),
                    ...this.state.answers.slice( index + 1 ) 
                ];

                this.setState({ answers: newAnswers });
            }
        }

        handleCancelClick() {
            this.handleTabChange();
        }

        handleSaveClick( event ) {
            if ( confirm( 'Are you sure you wish to save changes?' ) ) {

                /** https://codeburst.io/learn-understand-javascripts-reduce-function-b2b0406efbdc
                 * reduce( callback( accumulator, value, index, array ), initialValue )
                 * accumulator — the accumulator accumulates all of the callbacks returned values.
                 * val — the current value being processed
                 * index — the current index of the value being processed
                 * arr — the original array
                 * 
                 * reduce( callback( result, value, key, original ), initialValue )
                 */

                // Return edited question and answers
                let saveQuestion = this.state.questions.reduce( ( result, value  ) => {
                    if ( value.edited ) {
                        result.push({
                            value: this.isNumeric( value.value ) ? value.value : 'new',
                            label: encodeURIComponent( value.label )
                        });
                    } return result;
                }, [] );

                let saveAnswers = this.state.answers.reduce( ( result, value  ) => {
                    if ( value.edited ) {
                        result.push({
                            oid: this.isNumeric( value.oid ) ? value.oid : 'new',
                            option: encodeURIComponent( value.option )
                        });
                    } return result;
                }, [] );

                let qid = saveQuestion.length > 0 ? saveQuestion[0].value : event;
                let q = saveQuestion.length > 0 ? saveQuestion[0].label : null;
                let a = saveAnswers.map( ( object, key ) => {
                    return 'oid=' + object.oid + '&a=' + encodeURIComponent( object.option );
                });
                a = a.length > 0 ? a : null;

                this.setPoll( qid, q, a );
            }
        }

        setPoll( qid, question, answers ) {
            if ( qid && question ) {
                var self = this;
                let url = gutenbergtemplateblock_ajax_object.ajax_url +
                          '?action=gutenbergtemplateblock_setPollQuestionById' +
                          '&qid=' + qid +
                          '&q=' + question +
                          '&security=' + gutenbergtemplateblock_ajax_object.security;
                
                fetch( url )
                    .then( response => {
                        return response.json();
                    })
                    .then(
                        ( results ) => {
                            if ( results && answers ) {
                                let qid = result;
                                this.setAnswers( qid, answers );
                            }
                        },
                        ( error ) => {
                            self.setState({
                                isLoaded: true,
                                error
                            });
                        }
                    )
            } else if ( answers ) {
                this.setAnswers( qid, answers );
            } else {
                console.log( 'setPoll nothing to save' );
            }
        }

        setAnswers( qid, answers ) {
            var self = this;

            for ( let i = 0; i < answers.length; i++ ) {
                let url = gutenbergtemplateblock_ajax_object.ajax_url + 
                          '?action=gutenbergtemplateblock_setPollAnswerById' +
                          '&qid=' + qid +
                          '&' + answers[i] +
                          '&security=' + gutenbergtemplateblock_ajax_object.security;

                fetch( url )
                    .then( response => {
                        return response.json();
                    })
                    .then(
                        ( results ) => {
                            console.log( 'setAnswers results', results );
                        },
                        ( error ) => {
                            self.setState({
                                isLoaded: true,
                                error
                            });
                        }
                    )
            }
        }

        /** 
         * https://reactjs.org/docs/state-and-lifecycle.html#state-updates-may-be-asynchronous
         * // Correct
         * this.setState((state, props) => ({
         *     counter: state.counter + props.increment
         * }));
         */

        // Helpers \\
        getPollQuestions() {
            if ( this.state.isLoaded ) {
                this.setState({ isLoaded: false });
            }
            
            var self = this;
            let url = gutenbergtemplateblock_ajax_object.ajax_url + 
                      '?action=gutenbergtemplateblock_getPollQuestions&security=' + 
                      gutenbergtemplateblock_ajax_object.security;
    
            fetch( url )
                .then( response => {
                    return response.json();
                })
                .then(
                    ( results ) => {
                        self.setState({ questions: results });
                        self.getFirstPoll();
                    },
                    ( error ) => {
                        self.setState({
                            isLoaded: true,
                            error
                        });
                    }
                )
        }

        getFirstPoll() {
            if ( this.state.isLoaded ) {
                this.setState({ isLoaded: false });
            }
            
            var self = this;
            let url = gutenbergtemplateblock_ajax_object.ajax_url + 
                      '?action=gutenbergtemplateblock_getFirstPoll&security=' + 
                      gutenbergtemplateblock_ajax_object.security;
    
            fetch( url )
                .then( response => {
                    return response.json();
                })
                .then(
                    ( results ) => {
                        let answersByOid = [];
                        const pollOptions = results.map( ( object, key ) => {
                            answersByOid.push({
                                oid: object.oid,
                                option: object.option
                            });
                            return [
                                <p>
                                    <input
                                        type="radio"
                                        name="options"
                                        value={ object.oid }
                                    />
                                    { object.option }
                                </p>
                            ];
                        });
                        
                        self.setSavePoll( pollOptions );
                        self.setSavePollTitle( results[0].question );

                        self.setState({
                            isLoaded: true,
                            answers: answersByOid
                        });
                    },
                    ( error ) => {
                        self.setState({
                            isLoaded: true,
                            error
                        });
                    }
                )
        }

        getPollAnswersById( qid ) {
            var self = this;
            let url = gutenbergtemplateblock_ajax_object.ajax_url + 
                      '?action=gutenbergtemplateblock_getPollAnswersById' + 
                      '&qid=' + qid +
                      '&security=' + gutenbergtemplateblock_ajax_object.security;
    
            fetch( url )
                .then( response => {
                    return response.json();
                })
                .then(
                    ( result ) => {
                        result.map( ( object, key ) => {
                            object.option = decodeURIComponent( object.option );
                        });
                        self.setState({ answers: result });
                    },
                    ( error ) => {
                        self.setState({
                            isLoaded: true,
                            error
                        });
                    }
                )
        }

        /** https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
         *  Solution that uses ES6 and the crypto API
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
            return !isNaN( parseFloat( n ) ) && isFinite( n );
        }

        render() {
            const { 
                className, 
                setAttributes,
                attributes: {
                    classes,
                    titleColour,
                    contentColour,
                    textAlignment,
                    title,
                    content
            }} = this.props;
            
            const {
                isLoaded,
                questions,
                answers,
                editing,
                newQuestion
            }  = this.state;

            return [
                <Inspector {...{ setAttributes, ...this.props }} />,
                <Controls {...{ setAttributes, ...this.props }} />,
                <div className = { classes }>
                    <div className = { classes }>
                        <ColorPalette
                            colors = { colourAttributes.colours }
                            value = { titleColour }
                            onChange = { titleColour => { setAttributes( { titleColour } ) } }
                        />
                        <div>
                            { __( 'Title', 'gutenbergtemplateblock' ) }
                        </div>
                        <RichText
                            tagName = "h2"
                            multiline = "p"
                            placeholder = { __( 'Add title here', 'gutenbergtemplateblock' ) }
                            style = { { textAlign: textAlignment, color: titleColour } }
                            onChange = { this.onChangeTitle }
                            value = { title }
                        />
                    </div>
                    <div className = { classes }>
                        <ColorPalette
                            colors = { colourAttributes.colours }
                            value = { contentColour }
                            onChange = { contentColour => { setAttributes( { contentColour } ) } }
                        />
                        <div id = "GTBContentText">
                            <div>
                                { __( 'Content', 'gutenbergtemplateblock' ) }
                            </div>
                            <RichText
                                class = "gutenbergtemplateblock-content"
                                tagName = "div"
                                multiline = "p"
                                placeholder = { __( 'Add content here', 'gutenbergtemplateblock' ) }
                                style = { { textAlign: textAlignment, color: contentColour } }
                                onChange = { this.onChangeContent }
                                value = { content }
                            />
                        </div>
                    </div>
                    <TabPanel
                        className="my-tab-panel"
                        activeClass="active-tab"
                        onSelect={ this.handleTabChange }
                        tabs={[
                            {
                                name: 'tab1',
                                title: 'Select Poll',
                                className: 'tab-one'
                            },
                            {
                                name: 'tab2',
                                title: 'Add / Edit / Delete',
                                className: 'tab-two'
                            },
                            {
                                name: 'tab3',
                                title: 'Settings',
                                className: 'tab-three'
                            }
                        ]}
                    >
                        {
                            ( tab ) => {
                                if ( tab.name === 'tab1' ) {
                                    return [
                                        <div className = { classes }>
                                            { isLoaded ? 
                                                <PotdSelect
                                                    onSelectChange={ this.handleSelectChange }
                                                    questions={ questions }
                                                    answers={ answers }
                                                    editable={ false }
                                                />
                                                :
                                                <div>Loading...</div>
                                            }
                                        </div>
                                    ];
                                } else if ( tab.name === 'tab2' ) {
                                    return [
                                        <div className={ className }>
                                            { isLoaded ?
                                                <PotdSelect
                                                    onSelectChange={ this.handleSelectChange }
                                                    questions={ questions }
                                                    answers={ answers }
                                                    editable={ true }
                                                    editing={ editing }
                                                    inNewQuestion={ newQuestion }
                                                    onAddQuestionClick={ this.handleAddQuestionClick }
                                                    onAddAnswerClick={ this.handleAddAnswerClick }
                                                    onInputChange={ this.handleInputChange }
                                                    onSelectInputChange={ this.handleSelectInputChange }
                                                    onDeleteQuestionClick={ this.handleDeleteQuestionClick }
                                                    onDeleteAnswerClick={ this.handleDeleteAnswerClick }
                                                    onCancelClick={ this.handleCancelClick }
                                                    onSaveClick={ this.handleSaveClick }
                                                />
                                                :
                                                <div>Loading...</div>
                                            }
                                        </div>
                                    ];
                                } else if ( tab.name === 'tab3' ) {
                                    return [
                                        <div className={ className }>
                                            <p>{ tab.name }</p>
                                        </div>
                                    ];
                                }
                                return[];
                            }
                        }
                    </TabPanel>
                </div>
            ];
        }
    },
    save: props => {
        const { 
            attributes: { 
                textAlignment, 
                blockAlignment, 
                styleToggle, 
                title, 
                content,
                titleColour,
                contentColour,
                pollTitle,
                poll
            }
        } = props;

        const className = classnames(
            'wp-block-gutenbergtemplateblock-templateblock',
            { 'style-toggle': styleToggle },
        );
        
        return (
            <div className = { className }>
                <h2 
                    className = { classnames(
                        `align${ blockAlignment }`,
                        'gutenbergtemplateblock-title'
                    )}
                    style = { { textAlign: textAlignment, color: titleColour } }
                >
                    { title }
                </h2>
                <div className = { classnames(
                        `align${ blockAlignment }`,
                        'gutenbergtemplateblock-content'
                    )}
                    style = { { textAlign: textAlignment, color: contentColour } }
                >
                    { content }
                </div>
                { pollTitle }
                { poll }
            </div>
        );
    },
});