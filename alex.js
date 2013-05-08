// event types: 'highlight', 'join', 'link', 'message', 'reply', 'system', 'time'

var window = this;

function require( src, callback ) {
    var s = document.createElement( 'script' );
    s.src = src + '?' + Date.now();
    if ( callback ) {
        s.onload = callback;
    }
    document.body.appendChild( s );
}

require( 'lib/jquery-2.0.0.js', function () {

    window.lime = $( window );

    window.console = {
        log   : log.bind( null, 'js-console-log' ),
        error : log.bind( null, 'js-console-error' )
    };

    window.onerror = console.error;

    function log( className ) {
        var message = $.makeArray( arguments ).slice( 1 ).join( ' ' );
        var node = document.createElement( 'div' );

        node.className = className;
        node.innerHTML = '<span class="message">' + message + '</span>';
        document.body.appendChild( node );
    }

    $( document ).on( 'DOMNodeInserted', function ( e ) {
        var el = e.target, $el = $( el );

        if ( $el.parent().is( 'body' ) && $el.is( '.line' ) ) {
            lime.trigger( $el.attr( 'type' ), [ el ] );

            if ( $el.attr( 'highlight' ) ) {
                lime.trigger( 'highlight', [ el ] );
            }

            $( 'a', el ).each( function () {
                lime.trigger( 'link', [ this, el ] );
            } );

            $el.children().each( function () {
                lime.trigger( this.className, [ this, el ] );
            } );
        }
    } );

    require( 'limechat.js' );
} );
