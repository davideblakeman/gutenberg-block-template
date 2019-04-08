<?php

namespace Gutenberg\Template_Block;

// use DOMDocument;
// use DOMXPath;
// use WP_Block_Parser_Block;
// use WP_REST_Posts_Controller;

class GutenbergtemplateblockWpdb
{
    public function getFirstPoll()
    {
        global $wpdb;
        $wpdb->show_errors();

        $result = $wpdb->get_results('
            SELECT q.qid, q.question, q.vote_count, o.oid, o.`option`, o.votes 
            FROM ' . $wpdb->gutenbergtemplateblock_questions . ' q 
            JOIN ' . $wpdb->gutenbergtemplateblock_options . ' o ON q.qid = o.qid
            WHERE q.qid = (SELECT MIN(qid) FROM ' . $wpdb->gutenbergtemplateblock_questions . ')
            ORDER BY o.oid DESC'
        );

        return $result;
    }

    public function getPollQuestions()
    {
        global $wpdb;
        $wpdb->show_errors();

        $result = $wpdb->get_results('
            SELECT option_id AS value, option_name AS label
            FROM ' . $wpdb->gutenbergtemplateblock_options
        );

        return $result;
    }

    public function getPollAnswersById( $qid )
    {
        global $wpdb;
        $wpdb->show_errors();

        $results = $wpdb->get_results(
            $wpdb->prepare('
                SELECT q.qid, q.question, q.vote_count, o.oid, o.`option`, o.votes 
                FROM ' . $wpdb->gutenbergtemplateblock_questions . ' q 
                JOIN ' . $wpdb->gutenbergtemplateblock_options . ' o ON q.qid = o.qid
                WHERE q.qid = %d
                ORDER BY o.votes DESC',
                $qid
            )
        );

        // $results = $wpdb->get_results(
        //     $wpdb->prepare('
        //         SELECT oid, qid, `option` 
        //         FROM ' . $wpdb->gutenbergtemplateblock_options . ' 
        //         WHERE qid = %d',
        //         $qid
        //     )
        // );

        return $results;
    }

    public function setPollQuestionById( $qid, $question )
    {
        global $wpdb;
        $wpdb->show_errors();
        $outcome = null;

        if ( $qid === 'new' )
        {
            // INSERT new question
            $wpdb->insert(
                $wpdb->gutenbergtemplateblock_questions, 
                array(
                    'question' => $question
                ),
                array(
                    '%s'
                )
            );

            $outcome = $wpdb->insert_id;
        }
        else
        {
            // UPDATE question text
            $wpdb->query(
                $wpdb->prepare('
                    UPDATE ' . $wpdb->gutenbergtemplateblock_questions . '
                    SET question = %s
                    WHERE qid = %d',
                    $question,
                    $qid
                )
            );

            $outcome = $qid;
        }

        if ( $wpdb->last_error !== '' )
        {
            // $str   = htmlspecialchars( $wpdb->last_result, ENT_QUOTES );
            // $query = htmlspecialchars( $wpdb->last_query, ENT_QUOTES );
    
            // print "<div id='error'>
            // <p class='wpdberror'><strong>WordPress database error:</strong> [$str]<br />
            // <code>$query</code></p>
            // </div>";
            $outcome = 'fail';
            return $outcome;
        }
        else
        {
            return $outcome;
        }
    }

    public function setPollAnswerById( $oid, $qid, $answer )
    {
        global $wpdb;
        $wpdb->show_errors();
        $outcome = 'success';

        if ( $oid === 'new' )
        {
            // INSERT new question
            $wpdb->insert(
                $wpdb->gutenbergtemplateblock_options, 
                array(
                    'qid' => $qid,
                    'option' => $answer
                ),
                array(
                    '%d',
                    '%s'
                )
            );
        }
        else
        {
            // UPDATE question text
            $wpdb->query(
                $wpdb->prepare('
                    UPDATE ' . $wpdb->gutenbergtemplateblock_options . '
                    SET option = %s
                    WHERE oid = %d',
                    $answer,
                    $oid
                )
            );
        }

        if ( $wpdb->last_error !== '' )
        {
            // $str   = htmlspecialchars( $wpdb->last_result, ENT_QUOTES );
            // $query = htmlspecialchars( $wpdb->last_query, ENT_QUOTES );
    
            // print "<div id='error'>
            // <p class='wpdberror'><strong>WordPress database error:</strong> [$str]<br />
            // <code>$query</code></p>
            // </div>";
            $outcome = 'fail';
            return $outcome;
        }
        else
        {
            return $outcome;
        }
    }

