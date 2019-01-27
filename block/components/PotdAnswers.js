const {
    Button,
    TextControl
} = wp.components;

export default class PotdAnswer extends React.Component {

    constructor( props ) {
        super( props );
        // this.getPollAnswersById = this.getPollAnswersById.bind( this );
        this.state = {
            error: null,
            isLoaded: false,
            answers: [],
            qid: null
        };
    }

    getFirstPollAnswers() {
        var self = this;
        let url = gutenbergtemplateblock_ajax_object.ajax_url + 
                  '?action=gutenbergtemplateblock_getFirstPollAnswers' + 
                  '&security=' + gutenbergtemplateblock_ajax_object.security;

        fetch( url )
            .then( response => {
                return response.json();
            })
            .then(
                ( result ) => {
                    // console.log( result );
                    self.setState({
                        isLoaded: true,
                        answers: result
                    });
                },
                ( error ) => {
                    console.log( error );
                    self.setState({
                        isLoaded: true,
                        error
                    });
                }
            )
    }

    getPollAnswersById( qid ) {
        this.setState({ isLoaded: false });
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
                    // console.log( result );
                    self.setState({
                        isLoaded: true,
                        answers: result
                    });
                },
                ( error ) => {
                    console.log( error );
                    self.setState({
                        isLoaded: true,
                        error
                    });
                }
            )
    }

    static getDerivedStateFromProps( nextProps, prevState ) {
        if ( nextProps.refresh && nextProps.refresh !== prevState.qid ) {
            return { qid: nextProps.refresh };
        } else return null;
    }

    componentDidUpdate( prevProps, prevState ) {
        if ( prevProps.refresh !== this.props.refresh ) {
            this.getPollAnswersById( this.state.qid );
        }
    }

    componentDidMount() {
        this.getFirstPollAnswers();
    }

    render() {
        const { error, isLoaded, answers } = this.state;
        
        if ( error ) {
            return <div>Error!: { error }</div>
        } else if ( !isLoaded ) {
            return <div>Loading...</div>;
        } else {
            return (
                <div class="grid">
                    { answers.map( ( object, key ) => 
                        <div class="inline-flex">
                            <TextControl
                                key={ key }
                                // label={ 'Pol Answers:' }
                                value={ object.option }
                                disabled
                            />
                            {/* <Button
                                className = "button button-large"
                                onClick = { this.onRemoveBtnClick }
                                value={ object.oid }
                            > 
                                Delete
                            </Button> */}
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
        }
    }

}
