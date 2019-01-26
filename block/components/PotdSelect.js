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
            questions: []
        };
    }

    componentDidMount() {
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

    // componentDidUpdate() {
    //     // console.log( this );
    // }

    render() {
        const { error, isLoaded, questions } = this.state;
        if ( error ) {
            return <div>Error!</div>
        } else if ( !isLoaded ) {
            return <div>Loading...</div>;
        } else {
            return (
                <SelectControl
                    label={ 'Select a question:' }
                    options={ questions }
                />
            );
        }
    }

}
