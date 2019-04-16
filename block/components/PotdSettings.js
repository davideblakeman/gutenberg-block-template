const {
    RadioControl,
    // CheckboxControl,
    Spinner
} = wp.components;

export default class PotdSettings extends React.Component {

    constructor( props ) {
        super( props );
        this.componentDidMount = this.componentDidMount.bind( this );
        this.handleRadioChange = this.handleRadioChange.bind( this );
        // this.handleCheckboxChange = this.handleCheckboxChange.bind( this );
        this.getOptions = this.getOptions.bind( this );
        this.setOption = this.setOption.bind( this );
        this.initRadio = this.initRadio.bind( this );
        // this.initCheckbox = this.initCheckbox.bind( this );

        this.state = {
            selectedRadio: null,
            // pollRotate: false,
            blockingWarning: false,
            isLoaded: false
        };
    }

    componentDidMount() {
        // console.log( 'componentDidMount' );
        this.getOptions();
    }

    getOptions() {
        var self = this;
        let url = gutenbergtemplateblock_ajax_object.ajax_url +
                  '?action=gutenbergtemplateblock_getOptions' +
                  '&security=' + gutenbergtemplateblock_ajax_object.security;
        
        fetch( url )
            .then( response => {
                return response.json();
            })
            .then(
                ( result ) => {
                    // console.log( result );

                    self.initRadio( result.gutenbergtemplateblock_limit_by.option_value );
                    // this.initCheckbox( result.gutenbergtemplateblock_rotate_daily.option_value );
                    self.setState({
                        isLoaded: true
                    });
                },
                ( error ) => {
                    console.log( error );
                }
            )
    }

    setOption( optionName, value ) {
        let ajaxCall = 'gutenbergtemplateblock_setOption_';
        let validCalls = [
            'limit_by',
            'rotate_daily'
        ];

        if ( validCalls.indexOf( optionName ) !== -1 ) {
            ajaxCall += optionName

            var self = this;
            let url = gutenbergtemplateblock_ajax_object.ajax_url +
                      '?action=' + ajaxCall +
                      '&v=' + value +
                      '&security=' + gutenbergtemplateblock_ajax_object.security;
            
            fetch( url )
                .then( response => {
                    return response.json();
                })
                .then(
                    ( result ) => {
                        // console.log( result );
                    },
                    ( error ) => {
                        console.log( error );
                    }
                )
        }
    }

    initRadio( event ) {
        this.setState({
            selectedRadio: event,
            blockingWarning: event === 'none' ? true : false
        });
    }

    // initCheckbox( event ) {
    //     this.setState({
    //         pollRotate: event === 'true' ? true : false
    //     });
    // }

    handleRadioChange( event ) {
        this.setState({
            selectedRadio: event,
            blockingWarning: event === 'none' ? true : false
        }, () => this.setOption( 'limit_by', event ) );
    }

    // handleCheckboxChange( event ) {
    //     this.setState({
    //         pollRotate: event
    //     }, () => this.setOption( 'rotate_daily', event ) );
    // }

    render() {
        const {
            className
        } = this.props;
        const {
            selectedRadio,
            blockingWarning,
            // pollRotate,
            isLoaded
        } = this.state;

        return (
            <div>
                { isLoaded ?
                    <div>
                        <div>
                            <RadioControl
                                label="How would you like to limit the votes per day?"
                                selected={ selectedRadio }
                                options={[
                                    { label: 'Block by IP', value: 'ip' },
                                    { label: 'Block by cookie', value: 'cookie' },
                                    { label: 'Block by IP & cookie', value: 'ipcookie' },
                                    { label: 'Block by logged in user', value: 'user' },
                                    { label: 'No blocking', value: 'none' },
                                ]}
                                onChange={ this.handleRadioChange }
                            />
                            { blockingWarning &&
                                <p>Warning! If no blocking option is selected unlimited daily voting is enabled.</p>
                            }
                        </div>
                        {/* <div className={ className }>
                            <CheckboxControl
                                heading="Rotate poll question each day?"
                                label={ pollRotate ? 'Yes' : 'No' }
                                checked={ pollRotate }
                                onChange={ this.handleCheckboxChange }
                            />
                        </div> */}
                    </div>
                    :
                    <div>
                        <Spinner/>
                        <div>Loading...</div>
                    </div>
                }
            </div>
        );
    }

}
