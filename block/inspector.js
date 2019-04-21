/**
 * Block dependencies
 */
// import colourAttributes from "./colours";

/**
 * Internal block libraries
 */
const { __ } = wp.i18n;
const { Component } = wp.element;
const {
  InspectorControls,
//   ColorPalette,
//   PanelColorSettings,
//   ContrastChecker
} = wp.editor;

const {
//   CheckboxControl,
  PanelBody,
  PanelRow,
  FormToggle,
//   RadioControl,
//   RangeControl,
//   TextControl,
//   TextareaControl,
//   ToggleControl,
//   SelectControl
} = wp.components;

/**
 * Create an Inspector Controls wrapper Component
 */
export default class Inspector extends Component {
  constructor()
  {
    super( ...arguments );
  }

  render() {
    const { 
        attributes: { 
            styleToggle,
            titleColour,
            contentColour
        }, setAttributes 
    } = this.props;
    const formStyleToggle = () => setAttributes( { styleToggle: !styleToggle } );

    return (
        <InspectorControls>
            <PanelBody
                title = { __( 'Style Toggle', 'gutenbergtemplateblock' ) }
            >
                <PanelRow>
                    <label
                        htmlFor = "Style-form-toggle"
                    >
                        { __( 'Style Toggle', 'gutenbergtemplateblock' ) }
                    </label>
                    <FormToggle
                        id = "Style-form-toggle"
                        label = { __( 'Style Toggle', 'gutenbergtemplateblock' ) }
                        checked = { styleToggle }
                        onChange = { formStyleToggle }
                    />
                </PanelRow>
            </PanelBody>

            {/* <PanelColorSettings
                title = { __( "Edit Title Colour", "jsforwpblocks" ) }
                colorSettings = {[{
                    label: __( "Selected Color" ),
                    value: titleColour,
                    onChange: titleColour => {
                        setAttributes({ titleColour });
                    }
                }]}
                colors = { colourAttributes.colours }
            />

            <PanelColorSettings
                title = { __( "Edit Content Colour", "jsforwpblocks" ) }
                colorSettings = {[{
                    label: __( "Selected Color" ),
                    value: contentColour,
                    onChange: contentColour => {
                        setAttributes({ contentColour });
                    }
                }]}
                colors = { colourAttributes.colours }
            /> */}

        </InspectorControls>
    );
  }
}
