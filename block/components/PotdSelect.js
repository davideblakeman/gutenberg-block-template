import PotdAnswers from "./PotdAnswers";
const {
    SelectControl,
    Button,
    TextControl
} = wp.components;

export default class PotdSelect extends React.Component {

    constructor( props ) {
        super( props );
        this.componentDidMount = this.componentDidMount.bind( this );
        this.handleChange = this.handleChange.bind( this );
        this.handleInputChange = this.handleInputChange.bind( this );
        this.handleAddQuestionClick = this.handleAddQuestionClick.bind( this );
        this.handleAddAnswerClick = this.handleAddAnswerClick.bind( this );

        this.state = {
            selectedValue: null
        }
    }

    componentDidMount() {
        // this.getPollQuestions();
    }

    handleChange( event ) {
        this.setState({
            selectedValue: event
        });
        this.props.onSelectChange( event );
    }

    handleInputChange( event, name ) {
        // console.log( event );
        this.props.onInputChange( event, name );
    }

    handleAddQuestionClick( event ) {
        this.props.onAddQuestionClick( event );
    }

    handleAddAnswerClick( event ) {
        this.props.onAddAnswerClick( event );
    }

    render() {
        const { questions, answers, editable, editing } = this.props;
        const { selectedValue } = this.state;
        // if ( error ) {
        //     return <div>Error!</div>
        // } else if ( !isLoaded ) {
        //     return <div>Loading...</div>;
        // } else {
        let selectedKey = null;
        for ( let i = 0; i < questions.length; i++ ) {
            if ( parseInt( questions[i].value ) == selectedValue ) {
                selectedKey = i;
            }
        }

        return (
            <div>
                { editable &&
                    <Button
                        className = "gutenbergtemplateblock-add-question button button-large"
                        onClick = { this.handleAddQuestionClick }
                        // value={ selectedValue === null ? questions[0].value : questions[ selectedKey ].value }
                    > 
                        New Question
                    </Button>
                }
                { !editing &&
                    <SelectControl
                        label={ 'Select a question:' }
                        options={ questions }
                        onChange={ this.handleChange }
                    />
                }
                { editable &&
                    <div class="grid">
                        <div class="inline-flex">
                            <TextControl
                                value={ selectedValue === null ? questions[0].label : questions[ selectedKey ].label }
                            />
                            { !editing &&
                                <Button
                                    className = "gutenbergtemplateblock-delete-question button button-large"
                                    // onClick = { this.onRemoveBtnClick }
                                    value={ selectedValue === null ? questions[0].value : questions[ selectedKey ].value }
                                > 
                                    Delete
                                </Button>
                            }
                        </div>
                    </div>
                }
                <PotdAnswers
                    answers={ answers }
                    editable={ editable }
                    onInputChange={ this.handleInputChange }
                />
                { editable &&
                    <div>
                        <Button
                            className = "gutenbergtemplateblock-add-question button button-large"
                            onClick = { this.handleAddAnswerClick }
                        > 
                            Add Answer
                        </Button>
                        <Button
                            className = "gutenbergtemplateblock-save-poll button button-large"
                            onClick = { this.handleSavePollClick }
                        > 
                            Save
                        </Button>
                    </div>
                }
            </div>
        );
        // }
    }

}
