const {
    Button,
    TextControl
} = wp.components;

export default class PotdAnswer extends React.Component {

    constructor( props ) {
        super( props );
        // this.getPollAnswersById = this.getPollAnswersById.bind( this );
    }

    componentDidMount() {
        // this.getFirstPollAnswers();
    }

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
