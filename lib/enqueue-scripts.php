<?php

namespace Gutenberg\Template_Block;

add_action( 'enqueue_block_editor_assets', __NAMESPACE__ . '\enqueue_block_editor_assets' );
/**
 * Enqueue block editor only JavaScript and CSS.
 */
function enqueue_block_editor_assets()
{
	$namespace = 'gutenbergtemplateblock';
	// Make DRY paths variables
	$block_path = '/assets/js/editor.block.js';
	$style_path = '/assets/css/block.editor.css';

	// Enqueue the bundled block JS file
	wp_enqueue_script(
		$namespace . '-block-js',
		_get_plugin_url() . $block_path,
		[ 'wp-i18n', 'wp-element', 'wp-blocks', 'wp-components', 'wp-editor' ],
		filemtime( _get_plugin_directory() . $block_path),
		true
	);

	// Enqueue optional editor only styles
	wp_enqueue_style(
		$namespace . '-block-editor-css',
		_get_plugin_url() . $style_path,
		[ 'wp-blocks' ],
		filemtime( _get_plugin_directory() . $style_path )
	);
}

add_action( 'enqueue_block_assets', __NAMESPACE__ . '\enqueue_assets' );
/**
 * Enqueue front end and editor JavaScript and CSS assets.
 */
function enqueue_assets()
{
	$namespace = 'gutenbergtemplateblock';

	$style_path = '/assets/css/block.style.css';
	wp_enqueue_style(
		$namespace . '-block',
		_get_plugin_url() . $style_path,
		null,
		filemtime( _get_plugin_directory() . $style_path )
	);
}

add_action( 'enqueue_block_assets', __NAMESPACE__ . '\enqueue_frontend_assets' );
/**
 * Enqueue frontend JavaScript and CSS assets.
 */
function enqueue_frontend_assets()
{
	$namespace = 'gutenbergtemplateblock';
	// If in the backend, bail out.
	if ( is_admin() )
	{
		return;
	}

	$block_path = '/assets/js/frontend.block.js';
	wp_enqueue_script(
		$namespace . '-block-frontend',
		_get_plugin_url() . $block_path,
		// [ 'wp-dom-ready' ],
		[],
		filemtime( _get_plugin_directory() . $block_path )
	);

}
