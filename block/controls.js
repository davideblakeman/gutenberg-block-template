/**
 * Block dependencies
 */
import classnames from "classnames"
import icons from './icons'

/**
 * Internal block libraries
 */
const { __ } = wp.i18n
const { Component } = wp.element
const {
    AlignmentToolbar,
    BlockControls,
    BlockAlignmentToolbar,
} = wp.editor
const {
    Toolbar,
    Tooltip,
    Button,
    // ColorIndicator,
    // ColorPalette,
    // ColorPicker
} = wp.components

/**
 * Create a Block Controls wrapper Component
 */
export default class Inspector extends Component {

    constructor() {
        super( ...arguments )
        this.handleStyleChange = this.handleStyleChange.bind( this )
        this.handleAlignChange = this.handleAlignChange.bind( this )
    }

    handleStyleChange() {
        const {
            attributes: {
                styleToggle
            }
        } = this.props
        
        this.props.setAttributes( { styleToggle: !styleToggle } )
        this.props.onStyleChange( styleToggle )
    }

    handleAlignChange( event ) {
        this.props.setAttributes( { textAlignment: event } )
        this.props.onAlignChange( event )
    }

    render() {
        const {
            attributes: { 
                blockAlignment,
                textAlignment,
                styleToggle
            },
            setAttributes
        } = this.props

        return (
            <BlockControls>
                <BlockAlignmentToolbar
                    value = { blockAlignment }
                    onChange = { blockAlignment => setAttributes( { blockAlignment } ) }
                />
                <AlignmentToolbar
                    value = { textAlignment }
                    onChange = { this.handleAlignChange }
                />
                <Toolbar>
                    <Tooltip text = { __( 'Style Toggle', 'gutenbergtemplateblock' ) }>
                        <Button
                            className={ classnames(
                                'components-icon-button',
                                'components-toolbar__control',
                                { 'is-active': styleToggle },
                            )}
                            onClick = { this.handleStyleChange }
                        >
                            { icons.contrast }
                        </Button>
                    </Tooltip>
                </Toolbar>
            </BlockControls>
        )
    }
}
