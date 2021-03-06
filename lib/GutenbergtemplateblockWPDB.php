<?php

namespace Gutenberg\Template_Block;

class GutenbergtemplateblockWpdb
{
    public function getFirstPoll()
    {
        global $wpdb;
        $wpdb->show_errors();

        $result = $wpdb->get_results('
            SELECT q.qid, q.question, q.vote_count, o.oid, o.`option`, o.votes, o.optionorder
            FROM ' . $wpdb->gutenbergtemplateblock_questions . ' q 
            JOIN ' . $wpdb->gutenbergtemplateblock_options . ' o ON q.qid = o.qid
            WHERE q.qid = (SELECT MIN(qid) FROM ' . $wpdb->gutenbergtemplateblock_questions . ')
            ORDER BY o.optionorder ASC'
        );

        return $result;
    }

    public function getPollById( $qid )
    {
        global $wpdb;
        $wpdb->show_errors();

        $result = $wpdb->get_results(
            $wpdb->prepare('
                SELECT q.qid, q.question, q.vote_count, o.oid, o.`option`, o.votes, o.optionorder
                FROM ' . $wpdb->gutenbergtemplateblock_questions . ' q 
                JOIN ' . $wpdb->gutenbergtemplateblock_options . ' o ON q.qid = o.qid
                WHERE q.qid = %d
                ORDER BY o.optionorder ASC',
                $qid
            )
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
                SELECT q.qid, q.question, q.vote_count, o.oid, o.`option`, o.votes, o.optionorder
                FROM ' . $wpdb->gutenbergtemplateblock_questions . ' q 
                JOIN ' . $wpdb->gutenbergtemplateblock_options . ' o ON q.qid = o.qid
                WHERE q.qid = %d
                ORDER BY o.optionorder ASC',
                $qid
            )
        );

