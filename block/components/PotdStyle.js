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

    constructor() {
        super( ...arguments )

        this.handleRadioChange = this.handleRadioChange.bind( this )
        this.handleTitleShadowCheckboxChange = this.handleTitleShadowCheckboxChange.bind( this )
        this.handleOptionsShadowCheckboxChange = this.handleOptionsShadowCheckboxChange.bind( this )
    }

    componentDidMount() {
        const {
            toggle,
            light,
            shadowTitle,
            shadowOptions
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
        this.handleTitleShadowCheckboxChange( shadowTitle )
        this.handleOptionsShadowCheckboxChange( shadowOptions )
    }

    handleRadioChange( event ) {
        this.props.onStyleRadioChange( event )
    }

    handleTitleShadowCheckboxChange( event ) {
        this.props.onTitleShadowCheckboxChange( event )
    }

    handleOptionsShadowCheckboxChange( event ) {
        this.props.onOptionsShadowCheckboxChange( event )
    }

    render() {
        const {
            activeStyle,        // state
            activeTitleShadow,  // state
            activeOptionsShadow, // state
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
                <div className={ 'components-base-control' }>{ 'Shadow Options' }</div>
                <CheckboxControl
                    className={ activeTitleShadow ? 'potd-shadows style-shadow-checked' : 'potd-shadows' }
                    label="Title Shadow"
                    checked={ activeTitleShadow }
                    onChange={ this.handleTitleShadowCheckboxChange }
                />
                <CheckboxControl
                    className={ activeOptionsShadow ? 'potd-shadows style-shadow-checked' : 'potd-shadows' }
                    label="Option Shadows"
                    checked={ activeOptionsShadow }
                    onChange={ this.handleOptionsShadowCheckboxChange }
                />
            </div>
        )
    }

}
