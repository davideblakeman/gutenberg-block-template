console.log( 'Frontend Block JS' );
window.addEventListener( "load", function( event ) {

    // console.log( document.getElementById( 'VoteBtn' ) );
    var elements = document.getElementsByClassName( 'potd-vote-btn' );
    let oid = null;

    for ( let element of elements ) {
        element.addEventListener( 'click', function( event ) {
            // console.log( element );
            for ( let element of this.parentNode.childNodes ) {
                if ( element.tagName === 'P' & element.firstChild.checked ) {
                    // console.log( element );
                    oid = element.firstChild.value;
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
    console.log( event );
    let resultElement = null;
    for ( let element of event.target.parentNode.parentNode.childNodes ) {
        if ( element.classList.value === 'potd-result' ) {
            resultElement = element;
        }
    }

    let url = gutenbergtemplateblock_ajax_object.ajax_url +
                '?action=gutenbergtemplateblock_setOptionVoteById' +
                '&oid=' + oid +
                '&security=' + gutenbergtemplateblock_ajax_object.security;

    fetch( url )
        .then( response => {
            return response.json();
        })
        .then(
            ( result ) => {
                // console.log('result:');
                // console.log( result );
                if ( result === 'success' ) {
                    resultElement.innerHTML = 'Thank you for your vote!';
                } else {
                    resultElement.innerHTML = 'Sorry! We encountered a problem :(';
                }
            },
            ( err ) => {
                console.log( 'error: ' + error );
            }
        )
};
