console.log( 'Frontend Block JS' );
window.addEventListener( "load", function( event ) {

    var elements = document.getElementsByClassName( 'potd-vote-btn' );
    let oid = null;

    for ( let element of elements ) {
        element.addEventListener( 'click', function( event ) {
            for ( let el of event.target.parentNode.childNodes ) {
                if ( el.tagName === 'P' && el.firstChild.checked ) {
                    oid = el.firstChild.value;
                    if ( oid ) {
                        registerVote( oid, event );
                    }
                }
            }
        });
    }
});

const registerVote = ( oid, event ) => {
    let qid = event.target.value;
    let resultElement = null;
    for ( let element of event.target.parentNode.childNodes ) {
        if ( element.classList.value === 'potd-result' ) {
            resultElement = element;
        }
    }

    let limitByCheckUrl = gutenbergtemplateblock_ajax_object.ajax_url +
                '?action=gutenbergtemplateblock_getLimitByOption' +
                '&security=' + gutenbergtemplateblock_ajax_object.security;

    fetch( limitByCheckUrl )
        .then( response => {
            return response.json();
        })
        .then(
            ( result ) => {
                console.log( 'result: ', result );
                if ( result === 'cookie' || result === 'ipcookie' || result === 'user' ) {

                    // document.cookie = 'gutenbergtemplateblock=;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT';
                    // document.cookie = 'steamystats.com_cookie_consent_adsense=1;path=/;max-age=31540000';
                    // if ( !document.cookie.indexOf( 'steamystats.com_cookie_consent=1' ) >= 0 )

                    // console.log( !document.cookie.indexOf( 'gutenbergtemplateblock_limit_cookie=1' ) >= 0 );
                    // console.log( document.cookie.indexOf( 'gutenbergtemplateblock_limit_cookie=1' ) > -1 );
                    let liveCookie = document.cookie.indexOf( 'gutenbergtemplateblock_limit_cookie=1' ) > -1;

                    if ( result === 'user' ) {
                        vote( oid, qid, resultElement );
                    } else if ( !liveCookie ) {
                        vote( oid, qid, resultElement );
                        document.cookie = 'gutenbergtemplateblock_limit_cookie=1;path=/;max-age=86400'; // 1 day cookie
                    } else {
                        resultElement.innerHTML = 'You have already voted today.';
                    }
                } else {
                    vote( oid, qid, resultElement );
                }
            },
            ( error ) => {
                console.log( 'error: ' + error );
            }
        )
};

const vote = ( oid, qid, resultElement ) => {
    // console.log( 'vote' );
    let url = gutenbergtemplateblock_ajax_object.ajax_url +
                '?action=gutenbergtemplateblock_setOptionVoteById' +
                '&oid=' + oid +
                '&qid=' + qid +
                '&security=' + gutenbergtemplateblock_ajax_object.security;

    fetch( url )
        .then( response => {
            return response.json();
        })
        .then(
            ( result ) => {
                if ( result === 'success' ) {
                    resultElement.innerHTML = 'Thank you for your vote!';
                } else if ( result === 'alreadyVoted' ) {
                    resultElement.innerHTML = 'You have already voted today.';
                } else if ( result === 'notLoggedIn' ) {
                    resultElement.innerHTML = 'You have to login to vote.';
                } else {
                    resultElement.innerHTML = 'Sorry! We encountered a problem :(';
                }
            },
            ( error ) => {
                console.log( 'error: ' + error );
            }
        )
}
