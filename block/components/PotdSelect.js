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
            // selectedIndex: undefined,
            // currentQid: null
            refresh: false
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
        
        if ( nextProps.refresh && nextProps.refresh !== prevState.refresh ) {
            // console.log( 'getDerivedStateFromProps' );
            return { refresh: nextProps.refresh };
        } else return null;
    }

    componentDidUpdate( prevProps, prevState ) {
        console.log( 'componentDidUpdate' );
        if( prevProps.refresh !== this.props.refresh ) {
            // console.log( 'componentDidUpdate' );
            // this.setState({
            //     refresh: false
            // });
            this.getPollQuestions();
        }

        // if ( prevProps.currentQid !== this.props.currentQid ) {
        //     this.setState({
        //         currentQid: this.props.currentQid
        //     });
        //     this.getPollQuestions();
        // }
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
            // return (
            //     () => { 
            //         if ( selectedIndex ) {
            //             return ( 
            //                 <SelectControl
            //                     label={ 'Select a question:' }
            //                     options={ questions }
            //                     value={ selectedIndex }
            //                 />
            //             );
            //         } else {
            //             return (
            //                 <SelectControl
            //                     label={ 'Select a question:' }
            //                     options={ questions }
            //                 />
            //             );
            //         }
            //     }
            // );
            return (
                <SelectControl
                    label={ 'Select a question:' }
                    options={ questions }
                />
            );
        }
    }

}
