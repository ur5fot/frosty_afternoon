yepnope({
    test:Modernizr.csscalc,
    nope:'js/vendor/calc-polyfill.js'
});
yepnope({
    test:Modernizr.flexboxlegacy && Modernizr.flexbox && Modernizr.flexboxtweener ,
    nope:'js/vendor/flexie.min.js'
});
yepnope({
    test:Modernizr.geolocation,
    nope:'js/vendor/geo.js'
});
yepnope({
    test:Modernizr.cssvhunit && Modernizr.cssvwunit,
    nope: 'js/vendor/prefixfree.viewport-units.js'
});
/*yepnope({
    test:Modernizr.promises || Modernizr.generators,
    nope: ['https://cdnjs.cloudflare.com/ajax/libs/babel-core/6.1.19/browser.min.js']
});*/

// alert('ddd');