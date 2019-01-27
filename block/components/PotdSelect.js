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
            selectedIndex: '1'
        };
    }

    componentDidMount() {
        this.getPollQuestions();
    }

    static getDerivedStateFromProps( nextProps, prevState ) {
        // console.log( 'getDerivedStateFromProps' );
        // console.log( 'nextProps' );
        // console.log( nextProps );
        // console.log( 'prevState' );
        // console.log( prevState );
        
        if ( nextProps.refresh && nextProps.refresh !== prevState.selectedIndex ) {
            return { selectedIndex: nextProps.refresh };
        } else return null;
    }

    componentDidUpdate( prevProps, prevState ) {
        if( prevProps.refresh !== this.props.refresh ) {
            // console.log( 'componentDidUpdate' );
            // this.setState(
            //     selectedQid: 
            // );
            // this.getPollQuestions();
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
        const { error, isLoaded, questions, selectedIndex } = this.state;
        if ( error ) {
            return <div>Error!</div>
        } else if ( !isLoaded ) {
            return <div>Loading...</div>;
        } else {
            return (
                <SelectControl
                    label={ 'Select a question:' }
                    options={ questions }
                    // value={ selectedIndex }
                />
            );
        }
    }

}
