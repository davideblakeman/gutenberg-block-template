const {
    RadioControl,
    // CheckboxControl,
    Spinner
} = wp.components

export default class PotDStyle extends React.Component {

    constructor( props ) {
        super( props )
        this.handleRadioChange = this.handleRadioChange.bind( this )

        this.state = {
            selectedRadio: null,
            isLoaded: true
        }
    }

    handleRadioChange( event ) {
        console.log( event )
        this.setState({
            selectedRadio: event
        // }, () => this.setOption( 'limit_by', event ) )
        })
        this.getOptions()
        this.props.onStyleRadioChange( event )
    }

    getOptions() {
        this.setState({
            isLoaded: false
        })
        var self = this
        let url = gutenbergtemplateblock_ajax_object.ajax_url +
                  '?action=gutenbergtemplateblock_getStyleOptions' +
                  '&security=' + gutenbergtemplateblock_ajax_object.security
        
        fetch( url )
            .then( response => {
                return response.json()
            })
            .then(
                ( result ) => {
                    console.log( result )

                    // self.initRadio( result.gutenbergtemplateblock_limit_by.option_value )
                    self.setState({
                        // selectedRadio: result.option_value,
                        isLoaded: true
                    })
                },
                ( error ) => {
                    console.log( error )
                }
            )
    }

    render() {
        // const {
        //     className
        // } = this.props
        const {
            selectedRadio,
            isLoaded
        } = this.state

        return (
            <div>
                { isLoaded ?
                    <div>
                        <RadioControl
                            label="Select Style"
                            selected={ selectedRadio }
                            options={[
                                { label: 'Default Style', value: 'default' },
                                { label: 'Light Style', value: 'light' },
                                { label: 'Dark Style', value: 'dark' },
                                // { label: 'Style 1', value: '1' },
                                // { label: 'Style 2', value: '2' },
                                // { label: 'Style 3', value: '3' },
                                // { label: 'Custom Style', value: 'c' },
                            ]}
                            onChange={ this.handleRadioChange }
                        />
                    </div>
                    :
                    <div>
                        <Spinner/>
                        <div>Loading...</div>
                    </div>
                }
            </div>
        )
    }

}
