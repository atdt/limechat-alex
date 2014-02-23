var commands = $( {} );

function pad( value ) {
    return ( value < 10 ? '0' : '' ) + value;
}

var offset = (function () {
    var os = new Date().getTimezoneOffset();
    var sign = os > 0 ? -1 : 1;

    return {
        hours   : Math.floor(Math.abs(os) / 60) * sign,
        minutes : (Math.abs(os) % 60) * sign
    };
} ());

lime.on( 'message', function ( e, time, sender, message ) {
    // Linkify 'bug XXXX'
    $( message ).html( function ( _, html ) {
        html = html.replace( /bug (\d+)/, '<a href="https://bugzilla.wikimedia.org/show_bug.cgi?id=$1">bug $1</a>' );
        html = html.replace( /^\[(\d\d):(\d\d):\d\d\] /, function ( _, hh, mm ) {
            hh = parseInt( hh ) + offset.hours;
            mm = parseInt( mm ) + offset.minutes;
            if ( mm > 60 ) {
                hh = hh + 1;
                mm = mm - 60;
            }
            if ( mm < 0 ) {
                hh = hh - 1;
                mm = 60 + mm;
            }
            if ( hh > 24 ) {
                hh = hh - 24;
            }
            if ( hh < 0 ) {
                hh = 24 + hh;
            }
            time.classList.add( 'playback' );
            time.innerText = [ pad( hh ), pad( mm ) ].join( ':' ) + ' ';
            return '';
        } );
        return html;
    } );

    // Beautify Gerrit links
    $( 'a', message ).each( function () {
        var match = /gerrit.wikimedia.org\/.*\/c\/(\d+)\/?$/.exec( this.href );
        if ( match ) {
            this.innerText = 'change ' + match.pop();
        }
    } );
} );
