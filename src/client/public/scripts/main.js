require.config({
    paths: {
        jquery: 'lib/jquery',
        underscore: 'lib/underscore',
        backbone: 'lib/backbone',
        handlebars: 'lib/handlebars',
        swfobject: 'lib/swfobject/swfobject'
    },
    shim: {
        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        'handlebars': {
            deps: ['jquery'],
            exports: 'Handlebars'
        },
        'underscore': {
            exports: '_'
        }
    }
});

require([
    "screen/main"
],
function(player) {

});