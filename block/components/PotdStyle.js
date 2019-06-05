// import colourAttributes from "./../colours"

const {
    // PanelColorSettings
} = wp.editor

const {
    CheckboxControl,
    RadioControl,
    Tooltip
} = wp.components

export default class PotDStyle extends React.Component {

    constructor( props ) {
        // super( props )
        super( ...arguments )
        this.handleRadioChange = this.handleRadioChange.bind( this )
        this.handleCheckboxChange = this.handleCheckboxChange.bind( this )
        // console.log( 'constructor', props )
    }

    componentDidMount() {
        console.log( 'componentDidMount', this.props )

        const {
            toggle,
            light,
            shadow
        } = this.props.styleAttributes
        let style = null

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
        this.props.onStyleRadioChange( event )
    }

    handleCheckboxChange( event ) {
        this.props.onStyleCheckboxChange( event )
    }

    render() {
        const {
            activeStyle,        // state
            activeShadow,       // state
            // backgroundColour,
            // setAttributes
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
                {/* <PanelColorSettings
                    // title = { __( "Edit Title Colour", "jsforwpblocks" ) }
                    title={ 'Background colour' }
                    colorSettings={[{
                        label: "Selected Colour",
                        value: backgroundColour,
                        onChange: backgroundColour => {
                            setAttributes({ backgroundColour })
                        }
                    }]}
                    colors={ colourAttributes.colours }
                />  */}
            </div>
        )
    }

}
