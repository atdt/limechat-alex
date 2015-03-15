var commands = $( {} );

function pad( value ) {
    return ( value < 10 ? '0' : '' ) + value;
}

var offset = ( function () {
    var tzo = new Date().getTimezoneOffset(),
        sign = tzo > 0 ? -1 : 1,
        minutes = Math.abs( tzo ) % 60,
        hours = ( Math.abs( tzo ) - minutes ) / 60;

    return { hours: hours * sign, minutes: minutes * sign };
}());

lime.on( 'message', function ( e, time, sender, message ) {
    $( message ).html( function ( _, html ) {
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
        var m;
        m = /gerrit.wikimedia.org\/.*\/(\d{3,})/.exec( this.href );
        if ( m ) {
            this.innerText = 'G' + m.pop();
        }
        m = /phabricator.wikimedia.org\/(T\d+)/.exec ( this.href );
        if ( m ) {
            this.innerText = m.pop();
        }
    } );

    $( message ).html( function ( _, html ) {
        return html.replace( '\bT\d+', '<a href="//phabricator.wikimedia.org/$1">$1</a>' );
    } );

} );

lime.on( 'system', function ( e, time, message ) {
    if ( /You have joined the channel/.test( message.innerText ) ) {
        $( message ).parent().remove();
    }
} );
