console.log( 'Frontend Block JS' )

var transitionTime = 1001

window.addEventListener( "load", function() {

    const polls = document.getElementsByClassName( 'wp-block-gutenbergtemplateblock-templateblock' )

    if ( polls.length ) {
        handleVoteClick()
        handleResultClick()
        setRotation( polls )
    }
})

// Handlers

const handleVoteClick = () => {
    
    var elements = document.getElementsByClassName( 'potd-vote-btn' )

    for ( let element of elements ) {
        element.addEventListener( 'click', throttle( function( event ) {
            onVoteClick( event )
        }, transitionTime ))
    }
}

const handleResultClick = () => {
    
    var elements = document.getElementsByClassName( 'potd-results-btn' )

    for ( let element of elements ) {
        element.addEventListener( 'click', throttle( function( event ) {
            onResultClick( event )
        }, transitionTime ))
    }
}

// Events

const onResultClick = ( event ) => {

    const uuid = event.target.parentNode.parentNode.attributes.value.nodeValue
    const qid = event.target.attributes.value.nodeValue
    const poll = event.target.parentNode.parentNode
    const resultEl = poll.querySelector( '.potd-result' )

    if ( resultEl.clientHeight === 0 ) {
        let url = gutenbergtemplateblock_ajax_object.ajax_url +
        '?action=gutenbergtemplateblock_getResultsByQid' +
        '&qid=' + qid +
        '&security=' + gutenbergtemplateblock_ajax_object.security

        fetch( url )
            .then( response => {
                return response.json()
            })
            .then( 
                ( result ) => {
                    const polls = document.getElementsByClassName( 'wp-block-gutenbergtemplateblock-templateblock' )
                    let html = '<table class="potd-result-table"><tbody>'
                    let max = 1

                    for ( let r of result ) {
                        max = r.votes > max ? parseInt( r.votes ) : max
                    }

                    for ( let r of result ) {
                        html += '<tr>' + 
                            '<td>' + decodeURIComponent( stripslashes( r.option ) ) + '</td>' +
                            '<td>' + 
                                '<span class="tooltip" data-tooltip="' + r.votes + ' votes">' +
                                    '<span class="tooltip-info"></span>' +
                                    '<meter value="' + r.votes + '" min="0" max="' + max + '"></meter>' +
                                '</span>' +
                            '</td>' +
                        '</tr>'
                    }

                    html += '</tbody></table>'

                    for ( let p of polls ) {
                        if ( uuid === p.attributes.value.nodeValue ) {
                            let resultTable = document.createElement( 'div' )
                            resultTable.innerHTML = html
                            const resultEl = p.querySelector( '.potd-result' )
                            resultEl.innerHTML = ''
                            resultEl.appendChild( resultTable )
                            slideToggle( resultEl )
                        }
                    }
                },
                ( error ) => {
                    console.log( 'error: ' + error )
                }
            )
    } else {
        const nodeName = resultEl.firstChild.nodeName
        if ( nodeName !== 'DIV' ) {
            slideToggle( resultEl, event, 'result' )
        } else {
            slideToggle( resultEl )
        }
    }
}

const onVoteClick = ( event ) => {
    
    const qid = event.target.value
    const parent = event.target.parentNode.parentNode
    const resultEl = parent.querySelector( '.potd-result' )
    const checkedRadio = parent.querySelector( 'input:checked' )
    const oid = checkedRadio.value

    if ( resultEl.clientHeight === 0 ) {
        let limitByCheckUrl = gutenbergtemplateblock_ajax_object.ajax_url +
        '?action=gutenbergtemplateblock_getLimitByOption' +
        '&security=' + gutenbergtemplateblock_ajax_object.security

        fetch( limitByCheckUrl )
            .then( response => {
                return response.json()
            })
            .then(
                ( result ) => {
                    if ( result === 'cookie' || result === 'ipcookie' || result === 'user' ) {
                        let liveCookie = document.cookie.indexOf( 'gutenbergtemplateblock_limit_cookie=1' ) > -1
                        if ( result === 'user' ) {
                            setVote( oid, qid, resultEl )
                        } else if ( !liveCookie ) {
                            setVote( oid, qid, resultEl )
                            document.cookie = 'gutenbergtemplateblock_limit_cookie=1;path=/;max-age=86400' // 1 day cookie
                        } else {
                            resultEl.innerHTML = 'You have already voted today.'
                            slideToggle( resultEl )
                        }
                    } else {
                        setVote( oid, qid, resultEl )
                    }
                },
                ( error ) => {
                    console.log( 'error: ' + error )
                }
            )   
    } else {
        slideToggle( resultEl, event, 'vote' )
    }
}

