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

        // add custom plugin options on first initialisation
        $this->add_plugin_options();
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

        // AJAX - Editor
        add_action( 'wp_ajax_gutenbergtemplateblock_getFirstPoll', [ __CLASS__, 'gutenbergtemplateblock_getFirstPoll'] );
        add_action( 'wp_ajax_gutenbergtemplateblock_getPollQuestions', [ __CLASS__, 'gutenbergtemplateblock_getPollQuestions'] );
        add_action( 'wp_ajax_gutenbergtemplateblock_getPollAnswersById', [ __CLASS__, 'gutenbergtemplateblock_getPollAnswersById'] );
        add_action( 'wp_ajax_gutenbergtemplateblock_setPollQuestionById', [ __CLASS__, 'gutenbergtemplateblock_setPollQuestionById'] );
        add_action( 'wp_ajax_gutenbergtemplateblock_setPollAnswerById', [ __CLASS__, 'gutenbergtemplateblock_setPollAnswerById'] );
        add_action( 'wp_ajax_gutenbergtemplateblock_deleteQuestionById', [ __CLASS__, 'gutenbergtemplateblock_deleteQuestionById'] );
        add_action( 'wp_ajax_gutenbergtemplateblock_deleteAnswerById', [ __CLASS__, 'gutenbergtemplateblock_deleteAnswerById'] );
        add_action( 'wp_ajax_gutenbergtemplateblock_getOptions', [ __CLASS__, 'gutenbergtemplateblock_getOptions'] );
        add_action( 'wp_ajax_gutenbergtemplateblock_setOption_limit_by', [ __CLASS__, 'gutenbergtemplateblock_setOption_limit_by'] );
        add_action( 'wp_ajax_gutenbergtemplateblock_setOption_rotate_daily', [ __CLASS__, 'gutenbergtemplateblock_setOption_rotate_daily'] );

        // AJAX - No Privilege - Frontend
        add_action( 'wp_ajax_gutenbergtemplateblock_setOptionVoteById', [ __CLASS__, 'gutenbergtemplateblock_setOptionVoteById'] );
        add_action( 'wp_ajax_nopriv_gutenbergtemplateblock_setOptionVoteById', [ __CLASS__, 'gutenbergtemplateblock_setOptionVoteById'] );
    }

    public function add_plugin_options ()
    {
        if ( get_option( 'gutenbergtemplateblock_init' ) !== 'init-true' )
        {
            add_option( 'gutenbergtemplateblock_init', 'init-true' );
            add_option( 'gutenbergtemplateblock_limit_by', 'false' );
            add_option( 'gutenbergtemplateblock_cloudflare_ip_detect', 'false' );
            add_option( 'gutenbergtemplateblock_rotate_daily', 'false' );
            // add_option( 'gutenbergtemplateblock_change', 'false' );
            add_option( 'gutenbergtemplateblock_style', '1' );
            add_option( 'gutenbergtemplateblock_origindate', time() );
            add_option( 'gutenbergtemplateblock_starttime', '00:00' );

            // init
            // limit_by_cookie
            // cloudflare_ip_detect
            // change
            // style
            // origindate
            // starttime
        }
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

    // Admin AJAX

    public static function gutenbergtemplateblock_getFirstPoll()
    {
        check_ajax_referer( 'gutenbergtemplateblock-security-token', 'security' );

        $GTBWPDB = new GutenbergtemplateblockWpdb;
        echo json_encode( $GTBWPDB->getFirstPoll() );
        wp_die();
    }

    public static function gutenbergtemplateblock_getPollQuestions()
    {
        check_ajax_referer( 'gutenbergtemplateblock-security-token', 'security' );

        $GTBWPDB = new GutenbergtemplateblockWpdb;
        echo json_encode( $GTBWPDB->getAllPollQuestions() );
        wp_die();
    }

    public static function gutenbergtemplateblock_getPollAnswersById()
    {
        check_ajax_referer( 'gutenbergtemplateblock-security-token', 'security' );

        $qid = $_REQUEST[ 'qid' ];

        $GTBWPDB = new GutenbergtemplateblockWpdb;
        echo json_encode( $GTBWPDB->getPollAnswersById( $qid ) );
        wp_die();
    }

    public static function gutenbergtemplateblock_setPollQuestionById()
    {
        check_ajax_referer( 'gutenbergtemplateblock-security-token', 'security' );

        $qid = $_REQUEST[ 'qid' ];
        $question = $_REQUEST[ 'q' ];
        
        $GTBWPDB = new GutenbergtemplateblockWpdb;
        echo json_encode( $GTBWPDB->setPollQuestionById( $qid, $question ) );
        wp_die();
    }

    public static function gutenbergtemplateblock_setPollAnswerById()
    {
        check_ajax_referer( 'gutenbergtemplateblock-security-token', 'security' );

        $oid = $_REQUEST[ 'oid' ];
        $qid = $_REQUEST[ 'qid' ];
        $answer = $_REQUEST[ 'a' ];
        
        $GTBWPDB = new GutenbergtemplateblockWpdb;
        echo json_encode( $GTBWPDB->setPollAnswerById( $oid, $qid, $answer ) );
        wp_die();
    }

    public static function gutenbergtemplateblock_deleteQuestionById()
    {
        check_ajax_referer( 'gutenbergtemplateblock-security-token', 'security' );

        $qid = $_REQUEST[ 'qid' ];
        
        $GTBWPDB = new GutenbergtemplateblockWpdb;
        echo json_encode( $GTBWPDB->deleteQuestionById( $qid ) );
        wp_die();
    }

    public static function gutenbergtemplateblock_deleteAnswerById()
    {
        check_ajax_referer( 'gutenbergtemplateblock-security-token', 'security' );

        $oid = $_REQUEST[ 'oid' ];
        
        $GTBWPDB = new GutenbergtemplateblockWpdb;
        echo json_encode( $GTBWPDB->deleteAnswerById( $oid ) );
        wp_die();
    }

    public static function gutenbergtemplateblock_getOptions()
    {
        check_ajax_referer( 'gutenbergtemplateblock-security-token', 'security' );

        // $oid = $_REQUEST[ 'oid' ];
        
        $GTBWPDB = new GutenbergtemplateblockWpdb;
        echo json_encode( $GTBWPDB->getOptions() );
        wp_die();
    }

    public static function gutenbergtemplateblock_setOption_limit_by()
    {
        check_ajax_referer( 'gutenbergtemplateblock-security-token', 'security' );

        $value = $_REQUEST[ 'v' ];
        $validOptions = [
            'ip',
            'cookie',
            'both',
            'none'
        ];
        $success = 'fail';

        if ( in_array( $value, $validOptions ) )
        {
            $success = update_option( 'gutenbergtemplateblock_limit_by', $value ) ? 'success' : 'fail';
        }

        echo json_encode( $success );
        wp_die();
    }

    public static function gutenbergtemplateblock_setOption_rotate_daily()
    {
        check_ajax_referer( 'gutenbergtemplateblock-security-token', 'security' );

        $value = $_REQUEST[ 'v' ];
        $success = 'fail';

        if ( $value === 'true' || $value === 'false' )
        {
            $success = update_option( 'gutenbergtemplateblock_rotate_daily', $value ) ? 'success' : 'fail';
        }

        echo json_encode( $success );
        wp_die();
    }

    // Public AJAX

    public static function gutenbergtemplateblock_setOptionVoteById()
    {
        // var_dump($_SERVER[ 'REMOTE_ADDR' ]);
        // exit;
        check_ajax_referer( 'gutenbergtemplateblock-security-token', 'security' );

        // Need to add Cloudflare support for obtaining IP addresses
        $clientIp = self::getIp();
        // var_dump( $clientIp );
        $GTBWPDB = new GutenbergtemplateblockWpdb;

        var_dump( $GTBWPDB->votedToday( $clientIp ) );

        // if ( !$GTBWPDB->votedToday( $clientIp ) )
        // {
        //     $oid = $_REQUEST[ 'oid' ];
            
        //     echo json_encode( $GTBWPDB->setOptionVoteById( $oid ) );
        // }

        wp_die();
    }

    public static function getIp()
    {
        $ip = '';

        if ( get_option( 'gutenbergtemplateblock_cloudflare_support' ) === 'true' )
        {
			// Cloudflare IP support
            $ip = isset( $_SERVER[ 'HTTP_CF_CONNECTING_IP' ] ) ? $_SERVER[ 'HTTP_CF_CONNECTING_IP' ] : '';
            
            if ( !filter_var( $ip, FILTER_VALIDATE_IP ) )
            {
                $ip = isset( $_SERVER[ 'HTTP_CLIENT_IP' ] ) ? $_SERVER[ 'HTTP_CLIENT_IP' ] : '';
            } 

            if ( !filter_var( $ip, FILTER_VALIDATE_IP ) )
            {
                $ip = isset( $_SERVER[ 'HTTP_X_FORWARDED_FOR' ] ) ? $_SERVER[ 'HTTP_X_FORWARDED_FOR' ] : '';
            }
            
            if ( !filter_var( $ip, FILTER_VALIDATE_IP ) )
            {
                $ip = isset( $_SERVER[ 'REMOTE_ADDR' ] ) ? $_SERVER[ 'REMOTE_ADDR' ] : '';
            }
		}
        else
        {
            $ip = isset( $_SERVER[ 'REMOTE_ADDR' ] ) ? $_SERVER[ 'REMOTE_ADDR' ] : '';
        }
        
        $ip = $ip === '::1' ? '127.0.0.1' : $ip;

		if( !filter_var( $ip, FILTER_VALIDATE_IP ) ) $ip = 'no_IP__'. rand(1,999999);

		return $ip;
    }

    // public static function gutenbergtemplateblock_getPollById()
    // {
    //     check_ajax_referer( 'gutenbergtemplateblock-security-token', 'security' );

    //     $qid = $_REQUEST[ 'qid' ];

    //     $GTBWPDB = new GutenbergtemplateblockWpdb;
    //     echo json_encode( $GTBWPDB->getPollById( $qid ) );
    //     wp_die();
    // }

    // public static function gutenbergtemplateblock_getFirstPollAnswers()
    // {
    //     check_ajax_referer( 'gutenbergtemplateblock-security-token', 'security' );

    //     $GTBWPDB = new GutenbergtemplateblockWpdb;
    //     echo json_encode( $GTBWPDB->getFirstPollAnswers() );
    //     wp_die();
    // }

    // public static function gutenbergtemplateblock_getFirstPollQid()
    // {
    //     check_ajax_referer( 'gutenbergtemplateblock-security-token', 'security' );

    //     $GTBWPDB = new GutenbergtemplateblockWpdb;
    //     echo json_encode( $GTBWPDB->getFirstPollQid() );
    //     wp_die();
    // }
}

new GutenbergtemplateblockEnqueue();