    public function getAllPollQuestions()
    {
        global $wpdb;
        $wpdb->show_errors();

        $result = $wpdb->get_results('
            SELECT qid AS value, question AS label
            FROM ' . $wpdb->gutenbergtemplateblock_questions
        );

        return $result;
    }

    private function getAllQids()
    {
        global $wpdb;
        $wpdb->show_errors();

        $result = $wpdb->get_results('
            SELECT qid
            FROM ' . $wpdb->gutenbergtemplateblock_questions . '
            ORDER BY qid ASC'
        );

        return $result;
    }

    public function setOptionVoteById( $oid )
    {
        global $wpdb;
        $wpdb->show_errors();
        $outcome = 'success';

        $wpdb->query(
            $wpdb->prepare('
                UPDATE ' . $wpdb->gutenbergtemplateblock_options . '
                SET votes = votes + 1
                WHERE oid = %d',
                $oid
            )
        );

        if ( $wpdb->last_error !== '' )
        {
            $outcome = 'fail';
        }
        
        return $outcome;
    }

    public function deleteQuestionById( $qid )
    {
        global $wpdb;
        $wpdb->show_errors();
        $outcome = 'success';

        $wpdb->query(
            $wpdb->prepare('
                DELETE FROM ' . $wpdb->gutenbergtemplateblock_questions . '
                WHERE qid = %d',
                $qid
            )
        );

        if ( $wpdb->last_error !== '' )
        {
            $outcome = 'fail';
        } else {
            $outcome = $this->deleteAllAnswersById( $qid );
        }
        
        return $outcome;
    }

    public function deleteAllAnswersById( $qid )
    {
        global $wpdb;
        $wpdb->show_errors();
        $outcome = 'success';

        $wpdb->query(
            $wpdb->prepare('
                DELETE FROM ' . $wpdb->gutenbergtemplateblock_options . '
                WHERE qid = %d',
                $qid
            )
        );

        if ( $wpdb->last_error !== '' )
        {
            $outcome = 'fail';
        }
        
        return $outcome;
    }

    public function deleteAnswerById( $oid ) {
        global $wpdb;
        $wpdb->show_errors();
        $outcome = 'success';

        $wpdb->query(
            $wpdb->prepare('
                DELETE FROM ' . $wpdb->gutenbergtemplateblock_options . '
                WHERE oid = %d',
                $oid
            )
        );

        if ( $wpdb->last_error !== '' )
        {
            $outcome = 'fail';
        }
        
        return $outcome;
    }

    public function getOptions()
    {
        global $wpdb;
        $wpdb->show_errors();

        $result = $wpdb->get_results('
            SELECT option_name, option_value
            FROM ' . $wpdb->options . '
            WHERE option_name LIKE "gutenbergtemplateblock_%"',
            OBJECT_K
        );
        
        return $result;
    }

