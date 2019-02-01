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
        this.handleSelectInputChange = this.handleSelectInputChange.bind( this );
        this.handleAddQuestionClick = this.handleAddQuestionClick.bind( this );
        this.handleAddAnswerClick = this.handleAddAnswerClick.bind( this );
        this.getSelectedKey = this.getSelectedKey.bind( this );

        this.state = {
            selectedValue: null,
            selectedKey: null
        };
    }

    componentDidMount() {
        // console.log( 'componentDidMount' );
        // Always needs at least one question returned from the database
        this.setState({
            selectedValue: this.props.questions[0].value
        }, () => this.setState({
            selectedKey: this.getSelectedKey() 
        }));
    }

    handleChange( event ) {
        this.setState({
            selectedValue: event
        }, () => {
            this.setState({
                selectedKey: this.getSelectedKey() 
            });
            this.props.onSelectChange( event );
        });
    }

    handleSelectInputChange( event ) {
        console.log( 'handleSelectInputChange' );
        console.log( event );
        this.props.onSelectInputChange( event, this.state.selectedKey );
    }

    handleInputChange( event, name ) { this.props.onInputChange( event, name ) }
    handleAddQuestionClick( event ) { this.props.onAddQuestionClick( event ) }
    handleAddAnswerClick( event ) { this.props.onAddAnswerClick( event ) }

    getSelectedKey() {
        for ( let i = 0; i < this.props.questions.length; i++ ) {
            if ( parseInt( this.props.questions[i].value ) == this.state.selectedValue ) {
                return i;
            }
        } return 0;
    };

    render() {
        const { questions, answers, editable, editing } = this.props;
        const { selectedValue } = this.state;
        const selectedKey = this.getSelectedKey();
        const editTitleText = questions[ selectedKey ].label;

        return (
            <div>
                { editable &&
                    <Button
                        className = "gutenbergtemplateblock-add-question button button-large"
                        onClick = { this.handleAddQuestionClick }
                    > 
                        New Question
                    </Button>
                }
                { !editing &&
                    <SelectControl
                        label={ 'Select a question:' }
                        options={ questions }
                        onChange={ this.handleChange }
                        value={ selectedKey }
                    />
                }
                { editable &&
                    <div class="grid">
                        <div class="inline-flex">
                            <TextControl
                                name={ selectedKey }
                                // value={ selectedValue === null ? questions[0].label : questions[ selectedKey ].label }
                                value={ editTitleText }
                                onChange={ this.handleSelectInputChange }
                            />
                            { !editing &&
                                <Button
                                    className="gutenbergtemplateblock-delete-question button button-large"
                                    // onClick = { this.onRemoveBtnClick }
                                    value={ selectedValue }
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
    }

}
