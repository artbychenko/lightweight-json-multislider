var $ = global.$ = global.jQuery = require('jquery/dist/jquery');
var Backbone = require('backbone');
var _ = global._ = require('underscore');
Backbone.$ = $;

var app = [$,Backbone,_];

window.app = app;
module.exports = app;