    public function votedToday( $clientIp, $qid )
    {
        global $wpdb;
        $wpdb->show_errors();

        $userId = is_user_logged_in() ? get_current_user_id() : 0;

        // https://stackoverflow.com/questions/8154564/retrieve-rows-less-than-a-day-old
        if ( get_option( 'gutenbergtemplateblock_limit_by' ) === 'user' )
        {
            $clientIp = '';
            $results = $wpdb->get_results(
                $wpdb->prepare('
                    SELECT lid 
                    FROM ' . $wpdb->gutenbergtemplateblock_iplog . '
                    WHERE `date` > timestampadd(day, -1, NOW())
                    AND userid = %d
                    AND qid = %d',
                    $userId,
                    $qid
                )
            );
        }
        else
        {
            $results = $wpdb->get_results(
                $wpdb->prepare('
                    SELECT lid 
                    FROM ' . $wpdb->gutenbergtemplateblock_iplog . '
                    WHERE `date` > timestampadd(day, -1, NOW())
                    AND ip = %s
                    AND qid = %d',
                    $clientIp,
                    $qid
                )
            );
        }

        if ( empty( $results ) )
        {
            $wpdb->insert(
                $wpdb->gutenbergtemplateblock_iplog, 
                array(
                    'ip' => $clientIp,
                    'qid' => $qid,
                    'userid' => $userId,
                    'date' => current_time( 'mysql' )
                ),
                array(
                    '%s',
                    '%d',
                    '%d',
                    '%s',
                )
            );

            return false;
        }
        else
        {
            return true;
        }
    }

    private function getUUIDExists( $uuid )
    {
        global $wpdb;
        $wpdb->show_errors();
        $outcome = 'success';

        $results = $wpdb->get_results(
            $wpdb->prepare('
                SELECT uuid
                FROM ' . $wpdb->gutenbergtemplateblock_polls . '
                WHERE uuid = %s',
                $uuid
            )
        );

        return count( $results ) > 0 ? true : false;
    }

    public function setPollByUUID( $uuid, $postId = null )
    {
        global $wpdb;
        $wpdb->show_errors();
        $outcome = 'success';

        $userId = is_user_logged_in() ? get_current_user_id() : 0;

        if ( $this->getUUIDExists( $uuid ) )
        {
            $wpdb->query(
                $wpdb->prepare('
                    UPDATE ' . $wpdb->gutenbergtemplateblock_polls . '
                    SET
                        userid = %d,
                        date = ' . date( 'Y-m-d', current_time( 'timestamp' ) ) . ' 00:00:00
                    WHERE uuid = %s',
                    $userId,
                    $uuid
                )
            );
        }
        else
        {
            $wpdb->insert(
                $wpdb->gutenbergtemplateblock_polls, 
                array(
                    'uuid' => $uuid,
                    'userid' => $userId,
                    'postid' => $postId,
                    'date' => date( 'Y-m-d', current_time( 'timestamp' ) ) . ' 00:00:00'
                ),
                array(
                    '%s',
                    '%d',
                    '%s'
                )
            );
        }

        if ( $wpdb->last_error !== '' )
        {
            $outcome = 'fail';
        }
        
        return $outcome;
    }

    public function setRotationByUUIDs( $uuids )
    {
        global $wpdb;
        $wpdb->show_errors();
        $outcome = 'success';

        foreach( $uuids as $uuid => $qid )
        {
            // Check if poll with uuid is older than or equal to 1 day
            $results = $wpdb->get_results(
                $wpdb->prepare('
                    SELECT uuid, postid, `date`
                    FROM ' . $wpdb->gutenbergtemplateblock_polls . '
                    WHERE uuid = %s
                    AND `date` <= timestampadd(day, -1, NOW())',
                    $uuid
                )
            );

            if ( !empty( $results ) )
            {
                $days = round( ( time() - strtotime( $results[0]->date ) ) / ( 60 * 60 * 24 ) );
                $outcome = $this->setRotationByUUID( $uuid, $qid, $results[0]->postid, $days );
            }
        }

        if ( $wpdb->last_error !== '' )
        {
            $outcome = 'fail';
        }

        return $outcome;
    }

