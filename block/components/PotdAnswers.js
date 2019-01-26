const {
    Button,
    TextControl
} = wp.components;

export default class PotdAnswer extends React.Component {

    constructor(props) {
        super(props);
        
        this.componentDidMount = this.componentDidMount.bind( this );
        this.getPollAnswersById = this.getPollAnswersById.bind( this );
        // this.componentWillReceiveProps = this.componentWillReceiveProps.bind( this );
        // this.getDerivedStateFromProps = this.getDerivedStateFromProps.bind( this );
        this.refreshAnswers = this.refreshAnswers.bind( this );
        // this.onChangePollQuestions = this.onChangePollQuestions.bind( this );
        // this.selectControlRef = React.createRef();
        // console.log( this.props.value );
        // console.log(this.getFirstPollQid());

        this.state = {
            error: null,
            isLoaded: false,
            answers: [],
            qid: null,
            newQid: null
        };
        this.setFirstPollQid();
    }

    getFirstPollAnswers() {
        var self = this;
        let url = gutenbergtemplateblock_ajax_object.ajax_url + 
                  '?action=gutenbergtemplateblock_getFirstPollAnswers' + 
                  '&security=' + gutenbergtemplateblock_ajax_object.security;

        // console.log( 'componentDidMount' );
        // console.log( this.props.value );

        fetch( url )
            .then(response => {
                return response.json();
            })
            .then(
                (result) => {
                    // console.log( result );
                    self.setState({
                        isLoaded: true,
                        answers: result
                    });
                },
                (error) => {
                    console.log( error );
                    self.setState({
                        isLoaded: true,
                        error
                    });
                }
            )
    }

    setFirstPollQid() {
        var self = this;
        let url = gutenbergtemplateblock_ajax_object.ajax_url + 
                  '?action=gutenbergtemplateblock_getFirstPollQid' + 
                  '&security=' + gutenbergtemplateblock_ajax_object.security;

        // console.log( 'componentDidMount' );
        // console.log( this.props.value );

        fetch( url )
            .then(response => {
                return response.json();
            })
            .then(
                (result) => {
                    // console.log( result[0].qid );
                    self.setState({
                        isLoaded: true,
                        qid: result[0].qid
                    });
                },
                (error) => {
                    console.log( error );
                    self.setState({
                        isLoaded: true,
                        error
                    });
                }
            )
    }

    getPollAnswersById( qid ) {
        var self = this;
        let url = gutenbergtemplateblock_ajax_object.ajax_url + 
                  '?action=gutenbergtemplateblock_getPollAnswersById' + 
                  '&q=' + qid +
                  '&security=' + gutenbergtemplateblock_ajax_object.security;

        // console.log( 'getPollAnswersById' );
        // console.log( this.props.value );

        fetch( url )
            .then(response => {
                return response.json();
            })
            .then(
                (result) => {
                    // console.log( result );
                    self.setState({
                        isLoaded: true,
                        answers: result
                    });
                },
                (error) => {
                    console.log( error );
                    self.setState({
                        isLoaded: true,
                        error
                    });
                }
            )
    }

    // onChangePollQuestions() {
    //     console.log( this );
    // }

    refreshAnswers( newQid ) {
        this.getPollAnswersById( newQid )
        this.setState({
            qid: newQid
        });
    }

    onButtonClick() {
        console.log( 'onButtonClick' );
    }

    onRemoveBtnClick( event ) {
        console.log( 'onRemoveBtnClick' );
        // console.log( e );
        console.log( event.target );
        console.log( event.target.value );
    }

    // componentWillReceiveProps( props ) {
    //     console.log( 'PotdAnswers: componentWillReceiveProps' );
    //     console.log( props );
    //     const { refresh } = props;
    //     if ( refresh && refresh !== this.state.qid ) {
    //         console.log( 'if refresh' );
    //         this.getPollAnswersById( refresh );
    //         this.refreshAnswers( refresh );
    //     }
    // }

    static getDerivedStateFromProps( nextProps, prevState ) {
        console.log( 'getDerivedStateFromProps' );
        // console.log( nextProps.refresh );
        // console.log( prevState.qid );

        if ( nextProps.refresh && nextProps.refresh !== prevState.qid ) {
            // console.log( 'if refresh' );
            // this.getPollAnswersById( nextProps.refresh );
            // this.refreshAnswers( nextProps.refresh );
            // this.setState({
            //     qid: nextProps.refresh
            // });
            return { qid: nextProps.refresh };
        } else return null;
    }

    componentDidUpdate( prevProps, prevState ) {
        console.log( 'componentDidUpdate' );
        // console.log( 'prevProps' );
        // console.log( prevProps );
        // console.log( 'prevState' );
        // console.log( prevState );
        // console.log( 'this.state' );
        console.log( this.state );

        // if ( prevProps.refresh && prevProps.refresh !== prevState.qid ) {
        // if( prevProps.refresh && prevProps.refresh !== this.props.qid ) {
        //     console.log( 'if componentDidUpdate' );
        //     this.setState({
        //         qid: prevProps.refresh
        //     });
        //     this.getPollAnswersById( prevProps.refresh );
        //     this.refreshAnswers( prevProps.refresh );
        // }
        // if ( prevProps.qid !== this.props.someValue ) {
        //     //Perform some operation here
        //     this.setState({
        //         qid: someValue
        //     });
        //     this.classMethod();
        // }
    }

    // static getDerivedStateFromProps(nextProps, prevState){
    //     if(nextProps.someValue!==prevState.someValue){
    //         return { someState: nextProps.someValue};
    //     }
    //     else return null;
    // }
     
    // componentDidUpdate(prevProps, prevState) {
    //     if(prevProps.someValue!==this.props.someValue){
    //         //Perform some operation here
    //         this.setState({someState: someValue});
    //         this.classMethod();
    //     }
    // }

    componentDidMount() {
        // console.log( 'PotdAnswers: componentDidMount' );
        // this.getPollAnswersById( this.state.qid );
        this.getFirstPollAnswers();
    }

    render() {
        // console.log( this.state );
        // self = this;
        const { error, isLoaded, answers } = this.state;
        // console.log(answers);
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
                            />
                            <Button
                                className = "button button-large"
                                onClick = { this.onRemoveBtnClick }
                                value={ object.oid }
                            >
                                Delete
                            </Button>
                        </div>
                    )}
                    <Button
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
                    </Button>
                </div>
            );
        }
    }

}

