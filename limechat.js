/** Auto-link 'bug XXXX' to Bugzilla. **/
lime.on( 'privmsg', function ( e, el ) {
    $( '.message', el ).html( function ( _, html ) {
        return html.replace(/bug (\d+)/, '<a href="https://bugzilla.wikimedia.org/show_bug.cgi?id=$1">bug $1</a>');
    } );
} );

/** Beautify ugly Gerrit links **/
lime.on( 'link', function ( e, el ) {
    var match = /gerrit.wikimedia.org\/.*\/c\/(\d+)\/?$/.exec( el.href );
    if ( match ) {
        el.innerText = 'change ' + match.pop();
    }
} );