    public function setRotationByUUID( $uuid, $qid, $postId, $days )
    {
        // Get next poll question and answers from question table by qid.
        // If last question in table return first question with answers
        $nextPoll = $this->getNextPoll( $qid, $days );
        $postContent = $this->getPostContentByPostId( $postId );
        $blockMatches = [];
        $blockPattern = '/<!-- wp:gutenbergtemplateblock\/templateblock(.*?)<!-- \/wp:gutenbergtemplateblock\/templateblock -->/s';
        preg_match_all( $blockPattern, $postContent, $blockMatches );
        $blockMatchLength = null;
        $blockMatchStart = null;

        foreach( $blockMatches[0] as $match )
        {
            if ( strpos( $match, $uuid ) !== false )
            {
                $blockMatchLength = strlen( $match );
                $blockMatchStart = strpos( $postContent, $match );
            }
        }

        // Create new poll HTML content
        $json = $this->buildJson( $nextPoll, $uuid );

        // TODO: what if json is not valid?
        // if ( !$this->isValidJSON( $jsonMatches[0][0] ) )
        // {
        //     $oucome = 'fail';
        // }

        $html = '<!-- wp:gutenbergtemplateblock/templateblock ';
        $html .= $json;
        $html .= ' -->';

        // TODO: include style values
        // $html .= '<div class="wp-block-gutenbergtemplateblock-templateblock" value="' . $uuid . '"><h2 class="alignwide gutenbergtemplateblock-title" style="color:#000000"></h2><div class="alignwide gutenbergtemplateblock-content" style="color:#000000"></div>' . $nextPoll[0]->question;
        $html .= '<div class="wp-block-gutenbergtemplateblock-templateblock" value="' . $uuid . '">' . $nextPoll[0]->question;
        $options = '';

        foreach( $nextPoll as $o )
        {
            $options .= '<p><input type="radio" name="options" value="' . $o->oid . '"/>' . urldecode( $o->option ) . '</p>';
        }
        
        $html .= $options;
        $html .= '<button class="potd-vote-btn" value="' . $nextPoll[0]->qid . '">Vote!</button><div class="potd-result"></div></div>';
        $html .= '<!-- /wp:gutenbergtemplateblock/templateblock -->';
        $newContent = substr_replace( $postContent, $html, $blockMatchStart, $blockMatchLength );
        $outcome = $this->setPostContentByPostId( $postId, $newContent, $uuid );
        $dateOutcome = $this->setPollDateByUUID( $uuid );

        if ( $outcome === 'success' && $dateOutcome === 'success' )
        {
            return $outcome;
        }
        else
        {
            return 'fail';
        }
    }

    public function getNextPoll( $qid, $days )
    {
        global $wpdb;
        $wpdb->show_errors();
        $outcome = 'success';

        // get all qids as values with sequential keys
        // use modulo % to choose qid depending on days past

        // $allQids = $this->getAllQids();

        // $count = count( $allQids );
        // $modulo = $days % $count;

        // $allQids[$modulo]->qid;

        $results = $wpdb->get_results(
            $wpdb->prepare('
                SELECT q.qid, q.question, q.vote_count, o.oid, o.`option`, o.votes
                FROM ' . $wpdb->gutenbergtemplateblock_questions . ' q
                JOIN ' . $wpdb->gutenbergtemplateblock_options . ' o ON q.qid = o.qid
                WHERE (
                    q.qid = IFNULL(
                        (
                            SELECT MIN(qid) 
                            FROM ' . $wpdb->gutenbergtemplateblock_questions . ' 
                            WHERE qid > %d
                        ),
                        (
                            SELECT MIN(qid)
                            FROM ' . $wpdb->gutenbergtemplateblock_questions . '
                        )
                    )
                )',
                $qid
            )
        );

        return $results;
    }

    private function getPostContentByPostId( $postId )
    {
        global $wpdb;
        $wpdb->show_errors();
        $outcome = 'success';

        $results = $wpdb->get_results(
            $wpdb->prepare('
                SELECT 
                    post_content
                FROM ' . $wpdb->posts . '
                WHERE
                    ID = %d',
                $postId
            )
        );

        return $results[0]->post_content;
    }

