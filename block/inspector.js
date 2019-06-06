/**
 * Block dependencies
 */
import colourAttributes from './colours'
import icons from './icons'
// import PotDStyle from './components/PotdStyle'

/**
 * Internal block libraries
 */
const { __ } = wp.i18n
const { Component } = wp.element
const {
    InspectorControls,
    PanelColorSettings,
    MediaUpload
} = wp.editor

const {
    // CheckboxControl,
    PanelBody,
    PanelRow,
    FormToggle,
    // RadioControl,
    RangeControl,
    // TextControl,
    // TextareaControl,
    // ToggleControl,
    SelectControl,
    Button
} = wp.components

/**
 * Create an Inspector Controls wrapper Component
 */
export default class Inspector extends Component {
    constructor()
    {
        super( ...arguments )

        this.onSelectImage = this.onSelectImage.bind( this )
        this.onRemoveImage = this.onRemoveImage.bind( this )
    }

    onSelectImage( image ) {
        this.props.setAttributes({
            imageId: image.id,
            imageUrl: image.url,
            imageAlt: image.alt
        })
    }

    onRemoveImage() {
        this.props.setAttributes({
            imageId: null,
            imageUrl: null,
            imageAlt: null
        })
    }

    render() {
        const { 
            attributes: { 
                styleToggle,
                backgroundColour,
                fontColour,
                radiusControl,
                borderWidth,
                borderColour,
                borderStyle,
                imageId,
                imageUrl,
                imageAlt
            },
            setAttributes,
            isSelected
        } = this.props
        
        const formStyleToggle = () => setAttributes( { styleToggle: !styleToggle } )

        return (
            <InspectorControls>

                <PanelBody
                    title='Style Toggle'
                >
                    <PanelRow>
                        <label
                            htmlFor='Style-form-toggle'
                        >
                            Style Toggle
                        </label>
                        <FormToggle
                            id='Style-form-toggle'
                            label='Style Toggle'
                            checked={ styleToggle }
                            onChange={ formStyleToggle }
                        />
                    </PanelRow>
                </PanelBody>
                <PanelColorSettings
                    title='Background colour'
                    colorSettings={[{
                        label: 'Selected Colour',
                        value: backgroundColour,
                        onChange: backgroundColour => {
                            setAttributes({ backgroundColour })
                        }
                    }]}
                    colors={ colourAttributes.colours }
                />

                { ! imageId ? (

                    <div>
                        <div>{ 'Background image:' }</div>
                        <MediaUpload
                            onSelect={ this.onSelectImage }
                            type='image'
                            value={ imageId }
                            render={ ( { open } ) => (
                                <Button
                                    className={ 'button button-large' }
                                    onClick={ open }
                                >
                                    { icons.upload }
                                    { ' Upload Image' }
                                </Button>
                            ) }
                        >
                        </MediaUpload>
                    </div>

                ) : (

                    <p class='image-wrapper'>
                        <img
                            src={ imageUrl }
                            alt={ imageAlt }
                        />

                        { isSelected ? (

                            <Button
                                className='remove-image'
                                onClick={ this.onRemoveImage }
                            >
                                { icons.remove }
                            </Button>

                        ) : null }

                    </p>
                )}

                <PanelColorSettings
                    title='Font colour'
                    colorSettings={[{
                        label: 'Selected Colour',
                        value: fontColour,
                        onChange: fontColour => {
                            setAttributes({ fontColour })
                        }
                    }]}
                    colors={ colourAttributes.colours }
                />
                <PanelBody>
                    <RangeControl
                        beforeIcon='arrow-left-alt2'
                        afterIcon='arrow-right-alt2'
                        label='Border Radius'
                        value={ radiusControl }
                        onChange={ radiusControl => setAttributes({ radiusControl }) }
                        min={ 0 }
                        max={ 1000 }
                    />
                </PanelBody>
                <PanelBody>
                    <RangeControl
                        beforeIcon='arrow-left-alt2'
                        afterIcon='arrow-right-alt2'
                        label='Border Width'
                        value={ borderWidth }
                        onChange={ borderWidth => setAttributes({ borderWidth }) }
                        min={ 0 }
                        max={ 100 }
                    />
                </PanelBody>
                <PanelColorSettings
                    title='Border colour'
                    colorSettings={[{
                        label: 'Selected Colour',
                        value: borderColour,
                        onChange: borderColour => {
                            setAttributes({ borderColour })
                        }
                    }]}
                    colors={ colourAttributes.colours }
                />
                <SelectControl
                    label='Select border style:'
                    value={ borderStyle }
                    onChange={ borderStyle => setAttributes({ borderStyle }) }
                    options={[
                        { value: 'none', label: 'None' },
                        { value: 'hidden', label: 'Hidden' },
                        { value: 'dotted', label: 'Dotted' },
                        { value: 'dashed', label: 'Dashed' },
                        { value: 'solid', label: 'Solid' },
                        { value: 'double', label: 'Double' },
                        { value: 'groove', label: 'Groove' },
                        { value: 'ridge', label: 'Ridge' },
                        { value: 'inset', label: 'Inset' },
                        { value: 'outset', label: 'Outset' },
                    ]}
                />

            </InspectorControls>
        )
    }
}
