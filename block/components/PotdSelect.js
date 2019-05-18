import icons from './../icons'
import PotdAnswers from "./PotdAnswers"
const {
    SelectControl,
    Button,
    TextControl,
    CheckboxControl,
    Spinner
} = wp.components
const { select } = wp.data

export default class PotDSelect extends React.Component {

    constructor( props ) {
        super( props )
        this.componentDidMount = this.componentDidMount.bind( this )
        this.handleChange = this.handleChange.bind( this )
        this.handleInputChange = this.handleInputChange.bind( this )
        this.handlePositionChange = this.handlePositionChange.bind( this )
        this.handleSelectInputChange = this.handleSelectInputChange.bind( this )
        this.handleAddQuestionClick = this.handleAddQuestionClick.bind( this )
        this.handleAddAnswerClick = this.handleAddAnswerClick.bind( this )
        this.handleDeleteQuestionClick = this.handleDeleteQuestionClick.bind( this )
        this.handleDeleteAnswerClick = this.handleDeleteAnswerClick.bind( this )
        this.handleCancelClick = this.handleCancelClick.bind( this )
        this.handleSaveClick = this.handleSaveClick.bind( this )
        this.handleCheckboxChange = this.handleCheckboxChange.bind( this )
        this.getSelectedKey = this.getSelectedKey.bind( this )

        this.state = {
            selectedValue: null,
            selectedKey: null,
            lastSelectableKey: null,
            pollRotate: false,
            rotateCheckboxLoaded: false
        }
    }

    componentDidMount() {
        const {
            existingBlockQid,
            questions,
            uuid
        } = this.props

        const lastIndex = questions.length - 1
        this.getRotateOptionByUUID( uuid )
        
        this.setState({
            selectedValue: existingBlockQid ? existingBlockQid : this.props.questions[0].value
        }, () => this.setState({
            selectedKey: this.getSelectedKey(),
            lastSelectableKey : lastIndex
        }))
    }

    handleChange( event ) {
        this.setState({
            selectedValue: event,
            lastSelectableKey: null
        }, () => {
            this.setState({
                selectedKey: this.getSelectedKey() 
            })
            this.props.onSelectChange( event, this.props.editable )
        })
    }

    handleDeleteQuestionClick( event ) {
        let qid = event.target.value
        this.props.onDeleteQuestionClick( this.getSelectedKey(), qid )
    }

    handleDeleteAnswerClick( index, oid ) {
        this.props.onDeleteAnswerClick( index, oid )
    }

    handleSelectInputChange( event ) {
        let index = this.props.inNewQuestion ? 0 : this.state.selectedKey
        this.props.onSelectInputChange( event, index )
    }

    handleCancelClick() { this.props.onCancelClick() }
    handleSaveClick( event ) { this.props.onSaveClick( event.target.value ) }
    handleInputChange( event, name ) { this.props.onInputChange( event, name ) }
    handlePositionChange( positions ) { this.props.onPositionChange( positions ) }
    handleAddQuestionClick( event ) { this.props.onAddQuestionClick( event ) }
    handleAddAnswerClick( event ) { this.props.onAddAnswerClick( event.target.value ) }

    getSelectedKey() {
        for ( let i = 0; i < this.props.questions.length; i++ ) {
            if ( parseInt( this.props.questions[i].value ) == this.state.selectedValue ) {
                return i
            }
        } return 0
    }

    handleCheckboxChange( event ) {
        this.setState({
            rotateCheckboxLoaded: false
        })

        const uuid = this.props.uuid
        var self = this
        const postId = select( 'core/editor' ).getCurrentPostId()

        let url = gutenbergtemplateblock_ajax_object.ajax_url +
                  '?action=gutenbergtemplateblock_setRotateOptionByUUID' +
                  '&u=' + uuid +
                  '&r=' + event.toString() +
                  '&p=' + postId +
                  '&security=' + gutenbergtemplateblock_ajax_object.security
        
        fetch( url )
            .then( response => {
                return response.json()
            })
            .then(
                ( result ) => {
                    if ( result === 'success' )
                    {
                        self.setState({
                            pollRotate: event,
                            rotateCheckboxLoaded: true
                        })
                    }
                },
                ( error ) => {
                    console.log( error )
                }
            )
    }

    getRotateOptionByUUID( uuid ) {
        var self = this
        let url = gutenbergtemplateblock_ajax_object.ajax_url +
                  '?action=gutenbergtemplateblock_getRotateOptionByUUID' +
                  '&u=' + uuid +
                  '&security=' + gutenbergtemplateblock_ajax_object.security
        
        fetch( url )
            .then( response => {
                return response.json()
            })
            .then(
                ( result ) => {
                    self.setState({
                        // can also return 'fail' if db error
                        pollRotate: result == 'true' ? true : false,
                        rotateCheckboxLoaded: true
                    })
                },
                ( error ) => {
                    console.log( error )
                }
            )
    }

    render() {
        const {
            questions,
            answers,
            editable,
            editing,
            inNewQuestion,
            isLoadedAnswers
        } = this.props
        const {
            selectedValue,
            pollRotate,
            rotateCheckboxLoaded
        } = this.state
        const selectedKey = this.getSelectedKey()
        const editTitleText = questions[ selectedKey ].label

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
                        value={ editable ? 'last' : selectedValue }
                    />
                }
                { ( editable && editing ) &&
                    <div class="grid">
                        <div class="potd-question inline-flex">
                            <div className="edit-input">
                                <TextControl
                                    name={ selectedKey }
                                    value={ editTitleText }
                                    onChange={ this.handleSelectInputChange }
                                />
                            </div>
                            { ( !inNewQuestion && editing ) &&
                                <Button
                                    className="button button-large edit-delete-button"
                                    value={ selectedValue }
                                    onClick={ this.handleDeleteQuestionClick }
                                > 
                                    { icons.delete }
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
                        onPositionChange={ this.handlePositionChange }
                        onDeleteAnswerClick={ this.handleDeleteAnswerClick }
                        isLoadedAnswers={ isLoadedAnswers }
                    />
                }
                { !editable &&
                    ( rotateCheckboxLoaded ?
                        <CheckboxControl
                            heading="Rotate poll question each day?"
                            label={ pollRotate ? 'Yes' : 'No' }
                            checked={ pollRotate }
                            onChange={ this.handleCheckboxChange }
                        />
                        :
                        <div>
                            <label class="components-base-control">Rotate poll question each day?</label>
                            <Spinner/>
                        </div>
                    )
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
        )
    }

}
