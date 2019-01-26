/**
 * Block dependencies
 */
import classnames from "classnames";
import icons from './icons';

/**
 * Internal block libraries
 */
const { __ } = wp.i18n;
const { Component } = wp.element;
const {
    AlignmentToolbar,
    BlockControls,
    BlockAlignmentToolbar,
} = wp.editor;
const {
    Toolbar,
    Tooltip,
    Button,
    // ColorIndicator,
    // ColorPalette,
    // ColorPicker
} = wp.components;

/**
 * Create a Block Controls wrapper Component
 */
export default class Inspector extends Component {

    constructor()
    {
        super( ...arguments );
    }

    render() {
        const { attributes: { blockAlignment, textAlignment, styleToggle }, setAttributes } = this.props;
        const formStyleToggle = () => setAttributes( { styleToggle: !styleToggle } );

        return (
            <BlockControls>
                <BlockAlignmentToolbar
                    value = { blockAlignment }
                    onChange = { blockAlignment => setAttributes( { blockAlignment } ) }
                />
                <AlignmentToolbar
                    value = { textAlignment }
                    onChange = { textAlignment => setAttributes( { textAlignment } ) }
                />
                <Toolbar>
                    <Tooltip text = { __( 'Style Toggle', 'gutenbergtemplateblock' ) }>
                        <Button
                            className={ classnames(
                                'components-icon-button',
                                'components-toolbar__control',
                                { 'is-active': styleToggle },
                            )}
                            onClick = { formStyleToggle }
                        >
                            { icons.contrast }
                        </Button>
                    </Tooltip>
                </Toolbar>
            </BlockControls>
        );
    }
}
