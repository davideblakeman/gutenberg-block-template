const {
    RadioControl,
    Tooltip
} = wp.components

export default class PotDStyle extends React.Component {

    constructor( props ) {
        super( props )
        this.handleRadioChange = this.handleRadioChange.bind( this )
    }

    componentDidMount() {
        const defaultStyle = this.props.styleAttributes.toggle
        const lightStyle = this.props.styleAttributes.light
        let style = null

        if ( lightStyle ) {
            style = 'light'
        } else if ( defaultStyle ) {
            style = 'dark'
        } else {
            style = 'default'
        }
        
        this.handleRadioChange( style )
    }

    handleRadioChange( event ) {
        this.setState({ selectedRadio: event })
        this.props.onStyleRadioChange( event )
    }

    render() {
        const { activeStyle } = this.props

        return (
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
        )
    }

}
