var $ = global.$ = global.jQuery = require('jquery/dist/jquery');

// folder contains href
var links = require('images_links/data.json');

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

// add fade effect for tile images
(function(){
    $('.gallery-bg').hover(function() {
        $(this).addClass('visibleFull').removeClass('visible7');
        $('.gallery-title .title-name', this).addClass('visibleFull').removeClass('visibleNot');
        $('.gallery-zoom', this).addClass('visible7').removeClass('visibleNot');
        $('.gallery-name', this.parentNode).addClass('displayNot').removeClass('displayBlock');
    },function(){
        $(this).addClass('visible7').removeClass('visibleFull');
        $('.gallery-title .title-name', this).addClass('visibleNot').removeClass('visibleFull');
        $('.gallery-zoom', this).addClass('visibleNot').removeClass('visible7');
        $('.gallery-name', this.parentNode).addClass('displayBlock').removeClass('displayNot');
    });
}());

// initialize tiles with countries, use constructor Slider
// @param object data.json with links
(function (countries) {
    function addInnerCountrySeparator (country){
        country = country.trim().toLowerCase();
        var words = country.split(' ');
        if (words.length > 1) {
            return words.join('_');
        } else return country;
    }
    $('.gallery-bg').each(function(ix,val){
        if (val) {
            var country = val.textContent || val.innerText;
            country = addInnerCountrySeparator(country);
            if (country && countries[country] && !(Slider.gallery[country])) {
                 val.parentNode.id = country;
                $(val).empty();
                Slider.gallery[country] =  new Slider('#'+country, countries[country]);
                Slider.gallery[country].init();
            }
        }
    });
})(links);

});