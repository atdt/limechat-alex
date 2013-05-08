// event types: 'highlight', 'join', 'link', 'message', 'reply', 'system', 'time'

var window = this;

function require( src, callback ) {
    var s = document.createElement( 'script' );
    s.src = src + '?' + Date.now();  // cache bust
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

    var canonicalTypes = {
        privmsg : 'message',
        reply   : 'status'
    }

    $( document ).on( 'DOMNodeInserted', function ( event ) {
        var $el = $( event.target ), type = $el.attr( 'type' );
        if ( type ) {
            event.type = canonicalTypes[ type ] || type;
            event.nick = $el.attr( 'nick' );
            lime.trigger( event, $el.children() );
        }
    } );

    require( 'limechat.js' );
} );