    private function setPostContentByPostId( $postId, $postContent, $uuid )
    {
        // Assumes that if passed a postId it already exists in wpdb
        global $wpdb;
        $wpdb->show_errors();
        $outcome = 'success';

        // TODO: update datetime modified fields
        $wpdb->query(
            $wpdb->prepare('
                UPDATE ' . $wpdb->posts . '
                SET post_content = %s
                WHERE ID = %d',
                $postContent,
                $postId
            )
        );

        if ( $wpdb->last_error !== '' )
        {
            $outcome = 'fail';
        }
        else
        {
            $this->setPollByUUID( $uuid, $postId );
        }

        return $outcome;
    }

    private function setPollDateByUUID( $uuid )
    {
        global $wpdb;
        $wpdb->show_errors();
        $outcome = 'success';

        $wpdb->query(
            $wpdb->prepare('
                UPDATE ' . $wpdb->gutenbergtemplateblock_polls . '
                SET `date` = ' . date( 'Y-m-d', current_time( 'timestamp' ) ) . ' 00:00:00
                WHERE uuid = %s',
                $uuid
            )
        );

        if ( $wpdb->last_error !== '' )
        {
            $outcome = 'fail';
        }

        return $outcome;
    }

    private function buildJson( $nextPoll, $uuid )
    {
        $jsonOptions;
        $i = 0;

        foreach( $nextPoll as $option )
        {
            $jsonOptions[ 'poll' ][ $i ] = array(
                array(
                    'type' => 'p',
                    'key' => null,
                    'ref' => null,
                    'props' => array(
                        'children' => array(
                            array(
                                'type' => 'input',
                                'key' => null,
                                'ref' => null,
                                'props' => array(
                                    'type' => 'radio',
                                    'name' => 'options',
                                    'value' => $option->oid
                                ),
                                '_owner' => null
                            ),
                            $option->option
                        )
                    )
                )
            );
            $i++;
        }

        $jsonAttrs = array(
            'pollTitle' => $nextPoll[0]->question,
            'answerQid' => $nextPoll[0]->qid,
            'classes' => 'wp-block-gutenbergtemplateblock-templateblock',
            'uuid' => $uuid
        );

        return json_encode( $json[ 'attrs' ] = array_merge( $jsonOptions, $jsonAttrs ) );
    }

    // HELPERS

    // https://stackoverflow.com/questions/2040240/php-function-to-generate-v4-uuid
    // public function uuidv4()
    // {
    //     $data = openssl_random_pseudo_bytes(16);
    //     assert( strlen( $data ) == 16 );
    
    //     $data[6] = chr( ord( $data[6] ) & 0x0f | 0x40 );
    //     $data[8] = chr( ord( $data[8] ) & 0x3f | 0x80 );
    
    //     return vsprintf( '%s%s-%s-%s-%s-%s%s%s', str_split( bin2hex( $data ), 4 ) );
    // }

    function isValidJSON( $string )
    {
        json_decode( $string );
        return ( json_last_error() == JSON_ERROR_NONE );
    }

    // function array_find_deep( $array, $search, $keys = array() )
    // {
    //     foreach( $array as $key => $value )
    //     {
    //         if ( is_array( $value ) )
    //         {
    //             $sub = array_find_deep( $value, $search, array_merge( $keys, array( $key ) ) );
    //             if ( count( $sub ) )
    //             {
    //                 return $sub;
    //             }
    //         } 
    //         elseif ( $value === $search )
    //         {
    //             return array_merge( $keys, array( $key ) );
    //         }
    //     }

    //     return array();
    // }

    // public function getPollById( $qid )
    // {
    //     global $wpdb;
    //     $wpdb->show_errors();

    //     $result = $wpdb->get_results('
    //         SELECT q.qid, q.question, q.vote_count, o.oid, o.`option`, o.votes 
    //         FROM ' . $wpdb->gutenbergtemplateblock_questions . ' q 
    //         JOIN ' . $wpdb->gutenbergtemplateblock_options . ' o ON q.qid = o.qid
    //         WHERE q.qid = ' . $qid . '
    //         ORDER BY o.votes DESC'
    //     );
        
