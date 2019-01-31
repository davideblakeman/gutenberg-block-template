const {
    Button,
    TextControl
} = wp.components;

export default class PotdAnswer extends React.Component {

    constructor( props ) {
        super( props );
        // this.getPollAnswersById = this.getPollAnswersById.bind( this );
        this.handleChange = this.handleChange.bind( this );

        this.handlers = {};
    }

    componentDidMount() {
        // this.getFirstPollAnswers();
    }

    /** https://medium.freecodecamp.org/the-best-way-to-bind-event-handlers-in-react-282db2cf1530
     * If you must generate bindings dynamically, consider caching 
     * the handlers if the bindings become a performance issue
     */
    handleChange( name ) {
        if ( !this.handlers[ name ] ) {
            this.handlers[ name ] = event => {
                // this.setState({ [name]: event.target.value });
                this.props.onInputChange( event, [ name ] );
            };
        }
        return this.handlers[ name ];  
    }

    // handleChange( object, key ) {
    //     console.log( object );
    //     console.log( key );
    // }

    render() {
        // const { error, isLoaded, answers } = this.state;
        const { answers, editable } = this.props;
        
        // if ( error ) {
        //     return <div>Error!: { error }</div>
        // } else if ( !isLoaded ) {
        //     return <div>Loading...</div>;
        // } else {
            return (
                <div class="grid">
                    { answers.map( ( object, key ) => 
                        <div class="inline-flex">
                            { editable ? 
                                <TextControl
                                    key={ key }
                                    value={ object.option }
                                    // onChange={ this.handleChange }
                                    onChange={ this.handleChange( key ) }
                                />
                                :
                                <TextControl
                                    key={ key }
                                    // label={ 'Pol Answers:' }
                                    value={ object.option }
                                    disabled
                                />
                            }
                            { editable &&
                                <Button
                                    className = "gutenbergtemplateblock-delete-answer button button-large"
                                    onClick = { this.onRemoveBtnClick }
                                    value={ object.oid }
                                > 
                                    Delete
                                </Button>
                            }
                        </div>
                    )}
                    {/* <Button
                        className = "button button-large"
                        onClick = { this.onButtonClick }
                    >
                        Save Answers
                    </Button>
                    <Button
                        isDefault
                        className = "button button-large"
                        onClick = { this.onButtonClick }
                    >
                        Add New Answer
                    </Button> */}
                </div>
            );
        // }
    }

}
