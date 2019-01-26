<?php
/**
 * Plugin's bootstrap file to launch the plugin.
 *
 * @package     Gutenberg\Template_Block
 * @author      Zac Gordon (adapted by David Blakeman)
 * @license     GPL2+
 *
 * @wordpress-plugin
 * Plugin Name: Gutenberg - Template Block
 * Plugin URI:  https://
 * Description: A plugin containing a template block for developers.
 * Version:     1.0
 * Author:      Zac Gordon (adapted by David Blakeman)
 * Author URI:  https://
 * Text Domain: gutenbergtemplateblock
 * Domain Path: /languages
 * License:     GPL2+
 * License URI: http://www.gnu.org/licenses/gpl-2.0.html
 */

namespace Gutenberg\Template_Block;

//  Exit if accessed directly.
defined( 'ABSPATH' ) || exit;

/**
 * Gets this plugin's absolute directory path.
 *
 * @since  2.1.0
 * @ignore
 * @access private
 *
 * @return string
 */
function _get_plugin_directory()
{
	return __DIR__;
}

/**
 * Gets this plugin's URL.
 *
 * @since  2.1.0
 * @ignore
 * @access private
 *
 * @return string
 */
function _get_plugin_url()
{
	static $plugin_url;

	if ( empty( $plugin_url ) )
	{
		$plugin_url = plugins_url( null, __FILE__ );
	}

	return $plugin_url;
}

// Enqueue JS and CSS
// include __DIR__ . '/lib/enqueue-scripts.php';
// require_once(__DIR__ . '/lib/GutenbergtemplateblockEnqueue.php');
include __DIR__ . '/lib/GutenbergtemplateblockEnqueue.php';
include __DIR__ . '/lib/GutenbergtemplateblockWpdb.php';

// Register meta boxes
// include __DIR__ . '/lib/meta-boxes.php';

// Block Templates
// include __DIR__ . '/lib/block-templates.php';

include __DIR__ . '/block/index.php';

// Setup custom tables
require_once __DIR__ . '/lib/CustomTables.php';
