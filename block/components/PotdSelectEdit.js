const {
    SelectControl
} = wp.components;

export default class PotdSelect extends React.Component {

    constructor( props ) {
        super( props );
        this.componentDidMount = this.componentDidMount.bind( this );
        this.state = {
            error: null,
            isLoaded: false,
            questions: [],
            tabRefresh: false
        };
    }

    componentDidMount() {
        this.getPollQuestions();
    }

    static getDerivedStateFromProps( nextProps, prevState ) {
        if ( nextProps.tabRefresh && nextProps.tabRefresh !== prevState.tabRefresh ) {
            return { tabRefresh: nextProps.tabRefresh };
        } else return null;
    }

    componentDidUpdate( prevProps, prevState ) {
        if ( prevProps.tabRefresh !== this.props.tabRefresh ) {
            this.getPollQuestions();
        }
    }

    getPollQuestions() {
        this.setState({ isLoaded: false });
        var self = this;
        let url = gutenbergtemplateblock_ajax_object.ajax_url + 
                  '?action=gutenbergtemplateblock_getPollQuestions&security=' + 
                  gutenbergtemplateblock_ajax_object.security;

        fetch( url )
            .then( response => {
                return response.json();
            })
            .then(
                ( result ) => {
                    self.setState({
                        isLoaded: true,
                        questions: result
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

    render() {
        const { error, isLoaded, questions } = this.state;
        if ( error ) {
            return <div>Error!</div>
        } else if ( !isLoaded ) {
            return <div>Loading...</div>;
        } else {
            return (
                <div>
                    <SelectControl
                        label={ 'Select a question:' }
                        options={ questions }
                    />
                    {/* <div class="inline-flex">
                        <TextControl
                            key={ key }
                            // label={ 'Pol Answers:' }
                            value={ object.option }
                        />
                        <Button
                            className = "button button-large"
                            onClick = { this.onRemoveBtnClick }
                            value={ object.oid }
                        >
                            Delete
                        </Button>
                    </div> */}
                </div>
            );
        }
    }

}
