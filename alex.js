// event types: 'highlight', 'join', 'link', 'message', 'reply', 'system', 'time'

var window = this;
var lime = null;


function require( src, callback ) {
    var s = document.createElement( 'script' );
    s.src = src + '?' + Date.now();  // cache bust
    if ( callback ) {
        s.onload = callback;
    }
    document.body.appendChild( s );
}

function log( className, error ) {
    var message, node;

    if ( error && error.message ) {
        message = error.message;
    } else {
        message = $.makeArray( arguments ).slice( 1 ).join( ' ' );
    }
    node = document.createElement( 'div' );

    node.className = className;
    node.innerHTML = '<span class="message">' + message + '</span>';
    document.body.appendChild( node );
}

require( 'lib/jquery-2.0.0.js', function () {

    lime = window.lime = $( window );

    window.console = { log: log.bind( null, 'js-console-log' ) };
    window.onerror = function ( message, url, line ) {
        log( null, 'js-console-error', message );
    };

    var typeConversions = { privmsg: 'message', reply: 'status' };

    $( document ).on( 'DOMNodeInserted', function ( event ) {
        var $el = $( event.target ),
            eventType = $el.children().last().attr( '_type' );

        if ( /js-console/.test( event.target.className ) ) {
            return;
        }

        if ( !eventType ) {
            return;
        }

        event.type = typeConversions.hasOwnProperty( eventType )
            ? typeConversions[eventType]
            : eventType;

        lime.trigger( event, $el.children() );
    } );

    require( 'limechat.js' );
} );