    //     return $result;
    // }

    // public function setAnswerById( $answers ) {
    //     global $wpdb;
    //     $wpdb->show_errors();
    //     $outcome = 'success';

    //     // UPDATE
    //     $wpdb->query(
    //         $wpdb->prepare( 
    //             "
    //             UPDATE $wpdb->gutenbergtemplateblock_questions 
    //             SET question = %s
    //             WHERE qid = %d
    //             ",
    //             $question,
    //             $qid
    //         )
    //     );

    //     // INSERT
    //     $wpdb->insert( 
    //         $wpdb->gutenbergtemplateblock_options, 
    //         array( 
    //             'qid' => $qid, 
    //             'option' => $v,
    //             'votes' => 0
    //         ), 
    //         array( 
    //             '%d', 
    //             '%s',
    //             '%d'
    //         ) 
    //     );
    // }

    // public function createNewPoll( $question, $answers )
    // {
    //     global $wpdb;
    //     $outcome = 'success';

    //     $wpdb->insert( 
    //         $wpdb->gutenbergtemplateblock_questions, 
    //         array( 
    //             'question' => $question, 
    //             'time_added' => current_time( 'mysql' ),
    //             'added_by_user' => wp_get_current_user(),
    //             'vote_count' => 0,
    //             'active' => 0
    //         ), 
    //         array( 
    //             '%s', 
    //             '%s',
    //             '%d',
    //             '%d',
    //             '%d'
    //         ) 
    //     );

    //     $qid = $wpdb->insert_id;

    //     foreach( $answers as $k => $v )
    //     {
    //         $wpdb->insert( 
    //             $wpdb->gutenbergtemplateblock_options, 
    //             array( 
    //                 'qid' => $qid, 
    //                 'option' => $v,
    //                 'votes' => 0
    //             ), 
    //             array( 
    //                 '%d', 
    //                 '%s',
    //                 '%d'
    //             ) 
    //         );
    //     }

    //     if ( $wpdb->last_error !== '' )
    //     {
    //         $outcome = 'fail';
    //     }
        
    //     return $outcome;
    // }

    // public function getFirstPollAnswers()
    // {
    //     global $wpdb;
    //     $wpdb->show_errors();

    //     $result = $wpdb->get_results('
    //         SELECT oid, qid, `option`
    //         FROM ' . $wpdb->gutenbergtemplateblock_options . '
    //         WHERE qid = (SELECT MIN(qid) FROM ' . $wpdb->gutenbergtemplateblock_questions . ')
    //     ');

    //     return $result;
    // }

    // public function getFirstPollQid()
    // {
    //     global $wpdb;
    //     $wpdb->show_errors();

    //     $result = $wpdb->get_results('
    //         SELECT MIN(qid) as qid
    //         FROM ' . $wpdb->gutenbergtemplateblock_questions
    //     );

    //     return $result;
    // }

    // public function deleteAnswersById( $oids )
    // {
    //     global $wpdb;
    //     $wpdb->show_errors();
    //     $outcome = 'success';
        
    //     foreach( $oids as $o )
    //     {
    //         $wpdb->query(
    //             $wpdb->prepare(
    //                 "DELETE FROM $wpdb->gutenbergtemplateblock_options
    //                 WHERE oid = %d",
    //                 $o
    //             )
    //         );
    //     }

    //     if ( $wpdb->last_error !== '' )
    //     {
    //         $outcome = 'fail';
    //     }
        
    //     return $outcome;
    // }

    // public function getSumOfVotesById( $qid )
    // {
    //     global $wpdb;
    //     $wpdb->show_errors();
        
    //     return $wpdb->get_results(
    //         'SELECT SUM(votes) AS sumofvotes FROM ' . $wpdb->gutenbergtemplateblock_options . ' WHERE qid = ' . $qid
    //     );
    // }

    /* EXAMPLES */

