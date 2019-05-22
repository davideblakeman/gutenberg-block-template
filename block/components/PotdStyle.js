const {
    RadioControl,
    Tooltip
} = wp.components

export default class PotDStyle extends React.Component {

    constructor( props ) {
        super( props )
        this.handleRadioChange = this.handleRadioChange.bind( this )
        this.state = { selectedRadio: 'default' }
    }

    handleRadioChange( event ) {
        this.setState({ selectedRadio: event })
        this.props.onStyleRadioChange( event )
    }

    render() {
        const { selectedRadio } = this.state

        return (
            <Tooltip 
                text={ 'Default Style uses your WordPress Theme' }
            >
                <div>
                    <RadioControl
                        label="Select Style"
                        selected={ selectedRadio }
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
