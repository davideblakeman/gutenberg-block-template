const {
    Button,
    TextControl
} = wp.components;

export default class PotdAnswer extends React.Component {

    constructor( props ) {
        super( props );
        this.handleChange = this.handleChange.bind( this );
        this.handleDeleteAnswerClick = this.handleDeleteAnswerClick.bind( this );
        this.handlers = {};
    }

    // componentDidMount() {
    //     // console.log( 'componentDidMount' );
    // }

    /** https://medium.freecodecamp.org/the-best-way-to-bind-event-handlers-in-react-282db2cf1530
     * If you must generate bindings dynamically, consider caching 
     * the handlers if the bindings become a performance issue
     */
    handleChange( name ) {
        if ( !this.handlers[ name ] ) {
            this.handlers[ name ] = event => {
                this.props.onInputChange( event, [ name ] );
            };
        }
        return this.handlers[ name ];  
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

    render() {
        const { answers, editable, isLoadedAnswers } = this.props;

        return [
            <div>
            { isLoadedAnswers ? 
                <div class="grid">
                    { answers.map( ( object, key ) => 
                        <div class="inline-flex">
                            { editable ? 
                                <TextControl
                                    name={ key }
                                    value={ object.option }
                                    onChange={ this.handleChange( key ) }
                                />
                                :
                                <TextControl
                                    key={ key }
                                    value={ object.option }
                                    disabled
                                />
                            }
                            { editable &&
                                <Button
                                    className = "gutenbergtemplateblock-delete-answer button button-large"
                                    onClick = { this.handleDeleteAnswerClick }
                                    value={ object.oid }
                                > 
                                    Delete
                                </Button>
                            }
                        </div>
                    )}
                </div>
                :
                <div>Loading...</div>
            }
            </div>
        ];
    }

}