    // public function getOtherDataExample()
    // {
    //     $mydb = new wpdb( 'username', 'password', 'my_database', 'localhost' );

    //     $mydb->query('DELETE FROM external_table WHERE id = 1');

    //     /* Switch to another database with same credentials */
    //     $wpdb->select('my_database');
    // }

    // public function getPotdDataExample()
    // {
    //     $link = mysqli_connect( "localhost", "root", "", "wordpressdb" );
    //     $results = [];

    //     # check connection
    //     if ( mysqli_connect_errno() )
    //     {
    //         printf( "Connect failed: %s\n", mysqli_connect_error() );
    //         exit();
    //     }

    //     $sql = 'SELECT post_content FROM wordpressdb.wp_posts WHERE post_name = "hello-world"';

    //     #echo $sql;
    //     #exit;

    //     if ( $result = mysqli_query( $link, $sql ) )
    //     {
    //         while ( $row = mysqli_fetch_assoc( $result ) )
    //         {
    //             $results = $row[ 'post_content' ];
    //         }

    //         mysqli_free_result( $result );
    //     }

    //     mysqli_close( $link );
    //     #print_r($results[ 'post_content' ]);
    //     return $results;
    // }

    // public function getPotdWpDataExample()
    // {
    //     global $wpdb;
    //     $wpdb->show_errors();
    //     #print_r( $wpdb->queries );

    //     $result = $wpdb->get_results('SELECT post_content FROM ' . $wpdb->posts . ' WHERE post_name = "hello-world"');

    //     #echo '<pre>';
    //     #print_r( $wpdb->queries );

    //     return $result[0]->post_content;
    // }

    // public function postPotdDataExample()
    // {
    //     global $wpdb;
    //     $wpdb->show_errors();
    //     #echo '<pre>';
    //     #print_r( $wpdb->queries );

    //     /*$post_id    = $_POST['post_id'];
    //     $meta_key   = $_POST['meta_key'];
    //     $meta_value = $_POST['meta_value'];*/
        
    //     /*$wpdb->insert(
    //         $wpdb->postmeta,
    //         array(
    //             'post_id'    => $_POST['post_id'],
    //             'meta_key'   => $_POST['meta_key'],
    //             'meta_value' => $_POST['meta_value']
    //         )
    //     );*/

    //     $wpdb->insert(
    //         $wpdb->posts,
    //         array(
    //             'post_content' => 'PotD Description',
    //             'post_title' => 'PotD Title',
    //             'post_status' => 'draft',
    //             'comment_status' => 'closed',
    //             'post_name' => 'potd',
    //             'post_parent' => 0,
    //             'post_status' => 'draft',
    //             'post_type' => 'potd'
    //         )
    //     );
    //     #echo '<pre>';
    //     #print_r($wpdb->post);
    // }

    // public function deletePotdData()
    // {
    //     global $wpdb;
    //     $wpdb->show_errors();

    //     $post_id = $_POST['post_id'];
    //     $key = $_POST['meta_key'];
        
    //     $wpdb->query(
    //         $wpdb->prepare(
    //             "DELETE FROM $wpdb->postmeta
    //             WHERE post_id = %d
    //             AND meta_key = %s",
    //             $post_id,
    //             $key
    //         )
    //     );
    // }

    // function prefix_create_table()
    // {
    //     #during plugin install?
    //     #register_activation_hook( __FILE__, 'prefix_create_table' );

    //     global $wpdb;

    //     $charset_collate = $wpdb->get_charset_collate();

    //     $sql = "CREATE TABLE my_custom_table (
    //         id mediumint(9) NOT NULL AUTO_INCREMENT,
    //         first_name varchar(55) NOT NULL,
    //         last_name varchar(55) NOT NULL,
    //         email varchar(55) NOT NULL,
    //         UNIQUE KEY id (id)
    //     ) $charset_collate;";

    //     if ( ! function_exists( 'dbDelta' ) ) {
    //         require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
    //     }

    //     dbDelta( $sql );
    // }
}