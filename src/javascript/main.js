var $ = global.$ = global.jQuery = require('jquery/dist/jquery');

// folder contains href
var links = require('images_links/data2.json');

var Slider = require('app/app');

$(document).ready(function () {

    // add hover effect for top logo
    (function () {
        var $header_logo = $('header .header_logo');
        $('header .logo_img').hover(function() {
            $header_logo.css({
                color: '#6387bd',
                'background-color': '#22539d'
            });
        },function(){
            $header_logo.css({
                color: '#676b71',
                'background-color': '#282a2d'
            });
        });
    }());


    links.forEach(function(val,ix){
        (new Slider('images-container',links[ix])).init();
    });

    // add fade effect for tile images
  /* (function(){
        $('.item-container').hover(function(e) {
            $('.gallery-title .title-name', this).addClass('visibleFull').removeClass('visibleNot');
            $('.gallery-zoom', this).addClass('visible7').removeClass('visibleNot');
            $('.gallery-name', this.parentNode).addClass('displayNot').removeClass('displayBlock');
        },function(e){
            $('.gallery-title .title-name', this).addClass('visibleNot').removeClass('visibleFull');
            $('.gallery-zoom', this).addClass('visibleNot').removeClass('visible7');
            $('.gallery-name', this.parentNode).addClass('displayBlock').removeClass('displayNot');
        });
    }());*/

});