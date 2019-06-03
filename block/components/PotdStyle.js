const {
    CheckboxControl,
    RadioControl,
    Tooltip
} = wp.components

export default class PotDStyle extends React.Component {

    constructor( props ) {
        super( props )
        this.handleRadioChange = this.handleRadioChange.bind( this )
        this.handleCheckboxChange = this.handleCheckboxChange.bind( this )
    }

    componentDidMount() {
        const {
            toggle,
            light,
            shadow
        } = this.props.styleAttributes
        let style = null

        console.log( 'styleAttributes' ,this.props.styleAttributes )

        if ( light ) {
            style = 'light'
        } else if ( toggle ) {
            style = 'dark'
        } else {
            style = 'default'
        }

        this.handleRadioChange( style )
        this.handleCheckboxChange( shadow )
    }

    handleRadioChange( event ) {
        // this.setState({ selectedRadio: event })
        this.props.onStyleRadioChange( event )
    }

    handleCheckboxChange( event ) {
        this.props.onStyleCheckboxChange( event )
    }

    render() {
        const {
            activeStyle,
            activeShadow
        } = this.props

        return (
            <div>
                <Tooltip 
                    text={ 'Default Style uses your WordPress Theme' }
                >
                    <div>
                        <RadioControl
                            label="Select Style"
                            selected={ activeStyle }
                            options={[
                                { label: 'Default Style', value: 'default' },
                                { label: 'Light Style', value: 'light' },
                                { label: 'Dark Style', value: 'dark' },
                            ]}
                            onChange={ this.handleRadioChange }
                        />
                    </div>
                </Tooltip>
                <CheckboxControl
                    heading="Style Options"
                    label="Shadows"
                    // help="Test help"
                    checked={ activeShadow }
                    onChange={ this.handleCheckboxChange }
                />
            </div>
        )
    }

}
