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
// import React from 'react';
import PotdSelect from "./components/PotdSelect";
import PotdAnswers from "./components/PotdAnswers";
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
    ColorPalette,
    // RadioControl
} = wp.editor;
const { 
    Button,
    // TabbableContainer,
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
        __( 'Test', 'gutenbergtemplateblock' ),
        __( 'Template', 'gutenbergtemplateblock' )
    ],
    attributes,
    getEditWrapperProps( { blockAlignment } ) {
        if ( 'left' === blockAlignment || 'right' === blockAlignment || 'full' === blockAlignment )
        {
            return { 'data-align': blockAlignment };
        }
    },
    // edit: props => {
    edit: class extends Component {
        constructor( props ) {
            console.log( 'constructor' );
            super( ...arguments );
            this.props = props;
            // console.log( this.props === props );
            // console.log( props );
            const {
                attributes: { 
                    // textAlignment, 
                    title,
                    content,
                    styleToggle,
                    // titleColour,
                    // contentColour,
                    // radioControl,
                    // pollQuestionId,
                    refreshQid,
                    poll,
                    // isLoaded,
                    // error,
                    pollQuestionTitle,
                    // firstPoll,
                    classes
                }, 
                className, 
                setAttributes
            } = props;
            // console.log( arguments );
            this.onChangeTitle = this.onChangeTitle.bind( this );
            this.onChangeContent = this.onChangeContent.bind( this );
            this.onChangePollQuestions = this.onChangePollQuestions.bind( this );
            this.setPoll = this.setPoll.bind( this );
            this.setError = this.setError.bind( this );
            this.setPollQuestionTitle = this.setPollQuestionTitle.bind( this );
            this.setRefreshQid = this.setRefreshQid.bind( this );

            setAttributes( { classes: classnames(
                className,
                { 'style-toggle': styleToggle }
            )});

            // let firstPollId = this.getFirstPollId();
            // console.log( 'firstPollId' );
            // console.log( firstPollId );
            // this.getPollById( firstPollId );
            // console.log( props );

            this.initPoll();
        }

        componentDidMount() {
            console.log( 'componentDidMount' );
        }
        // const onInit = () => {
        //     let firstPollId = getFirstPollId();
        //     getPollById( firstPollId );
        // }

        initPoll() { 
            var self = this;
            let url = gutenbergtemplateblock_ajax_object.ajax_url + 
                        '?action=gutenbergtemplateblock_getFirstPollQid' + 
                        '&security=' + gutenbergtemplateblock_ajax_object.security;
    
            // console.log( 'componentDidMount' );
            // console.log( this.props.value );
            // console.log( this );
            // console.log( props );
    
            fetch( url )
                .then(response => {
                    return response.json();
                })
                .then(
                    (result) => {
                        self.props.setAttributes( { firstPollId: result } );
                        this.getPollById( result[0].qid );
                    },
                    (err) => {
                        console.log( error );
                        self.props.setAttributes( { error: err } );
                    }
                )
        }
        
        // Events \\
        onChangeTitle( title ) { this.props.setAttributes( { title } ) }
        onChangeContent( content ) { this.props.setAttributes( { content } ) }
        setPoll( poll ) { this.props.setAttributes( { poll } ) }
        // const setIsLoaded = isLoaded => { setAttributes( { isLoaded } ) };
        setError( error ) { this.props.setAttributes( { error } ) }
        setPollQuestionTitle( pollQuestionTitle ) { this.props.setAttributes( { pollQuestionTitle } ) }
        setRefreshQid( refreshQid ) { this.props.setAttributes( { refreshQid } ) }
        
        // const onChangePollQuestions = questions => { setAttributes( { questions } ); console.log( 'onChangePollQuestions' ); console.log( questions ); };

        onChangePollQuestions( selectedPoll ) {
            // console.log( 'onChangePollQuestions!' );
            // console.log( this );
            // console.log( this.props.attributes.refreshQid );
            // console.log( selectedPoll.target );
            // console.log( selectedPoll.target.options[selectedPoll.target.selectedIndex].value );
            let index = selectedPoll.target.selectedIndex;
            let qid = selectedPoll.target.options[ index ].value;
            // this.props.setAttributes({
            //     // pollOptionsHidden: true,
            //     // pollQuestionId: id
            //     refreshQid: id
            // });
            // console.log( qid );
            this.setRefreshQid( qid );
            // console.log( { refreshQid } );
            // console.log( this.props.attributes );
            this.getPollById( qid );
        };

        // const onInit = initialised => { setAttributes( { initialised } ) };
        // const onChangePollAnswers = () => {
        //     console.log( 'onChangePollAnswers?!' );
        // };
        onButtonClick() {
            console.log( 'onButtonClick!' );
            console.log( props );
            // let test = 'testing';
            
            // var data = {
            //     action: 'gutenbergtemplateblock_get',
            //     security: gutenbergtemplateblock_ajax_object.security//,
            //     //t: test
            // };
            
            // $.post( gutenbergtemplateblock_ajax_object.ajax_url, data, function( output )
            // {
            //     var output = $.parseJSON( output );
            //     onChangeContent( output );
            //     $( '#GTBContentText' ).find( 'p' ).html( output );
            //     $( '#GTBContentText' ).find( '.editor-rich-text__tinymce:eq(2)' ).find( 'p' ).html( '' );
            // });
        };
        onTabSelect() {
            console.log( 'onTabSelect' );
        };

        getPollById( qid ) {
            // console.log( 'getPollById' );
            // console.log( qid );
            // console.log( refreshQid )
            var self = this;
            let url = gutenbergtemplateblock_ajax_object.ajax_url +
                        '?action=gutenbergtemplateblock_getPollById' +
                        '&qid=' + qid +
                        '&security=' + gutenbergtemplateblock_ajax_object.security;
    
            fetch( url )
                .then( response => {
                    return response.json();
                })
                .then(
                    ( result ) => {
                        // console.log('getPollById result:');
                        // console.log( result );
                        // console.log(result[0].question);

                        const pollOptions = result.map( ( object, key ) => {
                            return [
                                <p><input type="radio" name="options" value={ object.oid }/>{ object.option }</p>
                            ];
                        });
                        // console.log( pollOptions );
                        // setIsLoaded( true );
                        // console.log( self );
                        self.setPoll( pollOptions );
                        // setPoll( result[0].option );
                        // console.log( 'self.setPoll' );
                        self.setPollQuestionTitle( result[0].question );
                        // console.log( 'self.props' );
                        // console.log( self.props );
                    },
                    ( err ) => {
                        // setIsLoaded( true );
                        setError( err );
                    }
                )
        };

        // console.log( 'props' );
        // console.log(props);
        render() {
            // console.log( 'render start' );
            // console.log( this.props );
            const { 
                className, 
                setAttributes,
                attributes: { 
                    // colourAttributes,
                    classes,
                    titleColour,
                    contentColour,
                    textAlignment,
                    title,
                    content
                }} = this.props;

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
                    {/* <RadioControl
                        label = { __( 'Radio Control', 'gutenbergtemplateblock' ) }
                        selected = { radioControl }
                        options = {[
                            { label: 'Author', value: 'a' },
                            { label: 'Editor', value: 'e' },
                        ]}
                        onChange = { radioControl => setAttributes( { radioControl } ) }
                    /> */}
                    <TabPanel
                        className="my-tab-panel"
                        activeClass="active-tab"
                        onSelect={ this.onTabSelect }
                        tabs={[
                            {
                                name: 'tab1',
                                title: 'Tab 1',
                                className: 'tab-one'
                            },
                            {
                                name: 'tab2',
                                title: 'Tab 2',
                                className: 'tab-two'
                            },
                            {
                                name: 'tab3',
                                title: 'Tab 3',
                                className: 'tab-three'
                            }
                        ]}
                    >
                        {
                            ( tab ) => {
                                if ( tab.name === 'tab1' ) {
                                    return [
                                        <div className = { classes }>
                                            <div className={ className } onChange={ this.onChangePollQuestions }>
                                                <PotdSelect
                                                    // onChange={ onChangePollQuestions }
                                                    // onChange={ ( selectedPoll ) => { console.log( selectedPoll ); } }
                                                    // onChange={onChangePollQuestions.bind(this)}
                                                />
                                            </div>
                                            <div className={ className }>
                                                <PotdAnswers
                                                    // value={ pollQuestionId }
                                                    refresh={ this.props.attributes.refreshQid }
                                                />
                                            </div>
                                        </div>
                                    ];
                                } else if ( tab.name === 'tab2' ) {
                                    return [
                                        <div className={ className }>
                                            <p>{ tab.name }</p>
                                            <p>tab2?</p>
                                        </div>
                                    ];
                                } else if ( tab.name === 'tab3' ) {
                                    return [
                                        <div className={ className }>
                                            <p>{ tab.name }</p>
                                            <p>tab3?</p>
                                        </div>
                                    ];
                                }
                                return[];
                            }
                        }
                    </TabPanel>
                    {/* </div> */}
                    {/* <SelectControl
                        label="Test Select"
                        value="test value"
                        options={[
                            {key: '1', value: 'a', label: 'PotdSelect A'},
                            {key: '2', value: 'b', label: 'PotdSelect B'},
                            {key: '3', value: 'c', label: 'PotdSelect C'}
                        ]}
                        onChange={() => {console.log( 'onChange' );}}
                    /> */}
                    <Button
                        isDefault
                        className = "button button-large"
                        onClick = { this.onButtonClick }
                    >
                        Add Poll
                    </Button>
                    <Button
                        isDefault
                        className = "button button-large"
                        onClick = { this.onButtonClick }
                    >
                        Delete Poll
                    </Button>
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
                // radioControl,
                // refreshQid,
                // isLoaded,
                // error,
                poll,
                pollQuestionTitle
            }
        } = props;
        // var poll = null;
        // var isLoaded = false;
        // var error = null;
        // console.log(refreshQid);
        const className = classnames(
            'wp-block-gutenbergtemplateblock-templateblock',
            { 'style-toggle': styleToggle },
        );
        
        // if ( error ) {
        //     return <div>Error!</div>
        // } else if ( !isLoaded ) {
        //     return <div>Loading...</div>;
        // } else {
        // console.log( poll[0].question );
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
                {/* <h4>{ poll[0].question }</h4>
                { poll.map( ( object, key ) => {
                    <p>{ object.option }</p>
                })} */}
                <h4>{ pollQuestionTitle }</h4>
                <form>
                    { poll }
                    <button class="potd-vote-btn" type="button">Btn</button>
                </form>
                <div class="potd-result"></div>
            </div>
        );
    },
});