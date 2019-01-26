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
	// $recent_posts = wp_get_recent_posts([
	// 	'numberposts' => 3,
	// 	'post_status' => 'publish',
	// ]);

	// if ( empty( $recent_posts ) )
	// {
	// 	return '<p>No posts</p>';
	// }

	// $markup = '<ul>';

	// foreach ( $recent_posts as $post )
	// {
	// 	$post_id  = $post[ 'ID' ];
	// 	$markup  .= sprintf(
	// 		'<li><a href="%1$s">%2$s</a></li>',
	// 		esc_url( get_permalink( $post_id ) ),
	// 		esc_html( get_the_title( $post_id ) )
	// 	);
	// }

	return '<div class="meh">~hello world~</div>';
}
