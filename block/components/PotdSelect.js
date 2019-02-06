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
        this.handleDeleteQuestionClick = this.handleDeleteQuestionClick.bind( this );
        this.handleDeleteAnswerClick = this.handleDeleteAnswerClick.bind( this );
        this.handleCancelClick = this.handleCancelClick.bind( this );
        this.handleSaveClick = this.handleSaveClick.bind( this )
        this.getSelectedKey = this.getSelectedKey.bind( this );

        this.state = {
            selectedValue: null,
            selectedKey: null,
            lastSelectableKey: null
        };
    }

    componentDidMount() {
        let lastIndex = this.props.questions.length - 1;
        this.setState({
            selectedValue: this.props.questions[0].value
        }, () => this.setState({
            selectedKey: this.getSelectedKey(),
            lastSelectableKey : lastIndex
        }));
    }

    handleChange( event ) {
        this.setState({
            selectedValue: event,
            lastSelectableKey: null
        }, () => {
            this.setState({
                selectedKey: this.getSelectedKey() 
            });
            this.props.onSelectChange( event, this.props.editable );
        });
    }

    handleDeleteQuestionClick( event ) {
        let qid = event.target.value;
        this.props.onDeleteQuestionClick( this.getSelectedKey(), qid );
    }

    handleDeleteAnswerClick( index, oid ) {
        this.props.onDeleteAnswerClick( index, oid );
    }

    handleSelectInputChange( event ) {
        let index = this.props.inNewQuestion ? 0 : this.state.selectedKey;
        this.props.onSelectInputChange( event, index );
    }

    handleCancelClick() { this.props.onCancelClick() }
    handleSaveClick( event ) { this.props.onSaveClick( event.target.value ) }
    handleInputChange( event, name ) { this.props.onInputChange( event, name ) }
    handleAddQuestionClick( event ) { this.props.onAddQuestionClick( event ) }
    handleAddAnswerClick( event ) { this.props.onAddAnswerClick( event.target.value ) }

    getSelectedKey() {
        for ( let i = 0; i < this.props.questions.length; i++ ) {
            if ( parseInt( this.props.questions[i].value ) == this.state.selectedValue ) {
                return i;
            }
        } return 0;
    };

    render() {
        const {
            questions,
            answers,
            editable,
            editing,
            inNewQuestion,
            isLoadedAnswers
        } = this.props;
        const { selectedValue } = this.state;
        const selectedKey = this.getSelectedKey();
        const editTitleText = questions[ selectedKey ].label;

        return (
            <div>
                { editable &&
                    <div>
                        <Button
                            className = "gutenbergtemplateblock-add-question button button-large"
                            onClick = { this.handleAddQuestionClick }
                        > 
                            New Question
                        </Button>
                        { editing && 
                            <Button
                                className = "gutenbergtemplateblock-cancel button button-large"
                                onClick = { this.handleCancelClick }
                            >
                                Select Poll
                            </Button>
                        }
                    </div>
                }
                { ( !editable || !editing ) &&
                    <SelectControl
                        label={ editable ? 'Select a poll to edit:' : 'Select a poll:' }
                        options={
                            editable ? [
                                ...questions,
                                {
                                    'value': 'last',
                                    'label': ''
                                }
                            ] : questions
                        }
                        onChange={ this.handleChange }
                        value={ editable ? 'last' : null }
                    />
                }
                { ( editable && editing ) &&
                    <div class="grid">
                        <div class="inline-flex">
                            <TextControl
                                name={ selectedKey }
                                value={ editTitleText }
                                onChange={ this.handleSelectInputChange }
                            />
                            { ( !inNewQuestion && editing ) &&
                                <Button
                                    className="gutenbergtemplateblock-delete-question button button-large"
                                    value={ selectedValue }
                                    onClick={ this.handleDeleteQuestionClick }
                                > 
                                    Delete
                                </Button>
                            }
                        </div>
                    </div>
                }
                { ( !editable || editing ) &&
                    <PotdAnswers
                        answers={ answers }
                        editable={ editable }
                        onInputChange={ this.handleInputChange }
                        onDeleteAnswerClick={ this.handleDeleteAnswerClick }
                        isLoadedAnswers={ isLoadedAnswers }
                    />
                }
                { ( editable && editing ) &&
                    <div>
                        <Button
                            className="gutenbergtemplateblock-add-question button button-large"
                            value={ inNewQuestion ? 'new' : selectedValue }
                            onClick={ this.handleAddAnswerClick }
                        > 
                            Add Answer
                        </Button>
                        <Button
                            className="gutenbergtemplateblock-save-poll button button-large"
                            value={ inNewQuestion ? 'new' : selectedValue }
                            onClick={ this.handleSaveClick }
                        > 
                            Save
                        </Button>
                    </div>
                }
            </div>
        );
    }

}
