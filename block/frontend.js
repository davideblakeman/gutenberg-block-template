console.log( 'Frontend Block JS' );

window.addEventListener( "load", function() {

    const polls = document.getElementsByClassName( 'wp-block-gutenbergtemplateblock-templateblock' );

    if ( polls.length ) {
        var elements = document.getElementsByClassName( 'potd-vote-btn' );
        let oid = null;
        let uuids = {};
        for ( let poll of polls ) {
            for ( let child of poll.children ) {
                if ( child.className === 'potd-vote-btn' ) {
                    uuids[ poll.attributes.value.nodeValue ] = child.value;
                }
            }
        }
    
        setRotation( uuids );
    
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
    }
});

const setRotation = ( uuids ) => {

    let setRotationUrl = gutenbergtemplateblock_ajax_object.ajax_url +
    '?action=gutenbergtemplateblock_setRotation' +
    '&uuids=' + JSON.stringify( uuids ) +
    '&security=' + gutenbergtemplateblock_ajax_object.security;

    fetch( setRotationUrl )
        .then( response => {
            return response.json();
        })
        .then( 
            ( result ) => {
                const polls = document.getElementsByClassName( 'wp-block-gutenbergtemplateblock-templateblock' );
                for ( let u in uuids ) {
                    for ( let p in polls ) {
                        if ( u === p ) {
                            let el = document.createElement("div");
                            el.innerHTML = result[ u ].trim();
                            p.parentNode.replaceChild( el, p );
                        }
                    }
                }
            },
            ( error ) => {
                console.log( 'error: ' + error );
            }
        )
}

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
                // console.log( 'result: ', result );
                if ( result === 'cookie' || result === 'ipcookie' || result === 'user' ) {
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
