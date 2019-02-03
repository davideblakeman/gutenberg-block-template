<?php

namespace Gutenberg\Template_Block\Block;

// add_action( 'plugins_loaded', __NAMESPACE__ . '\register_block' );
/**
 * Register the block.
 *
 * @since 1.0
 *
 * @return void
 */
function register_block()
{
	// Only load if Gutenberg is available.
	if ( ! function_exists( 'register_block_type' ) ) {
		return;
	}

	// Hook server side rendering into render callback
	register_block_type( 'gutenbergtemplateblock/block', [
		'render_callback' => __NAMESPACE__ . '\render_block',
	] );
}

/**
 * Server rendering for /block
 */
function render_block()
{
	return '<div class="php">PHP render?</div>';
}
