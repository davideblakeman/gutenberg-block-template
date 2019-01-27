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
import PotdAnswers from "./components/PotdAnswers";
import PotdAnswersEdit from "./components/PotdAnswersEdit";
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
            this.props = props;
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
                    refreshT2Qid,
                    selectedIndex,
                    poll,
                    // isLoaded,
                    // error,
                    pollQuestionTitle,
                    // firstPoll,
                    classes,
                    firstPollId
                }, 
                className, 
                setAttributes
            } = props;
            this.onChangeTitle = this.onChangeTitle.bind( this );
            this.onChangeContent = this.onChangeContent.bind( this );
            this.onChangePollQuestion = this.onChangePollQuestion.bind( this );
            this.onChangePollEditQuestion = this.onChangePollEditQuestion.bind( this );
            this.onTabSelect = this.onTabSelect.bind( this );
            this.setPoll = this.setPoll.bind( this );
            this.setError = this.setError.bind( this );
            this.setPollQuestionTitle = this.setPollQuestionTitle.bind( this );
            this.setRefreshQid = this.setRefreshQid.bind( this );
            this.setTefreshT2Qid = this.setRefreshT2Qid.bind( this );

            setAttributes({
                classes: classnames(
                    className,
                    { 'style-toggle': styleToggle }
                )
            });

            this.initPoll();
        }

        componentDidMount() {
            // console.log( 'componentDidMount' );
        }

        initPoll() { 
            var self = this;
            let url = gutenbergtemplateblock_ajax_object.ajax_url + 
                        '?action=gutenbergtemplateblock_getFirstPollQid' + 
                        '&security=' + gutenbergtemplateblock_ajax_object.security;
    
            fetch( url )
                .then(response => {
                    return response.json();
                })
                .then(
                    (result) => {
                        // console.log( result );
                        self.props.setAttributes( { firstPollId: result[0].qid } );
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
        setError( error ) { this.props.setAttributes( { error } ) }
        setPollQuestionTitle( pollQuestionTitle ) { this.props.setAttributes( { pollQuestionTitle } ) }
        setRefreshQid( refreshQid ) { this.props.setAttributes( { refreshQid } ) }
        setselectedIndex( selectedIndex ) { this.props.setAttributes( { selectedIndex } ) }
        setRefreshT2Qid( refreshT2Qid ) { this.props.setAttributes( { refreshT2Qid } ) }

        onChangePollQuestion( selectedPoll ) {
            let index = selectedPoll.target.selectedIndex;
            let qid = selectedPoll.target.options[ index ].value;
            this.setRefreshQid( qid );
            // this.setSelectedIndex( index );
            this.getPollById( qid );
        };

        onChangePollEditQuestion( selectedPoll ) {
            let index = selectedPoll.target.selectedIndex;
            let qid = selectedPoll.target.options[ index ].value;
            this.setRefreshT2Qid( qid );
            // this.setSelectedIndex( index );
            // this.getPollById( qid );
        }

        onButtonClick() {
            console.log( 'onButtonClick!' );
            console.log( props );
        };

        onTabSelect( tab ) {
            console.log( 'onTabSelect' );
            console.log( tab );
            console.log( this.props );
            if ( tab === 'tab1' ) {
                // this.setSelectedIndex( index );
                console.log( 'this is ' + tab );
            } else if ( tab === 'tab2' ) {
                console.log( 'this is ' + tab );
            } else if ( tab === 'tab3' ) {
                console.log( 'this is ' + tab );
            }
            // this.setSelectedIndex( this.props.attributes.selectedIndex );
        };

        // Helpers \\
        getPollById( qid ) {
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
                        // console.log( result );
                        const pollOptions = result.map( ( object, key ) => {
                            return [
                                <p><input type="radio" name="options" value={ object.oid }/>{ object.option }</p>
                            ];
                        });
                        self.setPoll( pollOptions );
                        self.setPollQuestionTitle( result[0].question );
                    },
                    ( err ) => {
                        setError( err );
                    }
                )
        };

        render() {
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
                                            <div className={ className } onChange={ this.onChangePollQuestion }>
                                                <PotdSelect
                                                    refresh={ this.props.attributes.selectedIndex }
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
                                            <div className={ className } onChange={ this.onChangePollEditQuestion }>
                                            {/* <div className={ className } onChange={ this.onChangePollQuestion }> */}
                                                <PotdSelect
                                                    refresh={ this.props.attributes.selectedIndex }
                                                />
                                            </div>
                                            <div className={ className }>
                                                <PotdAnswersEdit
                                                    refresh={ this.props.attributes.refreshT2Qid }
                                                />
                                            </div>
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
                    {/* <Button
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
                    </Button> */}
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