// Setters

const setRotation = ( polls ) => {

    let uuids = {}

    for ( let poll of polls ) {
        for ( let child of poll.children ) {
            if ( child.className === 'potd-vote-btn' ) {
                uuids[ poll.attributes.value.nodeValue ] = child.value
            }
        }
    }

    let setRotationUrl = gutenbergtemplateblock_ajax_object.ajax_url +
        '?action=gutenbergtemplateblock_setRotation' +
        '&uuids=' + JSON.stringify( uuids ) +
        '&security=' + gutenbergtemplateblock_ajax_object.security

    fetch( setRotationUrl )
        .then( response => {
            return response.json()
        })
        .then( 
            ( result ) => {
                if ( Object.keys( result ).length ) {
                    const polls = document.getElementsByClassName( 'wp-block-gutenbergtemplateblock-templateblock' )
                    for ( let u in uuids ) {
                        for ( let p of polls ) {
                            if ( u === p.attributes.value.nodeValue ) {
                                let el = document.createElement( 'div' )
                                el.innerHTML = result[ u ].trim()
                                p.parentNode.replaceChild( el.children[0], p )
                            }
                        }
                    }
                }
            },
            ( error ) => {
                console.log( 'error: ' + error )
            }
        )
}

const setVote = ( oid, qid, resultElement ) => {
    
    let url = gutenbergtemplateblock_ajax_object.ajax_url +
        '?action=gutenbergtemplateblock_setOptionVoteById' +
        '&oid=' + oid +
        '&qid=' + qid +
        '&security=' + gutenbergtemplateblock_ajax_object.security

    fetch( url )
        .then( response => {
            return response.json()
        })
        .then(
            ( result ) => {
                if ( result === 'success' ) {
                    resultElement.innerHTML = 'Thank you for your vote!'
                } else if ( result === 'alreadyVoted' ) {
                    resultElement.innerHTML = 'You have already voted today.'
                } else if ( result === 'notLoggedIn' ) {
                    resultElement.innerHTML = 'You have to login to vote.'
                } else {
                    resultElement.innerHTML = 'Sorry! We encountered a problem :('
                }

                slideToggle( resultElement )
            },
            ( error ) => {
                console.log( 'error: ' + error )
            }
        )
}

// Helpers

const slideToggle = ( resultEl, reopenEvent = null, voteResult = null ) => {

    if ( resultEl.style.height === '0px' || resultEl.style.height === '' ) {
        const height = testHeight( resultEl )
        resultEl.style.height = height + 'px'
    } else {
        resultEl.style.height = '0px'
        if ( reopenEvent ) {
            setTimeout( () => {
                resultEl.innerHTML = ''
                if ( voteResult === 'result' ) {
                    onResultClick( reopenEvent )
                } else {
                    onVoteClick( reopenEvent )
                }
            }, transitionTime )
        } else {
            setTimeout( () => resultEl.innerHTML = '', transitionTime )
        }
    }
}

const testHeight = ( element ) => {

    const poll = element.parentNode
    const width = element.parentNode.offsetWidth
    const el = element.cloneNode( true )
    const containerPaddingLeft = parseInt( getComputedStyle( poll ).getPropertyValue( 'padding-left' ).replace( 'px', '' ) )
    const containerPaddingRight = parseInt( getComputedStyle( poll ).getPropertyValue( 'padding-right' ).replace( 'px', '' ) )
    const tableMargin = 32 // .potd-result-table margin in pixels
    el.style.width = ( width - ( containerPaddingLeft + containerPaddingRight ) ) + 'px'
    el.style.visibility = "hidden"
    document.body.appendChild( el )
    el.style.top = ( el.scrollHeight + ( tableMargin * 2 ) ) + 'px'
    const result = el.style.top.replace( 'px', '' )
    document.body.removeChild( el )

    return result
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

/**
 * https://codeburst.io/throttling-and-debouncing-in-javascript-b01cad5c8edf
 */
const throttle = ( func, limit ) => {

    let inThrottle
    return function() {
        const args = arguments
        const context = this
        if ( !inThrottle ) {
            func.apply( context, args )
            inThrottle = true
            setTimeout( () => inThrottle = false, limit )
        }
    }
}