        return $results;
    }

    public function setPollQuestionById( $qid, $question )
    {
        global $wpdb;
        $wpdb->show_errors();
        $outcome = null;
        
        $userId = is_user_logged_in() ? get_current_user_id() : 0;

        if ( $qid === 'new' )
        {
            // INSERT new question
            $wpdb->insert(
                $wpdb->gutenbergtemplateblock_questions, 
                array(
                    'question' => $question,
                    'added_by_user' => $userId
                ),
                array(
                    '%s',
                    '%d'
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
                    SET 
                        question = %s,
                        added_by_user = %d
                    WHERE qid = %d',
                    $question,
                    $userId,
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

    public function setPollAnswerById( $oid, $qid, $answer, $order )
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
                    'option' => urldecode( $answer ),
                    'optionorder' => $order
                ),
                array(
                    '%d',
                    '%s',
                    '%d'
                )
            );
        }
        else
        {
            // UPDATE question text
            $wpdb->query(
                $wpdb->prepare('
                    UPDATE ' . $wpdb->gutenbergtemplateblock_options . '
                    SET 
                        option = %s,
                        optionorder = %d
                    WHERE oid = %d',
                    urldecode( $answer ),
                    $order,
                    $oid
                )
            );
        }

        if ( $wpdb->last_error !== '' )
        {
            $outcome = 'fail';
        }
        
        return $outcome;
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
            ORDER BY qid ASC',
            ARRAY_A
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
        }
        else
        {
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

    public function deleteAnswerById( $oid )
    {
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

        if ( $wpdb->last_error !== '' )
        {
            return 'fail';
        }
        
        return $result;
    }

    public function getStyleOptions()
    {
        global $wpdb;
        $wpdb->show_errors();

        $result = $wpdb->get_results('
            SELECT option_name, option_value
            FROM ' . $wpdb->options . '
            WHERE option_name LIKE "gutenbergtemplateblock_style"',
            OBJECT_K
        );

        if ( $wpdb->last_error !== '' )
        {
            return 'fail';
        }
        
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
                        `date` = "' . date( 'Y-m-d', current_time( 'timestamp' ) ) . ' 00:00:00"
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
        $html = [];

        foreach( $uuids as $uuid => $qid )
        {
            // Check if poll with uuid is older than or equal to 1 day
            // and if it is set to rotate
            $results = $wpdb->get_results(
                $wpdb->prepare('
                    SELECT 
                        uuid, 
                        postid, 
                        `date`
                    FROM ' . $wpdb->gutenbergtemplateblock_polls . '
                    WHERE 
                        uuid = %s
                        AND `date` <= timestampadd(day, -1, NOW())
                        AND rotate = "true"',
                    $uuid
                )
            );

            if ( !empty( $results ) )
            {
                $days = intval( floor( ( time() - strtotime( $results[0]->date ) ) / ( 60 * 60 * 24 ) ) );
                $outcome = $this->setRotationByUUID( $uuid, $qid, $results[0]->postid, $days );

                if ( $outcome !== 'fail' )
                {
                    $html[ $uuid ] = $outcome;
                }
            }
        }

        if ( $wpdb->last_error !== '' )
        {
            return 'fail';
        }

        return $html;
    }

    public function setRotationByUUID( $uuid, $qid, $postId, $days )
    {
        // Get next poll question and answers from question table by qid.
        // If last question in table return first question with answers
        
        $nextPoll = $this->getNextPoll( $qid, $days );
        $html = '';

        if ( !empty( $nextPoll ) )
        {
            $postContent = $this->getPostContentByPostId( $postId );
            $blockMatches = [];
            $blockPattern = '/<!-- wp:gutenbergtemplateblock\/templateblock(.*?)<!-- \/wp:gutenbergtemplateblock\/templateblock -->/s';
            preg_match_all( $blockPattern, $postContent, $blockMatches );
            $blockMatchLength = null;
            $blockMatchStart = null;
    
            foreach( $blockMatches[0] as $match )
            {
                if ( strpos( $match, $uuid ) )
                {
                    $blockMatchLength = strlen( $match );
                    $blockMatchStart = strpos( $postContent, $match );
                }
            }
    
            // TODO: include style values
            // Create new post_content content
            $json = $this->buildJson( $nextPoll, $uuid );
            $replacementContent = '<!-- wp:gutenbergtemplateblock/templateblock ';
            $replacementContent .= $json;
            $replacementContent .= ' -->';
            $html = '<div class="wp-block-gutenbergtemplateblock-templateblock" value="' . $uuid . '"><h3>' . $nextPoll[0]->question . '</h3>';
            $options = '';
    
            foreach( $nextPoll as $o )
            {
                $options .= '<p><input type="radio" name="options" value="' . $o->oid . '"/>' . stripslashes( $o->option ) . '</p>';
            }
            
            $html .= $options;
            $html .= '<button class="potd-vote-btn" value="' . $nextPoll[0]->qid . '">Vote!</button><div class="potd-result"></div></div>';
            $replacementContent .= $html;
            $replacementContent .= '<!-- /wp:gutenbergtemplateblock/templateblock -->';
            $newContent = substr_replace( $postContent, $replacementContent, $blockMatchStart, $blockMatchLength );
            $outcome = $this->setPostContentByPostId( $postId, $newContent, $uuid );
            $dateOutcome = $this->setPollDateByUUID( $uuid );

            if ( $outcome === 'success' && $dateOutcome === 'success' )
            {
                return $html;
            }
            else
            {
                return 'fail';
            }
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
        // plus offset by qid key value

        $allQids = $this->getAllQids();
        $pollCount = count( $allQids );
        $i = 0;

        foreach ( $allQids as $k => $q )
        {
            if ( $q[ 'qid' ] == $qid )
            {
                $i = $k;
            }
        }

        $offset = $days + $i;
        $modulo = $offset % $pollCount;
        $nextQid = intval( $allQids[ $modulo ][ 'qid' ] );

        return $this->getPollById( $nextQid );
    }

    private function getPostContentByPostId( $postId )
    {
        global $wpdb;
        $wpdb->show_errors();

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

        if ( $wpdb->last_error !== '' )
        {
            return 'fail';
        }

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
            $outcome = $this->setPollByUUID( $uuid, $postId );
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
                SET `date` = "' . date( 'Y-m-d', current_time( 'timestamp' ) ) . ' 00:00:00"
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
                            stripslashes( $option->option )
                        )
                    )
                )
            );
            $i++;
        }

        $jsonAttrs = array(
            'pollTitle' => $nextPoll[0]->question,
            'answersQid' => $nextPoll[0]->qid,
            'classes' => 'wp-block-gutenbergtemplateblock-templateblock',
            'uuid' => $uuid
        );

        return json_encode( $json[ 'attrs' ] = array_merge( $jsonOptions, $jsonAttrs ) );
    }

    public function getRotateOptionByUUID( $uuid )
    {
        global $wpdb;
        $wpdb->show_errors();

        $results = $wpdb->get_results(
            $wpdb->prepare('
                SELECT 
                    rotate
                FROM ' . $wpdb->gutenbergtemplateblock_polls . '
                WHERE
                    uuid = %s',
                $uuid
            )
        );

        if ( $wpdb->last_error !== '' )
        {
            return 'fail';
        }

        return $results[0]->rotate;
    }

    public function setRotateOptionByUUID( $uuid, $rotate, $postId )
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
                        rotate = %s
                    WHERE uuid = %s',
                    $rotate,
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
                    'date' => date( 'Y-m-d', current_time( 'timestamp' ) ) . ' 00:00:00',
                    'rotate' => $rotate
                ),
                array(
                    '%s',
                    '%d',
                    '%d',
                    '%s',
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

    public function getResultsByQid( $qid )
    {
        global $wpdb;
        $wpdb->show_errors();

        $results = $wpdb->get_results(
            $wpdb->prepare('
                SELECT 
                    option,
                    votes
                FROM ' . $wpdb->gutenbergtemplateblock_options . '
                WHERE qid = %d
                ORDER BY votes DESC, option ASC',
                $qid
            )
        );

        if ( $wpdb->last_error !== '' )
        {
            return 'fail';
        }

        return $results;
    }

    // HELPERS

    function isValidJSON( $string )
    {
        json_decode( $string );
        return ( json_last_error() == JSON_ERROR_NONE );
    }

    // https://stackoverflow.com/questions/2040240/php-function-to-generate-v4-uuid
    // public function uuidv4()
    // {
    //     $data = openssl_random_pseudo_bytes(16);
    //     assert( strlen( $data ) == 16 );
    
    //     $data[6] = chr( ord( $data[6] ) & 0x0f | 0x40 );
    //     $data[8] = chr( ord( $data[8] ) & 0x3f | 0x80 );
    
    //     return vsprintf( '%s%s-%s-%s-%s-%s%s%s', str_split( bin2hex( $data ), 4 ) );
    // }

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
}