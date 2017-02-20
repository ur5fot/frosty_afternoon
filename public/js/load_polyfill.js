yepnope({
    test:Modernizr.csscalc,
    nope:'js/vendor/calc-polyfill.js'
});
yepnope({
    test:Modernizr.flexboxlegacy,
    nope:'js/vendor/flexie.min.js'
});
yepnope({
    test:Modernizr.geolocation,
    nope:'js/vendor/geo.js'
});
yepnope({
    test:Modernizr.cssvhunit || Modernizr.cssvwunit,
    nope: 'js/vendor/prefixfree.viewport-units.js'
});
yepnope({
    test:Modernizr.promises || Modernizr.promises,
    nope: 'https://cdnjs.cloudflare.com/ajax/libs/es6-shim/0.35.3/es6-shim.min.js'
});

