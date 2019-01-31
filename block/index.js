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
    Button,
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
    // edit: props => {
    edit: class extends Component {

        constructor( props ) {
            console.log( 'constructor' );
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
                answers: [],
                tabChange: null,
                selectChange: null,
                answersQid: null,
                firstQid: null,
                editing: false
            };
            // console.log(this.state);
            this.onChangeTitle = this.onChangeTitle.bind( this );
            this.onChangeContent = this.onChangeContent.bind( this );
            this.setSavePoll = this.setSavePoll.bind( this );
            this.setSavePollTitle = this.setSavePollTitle.bind( this );
            // this.getPollById = this.getPollById.bind( this );
            this.handleSelectChange = this.handleSelectChange.bind( this );
            this.handleTabChange = this.handleTabChange.bind( this );
            this.handleAddQuestionClick = this.handleAddQuestionClick.bind( this );
            this.handleAddAnswerClick = this.handleAddAnswerClick.bind( this );
            this.handleInputChange = this.handleInputChange.bind( this );

            setAttributes({
                classes: classnames(
                    className,
                    { 'style-toggle': styleToggle }
                )
            });

            // this.init();
        }

        /** componentDidMount()
         * Invoked immediately after a component is mounted (inserted into the tree).
         * Initialization that requires DOM nodes should go here. If you need to load
         * data from a remote endpoint, this is a good place to instantiate the network
         * request.
         */
        componentDidMount() {
            console.log( 'componentDidMount' );
            // this.init();
            this.getPollQuestions();
        }

        init() {
            // var self = this;
            // let url = gutenbergtemplateblock_ajax_object.ajax_url + 
            //             '?action=gutenbergtemplateblock_getFirstPollQid' + 
            //             '&security=' + gutenbergtemplateblock_ajax_object.security;
    
            // fetch( url )
            //     .then(response => {
            //         return response.json();
            //     })
            //     .then(
            //         (result) => {
            //             // console.log( result );
            //             self.props.setAttributes( { firstPollId: result[0].qid } );
            //             this.getPollById( result[0].qid );
            //         },
            //         (err) => {
            //             console.log( error );
            //             self.props.setAttributes( { error: err } );
            //         }
            //     )
        }
        
        // Events \\
        onChangeTitle( title ) { this.props.setAttributes( { title } ) }
        onChangeContent( content ) { this.props.setAttributes( { content } ) }
        setSavePoll( poll ) { this.props.setAttributes( { poll } ) }
        setSavePollTitle( pollTitle ) { this.props.setAttributes( { pollTitle } ) }

        // Handle Events \\
        handleSelectChange( event ) {
            // console.log( 'handleSelectChange' );
            // console.log( event );
            this.getPollAnswersById( event );
        }

        handleTabChange( event ) {
            // console.log( 'handleTabChange' );
            this.setState({
                editing: false
            });
            this.getPollQuestions();
        }

        handleAddQuestionClick( event ) {
            let question = [{
                'value': 'new',
                'label': 'New Question Title'
            }];

            let answer = [
                {
                    'oid': 'new',
                    'option': 'Answer 1'
                },
                {
                    'oid': 'new',
                    'option': ''
                }
            ];

            // console.log( 'this.state.questions' );
            // console.log( this.state.questions );
            // console.log( 'this.state.answers' );
            // console.log( this.state.answers );
            // console.log( question[0] );
            // console.log( answer[0] );

            this.setState({
                questions: question,
                answers: answer,
                editing: true
            });
        }

        handleAddAnswerClick( event ) {
            let answer = [
                {
                    'oid': 'new',
                    'option': ''
                }
            ];

            /** https://medium.freecodecamp.org/handling-state-in-react-four-immutable-approaches-to-consider-d1f5c00249d5
             * let user = this.state.user; // this is a reference, not a copy...
             * Never mutate this.state directly, as calling setState() afterwards may 
             * replace the mutation you made. Treat this.state as if it were immutable.
             * Warning: Watch Out For Nested Objects!
             */
            // updateState({target}) {
            //     this.setState({
            //         user: {...this.state.user, [target.name]: target.value}
            //     });
            // }

            this.setState({
                answers: [ ...this.state.answers, ...answer ]
            }, () => console.log(this.state.answers));
        }

        handleInputChange( event, name ) {
            console.log( 'handleInputChange' );
            // console.log( event );
            // console.log( name[0] );
            console.log( this.state.answers[ name[0] ].option );

            // this.setState( ( event ) => { answers[name]: event.target.value });
            this.setState({
                answers: [ this.state.answers[ name[0] ].option, event ]
            });
            
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
            // console.log( 'getPollQuestions' );
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
                        // console.log(results[0].value);
                        // if ( self.state.firstQid === null ) {
                        //     // self.setState( ( results ) => ({
                        //     self.setState({
                        //         // isLoaded: true,
                        //         questions: results,
                        //         firstQid: results[0].value
                        //     });
                        // } else {
                            self.setState({
                                // isLoaded: true,
                                questions: results
                            });
                        // }
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
            // console.log( 'getFirstPoll' );
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
                            answersByOid.push({ oid: object.oid, option: object.option });
                            return [
                                <p><input type="radio" name="options" value={ object.oid }/>{ object.option }</p>
                            ];
                        });
                        // console.log('answersByOid');
                        // console.log(answersByOid);
                        
                        self.setSavePoll( pollOptions );
                        self.setSavePollTitle( results[0].question );
                        self.setState({
                            isLoaded: true,
                            answers: answersByOid,
                            // firstQid: results[0].qid
                        });
                        // console.log('this.state.firstQid');
                        // console.log(this.state.firstQid);
                        // this.state.firstQid === null ? 
                        //     self.setState( ( result ) => ({
                        //         isLoaded: true,
                        //         answers: result,
                        //         firstQid: result[0].qid
                        //     }))
                        //     : 
                        //     self.setState({
                        //         isLoaded: true,
                        //         answers: result
                        //     });
                    },
                    ( error ) => {
                        self.setState({
                            isLoaded: true,
                            error
                        });
                    }
                )
        }

        // getPollById( qid ) {
        //     var self = this;
        //     let url = gutenbergtemplateblock_ajax_object.ajax_url +
        //               '?action=gutenbergtemplateblock_getPollById' +
        //               '&qid=' + qid +
        //               '&security=' + gutenbergtemplateblock_ajax_object.security;
    
        //     fetch( url )
        //         .then( response => {
        //             return response.json();
        //         })
        //         .then(
        //             ( result ) => {
        //                 // console.log( result );
        //                 const pollOptions = result.map( ( object, key ) => {
        //                     return [
        //                         <p><input type="radio" name="options" value={ object.oid }/>{ object.option }</p>
        //                     ];
        //                 });
                        
        //                 self.setSavePoll( pollOptions );
        //                 self.setSavePollTitle( result[0].question );
        //                 self.setState({
        //                     // isLoaded: true,
        //                     questions: result
        //                 });
        //             },
        //             ( error ) => {
        //                 self.setState({
        //                     isLoaded: true,
        //                     error
        //                 });
        //             }
        //         )
        // };

        getPollAnswersById( qid ) {
            // this.setState({ isLoaded: false });
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
                        // console.log( 'result' );
                        // console.log( result );
                        self.setState({
                            // isLoaded: true,
                            answers: result
                        });
                        
                    },
                    ( error ) => {
                        console.log( error );
                        self.setState({
                            // isLoaded: true,
                            error
                        });
                    }
                )
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
                editing
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
                                                    // isLoaded={ isLoaded }
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
                                                    // isLoaded={ isLoaded }
                                                    onSelectChange={ this.handleSelectChange }
                                                    questions={ questions }
                                                    answers={ answers }
                                                    editable={ true }
                                                    editing={ editing }
                                                    onAddQuestionClick={ this.handleAddQuestionClick }
                                                    onAddAnswerClick={ this.handleAddAnswerClick }
                                                    onInputChange={ this.handleInputChange }
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
            </div>
        );
    },
});