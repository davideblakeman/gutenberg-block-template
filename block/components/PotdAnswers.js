import icons from './../icons';
const {
    Button,
    TextControl,
    Spinner
} = wp.components;

export default class PotdAnswer extends React.Component {

    constructor( props ) {
        super( props );
        this.handleChange = this.handleChange.bind( this );
        this.handleDeleteAnswerClick = this.handleDeleteAnswerClick.bind( this );
        this.handlePlusMinusClick = this.handlePlusMinusClick.bind( this );
        this.handlePositionChange = this.handlePositionChange.bind( this );
        this.inputHandlers = {};
        this.positionHandlers = {};
    }

    // componentDidMount() {
    //     // console.log( 'componentDidMount' );
    // }

    /** https://medium.freecodecamp.org/the-best-way-to-bind-event-handlers-in-react-282db2cf1530
     * If you must generate bindings dynamically, consider caching 
     * the handlers if the bindings become a performance issue
     */
    handleChange( name ) {
        if ( !this.inputHandlers[ name ] ) {
            this.inputHandlers[ name ] = event => {
                this.props.onInputChange( event, [ name ] );
            };
        }
        return this.inputHandlers[ name ];  
    }

    handlePositionChange( name ) {
        if ( !this.positionHandlers[ name ] ) {
            this.positionHandlers[ name ] = event => {
                // this.props.onPositionChange( event, [ name ] );
                this.handlePlusMinusClick( event, [ name ] );
            };
        }
        return this.positionHandlers[ name ];  
    }

    handleDeleteAnswerClick( event ) {
        let index = this.getAnswerKey( event.target.value );
        let oid = event.target.value;
        this.props.onDeleteAnswerClick( index, oid );
    }

    getAnswerKey( oid ) {
        for ( let i = 0; i < this.props.answers.length; i++ ) {
            if ( this.props.answers[i].oid.trim() == oid.trim() ) {
                return i;
            }
        } return 0;
    }

    handlePlusMinusClick( event, name ) {
        // console.log( 'handlePlusMinusClick:', event, name );
        const childNodes = event.target.parentNode.parentNode.parentNode.childNodes;
        const parent = event.target.parentNode.parentNode.parentNode;
        let node = event.target.parentNode.parentNode;
        const sign = event.target.attributes.value.nodeValue;
        let position = null;
        // let newPosition = null;
        let positions = [];

        for ( let [ k, v ] of Object.entries( childNodes ) ) {
            if ( v === node ) {
                position = parseInt( k );
            }
        }

        if ( !isNaN( parseFloat( position ) ) && isFinite( position ) ) {
            if ( sign === 'up' ) {
                parent.insertBefore( parent.children[ position ], parent.children[ position ].previousSibling );
            } else {
                if ( parent.lastChild === parent.children[ position ] ) {
                    parent.insertBefore( parent.children[ position ], parent.firstChild );
                } else {
                    parent.insertBefore( parent.children[ position ], parent.children[ position ].nextSibling.nextSibling );
                }
            }
        }

        // for ( let [ k, v ] of Object.entries( childNodes ) ) {
        //     if ( v === node ) {
        //         newPosition = parseInt( k );
        //     }
        // }
        console.log( 'childNodes', childNodes );

        for ( let [ k, v ] of Object.entries( childNodes ) ) {
            // newPosition = parseInt( k );
            // console.log( 'k', k );
            // console.log( 'v', v.childNodes[0].attributes.value.nodeValue 
            // console.log( 'value', v.querySelector( 'input' ).attributes.value.nodeValue );
            // console.log( 'name', v.querySelector( 'input' ).attributes.name.nodeValue );

            let newPosition = parseInt( k );
            // let value = v.querySelector( 'input' ).attributes.value.nodeValue;
            let name = parseInt( v.querySelector( 'input' ).attributes.name.nodeValue );
            // positions.push( { name: newPosition } );
            positions[ name ] = newPosition;

            // this.props.onPositionChange( name, newPosition );
        }

        console.log( 'positions', positions );
        this.props.onPositionChange( positions );
        // this.props.onPositionChange( name, newPosition );
    }

    render() {
        const { answers, editable, isLoadedAnswers } = this.props;

        return [
            <div className="potd-answers">
            { isLoadedAnswers ? 
                <div class="grid">
                    { answers.map( ( object, key ) => 
                        <div class="inline-flex">
                            { editable ? 
                                <div className="edit-input">
                                    <TextControl
                                        name={ key }
                                        value={ object.option }
                                        onChange={ this.handleChange( key ) }
                                    />
                                </div>
                                :
                                <TextControl
                                    key={ key }
                                    value={ object.option }
                                    disabled
                                />
                            }
                            { editable &&
                                <div className="edit-btn-container">
                                    <Button
                                        className="gutenbergtemplateblock-templateblock-plusmins-btn button button-large"
                                        value="up"
                                        onClick={ this.handlePositionChange( key ) }
                                    >
                                        &#9650;
                                    </Button>
                                    <Button 
                                        className="gutenbergtemplateblock-templateblock-plusmins-btn button button-large"
                                        value="down"
                                        onClick={ this.handlePositionChange( key ) }
                                    >
                                        &#9660;
                                    </Button>
                                </div>
                            }
                            { editable &&
                                <Button
                                    className="button button-large edit-delete-button"
                                    onClick={ this.handleDeleteAnswerClick }
                                    value={ object.oid }
                                > 
                                    { icons.delete }
                                </Button>
                            }
                        </div>
                    )}
                </div>
                :
                <div>
                    <Spinner/>
                    <div>Loading...</div>
                </div>
            }
            </div>
        ];
    }

}
