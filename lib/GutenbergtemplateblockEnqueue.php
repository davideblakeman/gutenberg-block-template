<?php

namespace Gutenberg\Template_Block;

// if ( !defined( 'ABSPATH' ) ) die(); // needed?

class GutenbergtemplateblockEnqueue
{
    private $namespace = 'gutenbergtemplateblock';

    /** frontend constructor */
    public function __construct()
    {
        // enqueue our scripts
        add_action( 'enqueue_block_editor_assets', array( $this, 'enqueue_block_editor_assets' ) );

        // add actions for assets and ajax
        $this->add_actions();
    }

    public function enqueue_block_editor_assets()
    {
        // Make paths variables for DRYness ;)
        $block_path = '/assets/js/editor.block.js';
        $style_path = '/assets/css/block.editor.css';
    
        // Enqueue the bundled block JS file
        wp_enqueue_script(
            $this->namespace . '-block-js',
            _get_plugin_url() . $block_path,
            [ 'wp-i18n', 'wp-element', 'wp-blocks', 'wp-components', 'wp-editor' ],
            filemtime( _get_plugin_directory() . $block_path)
        );
    
        // Enqueue optional editor only styles
        wp_enqueue_style(
            $this->namespace . '-block-editor-css',
            _get_plugin_url() . $style_path,
            [ 'wp-blocks' ],
            filemtime( _get_plugin_directory() . $style_path )
        );
        
        // Setup token security for ajax
        wp_localize_script(
        	$this->namespace . '-block-js',
        	$this->namespace . '_ajax_object',
        	[
        		'ajax_url'  => admin_url( 'admin-ajax.php' ),
        		'security'  => wp_create_nonce( $this->namespace . '-security-token' ),
        	]
        );

        // wp_enqueue_script('add-actions'); // redundant?
    }

    public function add_actions()
    {
        add_action( 'enqueue_block_assets', array( $this, 'enqueue_assets' ) );
        add_action( 'enqueue_block_assets', array( $this, 'enqueue_frontend_assets' ) );

        // ajax
        add_action( 'wp_ajax_gutenbergtemplateblock_get', [ __CLASS__, 'gutenbergtemplateblock_get'] );
        add_action( 'wp_ajax_nopriv_gutenbergtemplateblock_get', [ __CLASS__, 'gutenbergtemplateblock_get'] );

        add_action( 'wp_ajax_gutenbergtemplateblock_getPollQuestions', [ __CLASS__, 'gutenbergtemplateblock_getPollQuestions'] );
        add_action( 'wp_ajax_nopriv_gutenbergtemplateblock_getPollQuestions', [ __CLASS__, 'gutenbergtemplateblock_getPollQuestions'] );

        add_action( 'wp_ajax_gutenbergtemplateblock_getPollAnswersById', [ __CLASS__, 'gutenbergtemplateblock_getPollAnswersById'] );
        add_action( 'wp_ajax_nopriv_gutenbergtemplateblock_getPollAnswersById', [ __CLASS__, 'gutenbergtemplateblock_getPollAnswersById'] );

        add_action( 'wp_ajax_gutenbergtemplateblock_getFirstPollAnswers', [ __CLASS__, 'gutenbergtemplateblock_getFirstPollAnswers'] );
        add_action( 'wp_ajax_nopriv_gutenbergtemplateblock_getFirstPollAnswers', [ __CLASS__, 'gutenbergtemplateblock_getFirstPollAnswers'] );

        add_action( 'wp_ajax_gutenbergtemplateblock_getFirstPollQid', [ __CLASS__, 'gutenbergtemplateblock_getFirstPollQid'] );
        add_action( 'wp_ajax_nopriv_gutenbergtemplateblock_getFirstPollQid', [ __CLASS__, 'gutenbergtemplateblock_getFirstPollQid'] );

        add_action( 'wp_ajax_gutenbergtemplateblock_getPollById', [ __CLASS__, 'gutenbergtemplateblock_getPollById'] );
        add_action( 'wp_ajax_nopriv_gutenbergtemplateblock_getPollById', [ __CLASS__, 'gutenbergtemplateblock_getPollById'] );

        add_action( 'wp_ajax_gutenbergtemplateblock_setOptionVoteById', [ __CLASS__, 'gutenbergtemplateblock_setOptionVoteById'] );
        add_action( 'wp_ajax_nopriv_gutenbergtemplateblock_setOptionVoteById', [ __CLASS__, 'gutenbergtemplateblock_setOptionVoteById'] );
    }
    
