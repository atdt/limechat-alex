lime.on( 'message', function ( e, time, sender, message ) {
    // Linkify 'bug XXXX'
    $( message ).html( function ( _, html ) {
        return html.replace( /bug (\d+)/, '<a href="https://bugzilla.wikimedia.org/show_bug.cgi?id=$1">bug $1</a>' );
    } );

    // Beautify Gerrit links
    $( 'a', message ).each( function () {
        var match = /gerrit.wikimedia.org\/.*\/c\/(\d+)\/?$/.exec( this.href );
        if ( match ) {
            this.innerText = 'change ' + match.pop();
        }
    } );
} );
