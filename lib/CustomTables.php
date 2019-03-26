<?php

// if ( !defined( 'ABSPATH' ) ) die();

namespace Gutenberg\Template_Block;

class GutenbergtemplateblockCustomTables
{
    public function __construct()
    {
        // print_r( 'here?!' );
        // exit;
        $this->gutenbergtemplateblock_tables_activate();
    }

    function gutenbergtemplateblock_tables_activate()
    {
        $GLOBALS[ 'gutenbergtemplateblock_activated' ] = 1; // ~to work correctly with activate_plugin() function outside of wp-admin~

        // multisite
        if( is_multisite() && count( $sites = ( function_exists( 'get_sites' ) ? get_sites() : wp_get_sites() ) ) > 0 )
        {
            foreach( $sites as $site )
            {
                switch_to_blog( is_array( $site ) ? $site[ 'blog_id' ] : $site->blog_id ); // get_sites of WP 4.6+ return objects ...

                gutenbergtemplateblock_tablesSettings();
            }

            restore_current_blog();
        }
        else
        {
            $this->gutenbergtemplateblock_tablesSettings();
        }
    }

    /*
    * ~Creates tables and settings~
    */
    function gutenbergtemplateblock_tablesSettings()
    {
        global $wpdb;

        #Democracy_Poll::load_textdomain();

        #dem_set_dbtables();
        $this->gutenbergtemplateblock_setTables(); // redefine table names for a multi-site

        // create tables
        require_once ABSPATH . 'wp-admin/includes/upgrade.php';
        #dbDelta( dem_get_db_schema() );
        dbDelta( $this->gutenbergtemplateblock_getDBSchema() );
        #wp_die();
        #exit;

        // Poll example
        if( !$wpdb->get_row( "SELECT * FROM $wpdb->gutenbergtemplateblock_questions LIMIT 1" ) )
        {
            $wpdb->insert( $wpdb->gutenbergtemplateblock_questions, array(
                /*'question'		=> __( 'What is your opinion on advertising on websites?', 'gutenbergtemplateblock' ),*/
                'question'		=> 'What is your opinion on advertising on websites?',
                'time_added'	=> date( 'Y-m-d H:m:s', current_time( 'timestamp' ) ), //current_time( 'mysql' ) gets the hours and minutes wrong
                'end_time'		=> date( 'Y-m-d H:m:s', strtotime( '+1 DAY', current_time( 'timestamp' ) ) ),
                'added_by_user'	=> get_current_user_id(),
                'vote_count'	=> 0,
                'active'		=> 1
            ) );

            $qid = $wpdb->insert_id;

            $options = array(
                /*__( "I actively click on ads for websites I find quality content on", 'gutenbergtemplateblock' ),
                __( "I just click on ads that interest me", 'gutenbergtemplateblock' ),
                __( "I ignore ads", 'gutenbergtemplateblock' ),
                __( "I use an ad blocking plugin to remove ads but only on some sites", 'gutenbergtemplateblock' ),
                __( "I use an ad blocking plugin all the time", 'gutenbergtemplateblock' ),
                __( "I hate ads and don't stay long on sites that have them", 'gutenbergtemplateblock' ),
                __( "I don't have an opinion on ads", 'gutenbergtemplateblock' )*/
                "I actively click on ads for websites I find quality content on",
                "I just click on ads that interest me",
                "I ignore ads",
                "I use an ad blocking plugin to remove ads but only on some sites",
                "I use an ad blocking plugin all the time",
                "I hate ads and don't stay long on sites that have them",
                "I don't have an opinion on ads"
            );

            // create votes
            $totalVotes = 0;
            foreach( $options as $o )
            {
                $totalVotes += $votes = rand( 0, 100 );
                $wpdb->insert( $wpdb->gutenbergtemplateblock_options, array( 'votes' => $votes, 'qid' => $qid, 'option' => $o ) );
            }

            // 'vote_count' update
            $wpdb->update( $wpdb->gutenbergtemplateblock_questions, array( 'vote_count' => $totalVotes ), array( 'qid' => $qid ) );
        }

        // add options, if needed
        /*if( ! get_option(Democracy_Poll::OPT_NAME) )
            Democracy_Poll::init()->update_options('default');*/

        // upgrade
        #dem_last_version_up();
    }

    function gutenbergtemplateblock_setTables()
    {
        global $wpdb;
        $wpdb->gutenbergtemplateblock_questions = $wpdb->prefix .'gutenbergtemplateblock_questions';
        $wpdb->gutenbergtemplateblock_options = $wpdb->prefix .'gutenbergtemplateblock_options';
        $wpdb->gutenbergtemplateblock_iplog = $wpdb->prefix .'gutenbergtemplateblock_iplog';
        $wpdb->gutenbergtemplateblock_polls = $wpdb->prefix .'gutenbergtemplateblock_polls';
    }

    /**
     * ~get database table schemas~
     */
    function gutenbergtemplateblock_getDBSchema()
    {
        global $wpdb;

        $charset_collate = '';

        if ( !empty( $wpdb->charset ) )
        {
            $charset_collate = 'DEFAULT CHARACTER SET ' . $wpdb->charset;
        }
            
        if ( !empty( $wpdb->collate ) )
        {
            $charset_collate .= ' COLLATE ' . $wpdb->collate;
        }

        return "
            CREATE TABLE $wpdb->gutenbergtemplateblock_questions (
                qid           BIGINT(20) unsigned NOT NULL auto_increment,
                question      LONGTEXT            NOT NULL default '',
                time_added    DATETIME            NOT NULL default '0000-00-00 00:00:00',
                end_time      DATETIME            NOT NULL default '0000-00-00 00:00:00',
                added_by_user BIGINT(20) unsigned NOT NULL default 0,
                vote_count    BIGINT(20) unsigned NOT NULL default 0,
                active        TINYINT(1) unsigned NOT NULL default 0,
                PRIMARY KEY  (qid),
                KEY active (active)
            ) $charset_collate;

            CREATE TABLE $wpdb->gutenbergtemplateblock_options (
                oid    BIGINT(20) unsigned NOT NULL auto_increment,
                qid    BIGINT(20) unsigned NOT NULL default 0,
                option LONGTEXT            NOT NULL default '',
                votes  BIGINT(20) unsigned NOT NULL default 0,
                PRIMARY KEY  (oid),
                KEY qid (qid)
            ) $charset_collate;

            CREATE TABLE $wpdb->gutenbergtemplateblock_iplog (
                lid      BIGINT(20)   unsigned NOT NULL auto_increment,
                ip       VARCHAR(45)           NOT NULL default '',
                qid      BIGINT(20)   unsigned NOT NULL default 0,
                userid   BIGINT(20)   unsigned NOT NULL default 0,
                date     DATETIME              NOT NULL default '0000-00-00 00:00:00',
                PRIMARY KEY  (lid),
                KEY ip (ip,qid),
                KEY qid (qid),
                KEY userid (userid)
            ) $charset_collate;

            CREATE TABLE $wpdb->gutenbergtemplateblock_polls (
                pid      BIGINT(20)   unsigned NOT NULL auto_increment,
                uuid     VARCHAR(36)           NOT NULL default '',
                userid   BIGINT(20)   unsigned NOT NULL default 0,
                postid   BIGINT(20)   unsigned NOT NULL default 0,
                date     DATETIME              NOT NULL default '0000-00-00 00:00:00',
                PRIMARY KEY  (pid),
                KEY uuid (uuid),
                KEY userid (userid),
                KEY date (date)
            ) $charset_collate;
        ";
    }
}

new GutenbergtemplateblockCustomTables();