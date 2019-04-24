console.log( 'Frontend Block JS' );

window.addEventListener( "load", function() {

    const polls = document.getElementsByClassName( 'wp-block-gutenbergtemplateblock-templateblock' );

    if ( polls.length ) {
        handleVoteClick();
        handleResultClick();
        setRotation( polls );
    }
});

const handleVoteClick = () => {
    
    var elements = document.getElementsByClassName( 'potd-vote-btn' );
    let oid = null;

    for ( let element of elements ) {
        element.addEventListener( 'click', ( event ) => {
            for ( let el of event.target.parentNode.parentNode.childNodes ) {
                if ( el.tagName === 'P' && el.firstChild.children[0].checked ) {
                    oid = el.firstChild.children[0].value;
                    if ( oid ) {
                        setVote( oid, event );
                        return;
                    }
                }
            }
        });
    }
}

const handleResultClick = () => {
    
    var elements = document.getElementsByClassName( 'potd-results-btn' );

    for ( let element of elements ) {
        element.addEventListener( 'click', ( event ) => {
            // console.log( 'uuid', event.target.parentNode.parentNode.attributes.value.nodeValue );
            const uuid = event.target.parentNode.parentNode.attributes.value.nodeValue;
            const qid = event.target.attributes.value.nodeValue;
            getResultsByQid( uuid, qid );
        });
    }
}

const getResultsByQid = ( uuid, qid ) => {

    let url = gutenbergtemplateblock_ajax_object.ajax_url +
        '?action=gutenbergtemplateblock_getResultsByQid' +
        '&qid=' + qid +
        '&security=' + gutenbergtemplateblock_ajax_object.security;

    fetch( url )
        .then( response => {
            return response.json();
        })
        .then( 
            ( result ) => {
                const polls = document.getElementsByClassName( 'wp-block-gutenbergtemplateblock-templateblock' );
                let html = '<table class="potd-result"><tbody>';
                let max = 0;

                for ( let r of result ) {
                    max = r.votes > max ? parseInt( r.votes ) : max;
                }

                for ( let r of result ) {
                    html += '<tr>' + 
                        '<td>' + decodeURIComponent( stripslashes( r.option ) ) + '</td>' +
                        '<td><meter value="' + r.votes + '" min="0" max="' + max + '">' + r.votes + '</meter>' +
                    '</tr>';
                }

                html += '</tbody></table>';

                for ( let p of polls ) {
                    if ( uuid === p.attributes.value.nodeValue ) {
                        let el = document.createElement( 'div' );
                        el.innerHTML = html;
                        const resultEl = p.querySelector( '.potd-result' );

                        if ( !resultEl.classList.contains( 'active' ) ) {
                            resultEl.classList.add( 'active' );
                        } else {
                            resultEl.classList.remove( 'active' );
                        }

                        // console.log( 'resultEl.classList', resultEl.classList );
                        // console.log( resultEl );

                        p.replaceChild( el.firstChild, resultEl );

                        // console.log( p );

                        // let ele = document.getElementsByClassName( 'potd-result' );
                        // console.log( 'ele', ele );
                        // ele.classList.add( 'active' );

                        // console.log( 'resultEl.style.display', resultEl.style );
                        // let style = window.getComputedStyle( resultEl );
                        // console.log( 'style', style.display === 'block' );
                        // if ( resultEl.style.display === 'block' ) {
                        //     resultEl.style.display = 'none';
                        // } else {
                        //     resultEl.style.display = 'block';
                        // }
                    }
                }
            },
            ( error ) => {
                console.log( 'error: ' + error );
            }
        )
}

const setRotation = ( polls ) => {

    let uuids = {};

    for ( let poll of polls ) {
        for ( let child of poll.children ) {
            if ( child.className === 'potd-vote-btn' ) {
                uuids[ poll.attributes.value.nodeValue ] = child.value;
            }
        }
    }

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
                if ( Object.keys( result ).length ) {
                    const polls = document.getElementsByClassName( 'wp-block-gutenbergtemplateblock-templateblock' );
                    for ( let u in uuids ) {
                        for ( let p of polls ) {
                            if ( u === p.attributes.value.nodeValue ) {
                                let el = document.createElement( 'div' );
                                el.innerHTML = result[ u ].trim();
                                p.parentNode.replaceChild( el.children[0], p );
                            }
                        }
                    }
                }
            },
            ( error ) => {
                console.log( 'error: ' + error );
            }
        )
}

const setVote = ( oid, event ) => {
    
    let qid = event.target.value;
    let resultElement = null;
    for ( let element of event.target.parentNode.parentNode.childNodes ) {
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

/**
 * http://locutus.io/php/strings/stripslashes/
 */
const stripslashes = ( str ) => {
    return ( str + '' )
        .replace( /\\(.?)/g, ( s, n1 ) => {
            switch ( n1 ) {
                case '\\':
                    return '\\'
                case '0':
                    return '\u0000'
                case '':
                    return ''
                default:
                    return n1
            }
        })
}