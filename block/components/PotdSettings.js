// import PotdAnswers from "./PotdAnswers";
const {
    // SelectControl,
    // Button,
    // TextControl
    RadioControl,
    CheckboxControl
} = wp.components;
const { withSelect } = wp.data;

export default class PotdSettings extends React.Component {

    constructor( props ) {
        super( props );
        // this.componentDidMount = this.componentDidMount.bind( this );
        this.handleRadioChange = this.handleRadioChange.bind( this );
        this.handleCheckboxChange = this.handleCheckboxChange.bind( this );

        this.state = {
            selectedRadio: null,
            blockingWarning: false,
            pollRotate: false
        };
    }

    componentDidMount() {
        console.log( 'componentDidMount' );

        const result = withSelect( select => {
            // return {
                // posts: select( 'core' ).getEntityRecords( 'postType', 'post', { per_page: 3 } )
            // };
            return '~test!~';
        } );

        console.log( 'result: ', result );
        // ( ( { posts, className, isSelected, setAttributes } ) => {
            
        // });
    }

    handleRadioChange( event ) {
        this.setState({
            selectedRadio: event,
            blockingWarning: event === 'none' ? true : false
        });
    }

    handleCheckboxChange( event ) { this.setState({ pollRotate: event }) }

    render() {
        const {
            className
        } = this.props;
        const {
            selectedRadio,
            blockingWarning,
            pollRotate
        } = this.state;

        return (
            <div>
                <div>
                    <RadioControl
                        label="How would you like to limit the votes per day?"
                        selected={ selectedRadio }
                        options={[
                            { label: 'Block by IP', value: 'ip' },
                            { label: 'Block by cookie', value: 'cookie' },
                            { label: 'Block by IP & cookie', value: 'both' },
                            { label: 'No blocking', value: 'none' },
                        ]}
                        onChange={ this.handleRadioChange }
                    />
                    { blockingWarning &&
                        <p>Warning! If no blocking option is selected unlimited daily voting is enabled.</p>
                    }
                </div>
                <div className={ className }>
                    <CheckboxControl
                        heading="Rotate poll question each day?"
                        label={ pollRotate ? 'Yes' : 'No' }
                        checked={ pollRotate }
                        onChange={ this.handleCheckboxChange }
                    />
                </div>
            </div>
        );
    }

}
