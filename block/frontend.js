console.log( 'Frontend Block JS' );
window.addEventListener( "load", function( event ) {

    // console.log( document.getElementById( 'VoteBtn' ) );
    var elements = document.getElementsByClassName( 'potd-vote-btn' );
    let oid = null;

    for ( let element of elements ) {
        element.addEventListener( 'click', function( event ) {
            console.log( event.target.parentNode.childNodes );
            for ( let el of event.target.parentNode.childNodes ) {
                // console.log( element );
                if ( el.tagName === 'P' && el.firstChild.checked ) {
                    // console.log( el );
                    oid = el.firstChild.value;
                    if ( oid ) {
                        registerVote( oid, event );
                    }
                }
            }
        });
    }
    // document.getElementById( 'VoteBtn' ).addEventListener( 'click', function( event ) {
    //     // console.log( 'VoteBtn clicked' );
    //     // console.log( this );
    //     // console.log( event );
    //     // console.log( this.parentNode.childNodes );
    //     let oid = null;

    //     for ( let node of this.parentNode.childNodes ) {
    //         if ( node.tagName === 'P' && node.firstChild.checked ) {
    //             // console.log( node.firstChild.value )
    //             oid = node.firstChild.value;
    //         }
    //     }

    //     if ( oid ) {
    //         registerVote( oid );
    //     }
    // });
});

const registerVote = ( oid, event ) => {
    console.log( 'registerVote' );
    // console.log( oid )
    // var self = this;
    // console.log( event.parentNode.childNodes );
    // console.log( event );
    let qid = event.target.value;
    // console.log( qid );
    let resultElement = null;
    for ( let element of event.target.parentNode.childNodes ) {
        if ( element.classList.value === 'potd-result' ) {
            resultElement = element;
        }
    }

    let cookieCheckUrl = gutenbergtemplateblock_ajax_object.ajax_url +
                '?action=gutenbergtemplateblock_getLimitByOption' +
                '&security=' + gutenbergtemplateblock_ajax_object.security;

    fetch( cookieCheckUrl )
        .then( response => {
            return response.json();
        })
        .then(
            ( result ) => {
                // console.log( 'result: ', result );
                if ( result === 'cookie' ) {

                    // document.cookie = 'gutenbergtemplateblock=;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT';
                    // document.cookie = 'steamystats.com_cookie_consent_adsense=1;path=/;max-age=31540000';
                    // if ( !document.cookie.indexOf( 'steamystats.com_cookie_consent=1' ) >= 0 )

                    // resultElement.innerHTML = 'Thank you for your vote!';
                } else if ( result === 'ip' ) {
                    // resultElement.innerHTML = 'You have already voted today.';
                } else if ( result === 'both' ) {
                    // resultElement.innerHTML = 'Sorry! We encountered a problem :(';
                } else {

                }
            },
            ( err ) => {
                console.log( 'error: ' + error );
            }
        )

    // let url = gutenbergtemplateblock_ajax_object.ajax_url +
    //             '?action=gutenbergtemplateblock_setOptionVoteById' +
    //             '&oid=' + oid +
    //             '&qid=' + qid +
    //             '&security=' + gutenbergtemplateblock_ajax_object.security;

    // fetch( url )
    //     .then( response => {
    //         return response.json();
    //     })
    //     .then(
    //         ( result ) => {
    //             // console.log('result:');
    //             // console.log( result );
    //             if ( result === 'success' ) {
    //                 resultElement.innerHTML = 'Thank you for your vote!';
    //             } else if ( result === 'alreadyVoted' ) {
    //                 resultElement.innerHTML = 'You have already voted today.';
    //             } else {
    //                 resultElement.innerHTML = 'Sorry! We encountered a problem :(';
    //             }
    //         },
    //         ( err ) => {
    //             console.log( 'error: ' + error );
    //         }
    //     )
};