    /**
     * Enqueue front end and editor JavaScript and CSS assets.
     */
    public function enqueue_assets()
    {
        $style_path = '/assets/css/block.style.css';
        wp_enqueue_style(
            $this->namespace . '-block',
            _get_plugin_url() . $style_path,
            null,
            filemtime( _get_plugin_directory() . $style_path )
        );
    }
    
    /**
     * Enqueue frontend JavaScript and CSS assets.
     */
    public function enqueue_frontend_assets()
    {
        // If in the backend, bail out.
        if ( is_admin() )
        {
            return;
        }
    
        $block_path = '/assets/js/frontend.block.js';
        wp_enqueue_script(
            $this->namespace . '-block-frontend',
            _get_plugin_url() . $block_path,
            [],
            filemtime( _get_plugin_directory() . $block_path )
        );

        wp_localize_script(
        	$this->namespace . '-block-frontend',
        	$this->namespace . '_ajax_object',
        	[
        		'ajax_url'  => admin_url( 'admin-ajax.php' ),
        		'security'  => wp_create_nonce( $this->namespace . '-security-token' ),
        	]
        );
    
    }

    // ajax actions
    public static function gutenbergtemplateblock_get()
    {
        check_ajax_referer( 'gutenbergtemplateblock-security-token', 'security' );

        // $test = $_REQUEST[ 't' ];
        // echo $test . '<br/>';

        $GTBWPDB = new GutenbergtemplateblockWpdb;
        echo json_encode( $GTBWPDB->get() );
        wp_die();
    }

    public static function gutenbergtemplateblock_getPollQuestions()
    {
        check_ajax_referer( 'gutenbergtemplateblock-security-token', 'security' );

        $GTBWPDB = new GutenbergtemplateblockWpdb;
        // print_r( $GTBWPDB->getPollQuestions() );
        // exit;
        echo json_encode( $GTBWPDB->getAllPollQuestions() );
        wp_die();
    }

    public static function gutenbergtemplateblock_getPollById()
    {
        check_ajax_referer( 'gutenbergtemplateblock-security-token', 'security' );

        $qid = $_REQUEST[ 'qid' ];

        $GTBWPDB = new GutenbergtemplateblockWpdb;
        // print_r( $GTBWPDB->getPollQuestions() );
        // exit;
        echo json_encode( $GTBWPDB->getPollById( $qid ) );
        wp_die();
    }

    public static function gutenbergtemplateblock_getPollAnswersById()
    {
        check_ajax_referer( 'gutenbergtemplateblock-security-token', 'security' );

        $qid = $_REQUEST[ 'qid' ];

        $GTBWPDB = new GutenbergtemplateblockWpdb;
        // print_r( $GTBWPDB->getPollQuestions() );
        // exit;
        echo json_encode( $GTBWPDB->getPollAnswersById( $qid ) );
        wp_die();
    }

    public static function gutenbergtemplateblock_getFirstPollAnswers()
    {
        check_ajax_referer( 'gutenbergtemplateblock-security-token', 'security' );

        $GTBWPDB = new GutenbergtemplateblockWpdb;
        echo json_encode( $GTBWPDB->getFirstPollAnswers() );
        wp_die();
    }

    public static function gutenbergtemplateblock_getFirstPollQid()
    {
        check_ajax_referer( 'gutenbergtemplateblock-security-token', 'security' );

        $GTBWPDB = new GutenbergtemplateblockWpdb;
        echo json_encode( $GTBWPDB->getFirstPollQid() );
        wp_die();
    }

    public static function gutenbergtemplateblock_setOptionVoteById()
    {
        check_ajax_referer( 'gutenbergtemplateblock-security-token', 'security' );

        $oid = $_REQUEST[ 'oid' ];

        $GTBWPDB = new GutenbergtemplateblockWpdb;
        echo json_encode( $GTBWPDB->setOptionVoteById( $oid ) );
        wp_die();
    }
}

new GutenbergtemplateblockEnqueue();