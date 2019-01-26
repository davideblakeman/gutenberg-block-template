<?php

namespace Gutenberg\Template_Block;

add_action( 'enqueue_block_editor_assets', __NAMESPACE__ . '\enqueue_block_editor_assets' );
/**
 * Enqueue block editor only JavaScript and CSS.
 */
function enqueue_block_editor_assets()
{
	$namespace = 'gutenbergtemplateblock';
	// Make paths variables so we don't write em twice ;)
	$block_path = '/assets/js/editor.block.js';
	$style_path = '/assets/css/block.editor.css';

	// print_r( _get_plugin_directory() . $block_path );
	// exit;

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

	// doesn't work -_-
	// Setup token security for ajax
	// wp_localize_script(
	// 	$namespace . '-block-js',
	// 	$namespace . '_ajax_object',
	// 	[
	// 		'ajax_url'  => admin_url( 'admin-ajax.php' ),
	// 		'security'  => wp_create_nonce( $namespace . '-security-token' ),
	// 	]
	// );
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
		[],
		filemtime( _get_plugin_directory() . $block_path )
	);

}

// add_action( 'wp_ajax_gutenbergtemplateblock_get', 'gutenbergtemplateblock_get' );
// add_action( 'wp_ajax_nopriv_gutenbergtemplateblock_get', 'gutenbergtemplateblock_get' );

// function gutenbergtemplateblock_get()
// {
// 	// gutenbergtemplateblock_check_ajax_token();
// 	print_r( 'here?!' );
// 	exit;

// 	$t = $_REQUEST[ 't' ];

// 	echo $t;
// 	wp_die();
// }