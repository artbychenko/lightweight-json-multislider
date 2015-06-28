//var app = require(app/app);

var $ = global.$ = global.jQuery = require('jquery/dist/jquery');

var gallery = [];

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
    $('.gallery-bg').hover(function(){
        $(this).css({
            opacity: 1
        });
        $('.gallery-title span', this).css({
            opacity: 1
        });
    },function(){
        $(this).css({
            opacity: 0.7
        });
        $('.gallery-title span', this).css({
            opacity: 0
        });
    });
}());

function Slider(selector,bgDataArray) {
    this.arrayPicture = [];
    this.arrayThumbs = [];
    this.arrayTitle = [];
    this.arrayLoaded = [];
    this.index = 0;
    this.selector = selector;
    var setupIndex = 0;
    var thumb;
    var length = 0;
    var path;
    if (bgDataArray['bgHomePage']) {
        this.bgHomePage = bgDataArray['bgHomePage'];
        delete bgDataArray['bgHomePage'];
    } else {
        this.bgHomePage = '/';
    }
    if (bgDataArray['pathToThumb']) {
        this.pathToThumb = bgDataArray['pathToThumb'];
        delete bgDataArray['pathToThumb'];
    } else {
        this.pathToThumb = 'img/thumb/';
    }
    for (var key in bgDataArray) {
        this.arrayPicture[setupIndex] = bgDataArray[key];
        path = bgDataArray[key].split('/');
        length = path.length;
        thumb = this.pathToThumb + path[length - 1];
        this.arrayThumbs[setupIndex] = thumb;
        this.arrayTitle[setupIndex] = key;
        this.arrayLoaded[setupIndex] = false;
        setupIndex = setupIndex + 1;
    }
}

Slider.prototype = {
    constructor: Slider,
    init: function () {
        /* append to DOM */
        var cacheThis = this;
        var $body = $(this.selector);
        $body.addClass('body-bg-img');
        var initialAppend = '<div class="bg-id-0">' +
            '<img class="gallery-bg-img" src="' + cacheThis.arrayPicture[cacheThis.index] +
            '" alt="' + cacheThis.arrayTitle[cacheThis.index] + '">' +
            '</div>';
        initialAppend += '<div class="gallery-title">' +
        '<span>' + cacheThis.arrayTitle[cacheThis.index] + '</span>' +
        '<div class="gallery-left-arrow"></div>' +
        '<div class="gallery-right-arrow"></div>'+
        '</div>';
        /*   afterAppend += '<div id="gallery-show-all">' +
         '<span class="icon-th"></span>' +
         '</div>';
         afterAppend += '<div id="bg-home">' +
         '<a href="' + this.bgHomePage + '">' +
         '<span class="icon-home"></span></a>' +
         '</div>';
         afterAppend += '<div id="all-img"></div>';*/
        var spinner = '<div class="bg-spinner">' +
            '<span class="icon-spinner bg-spin"></span>' +
            '</div>';
        var $gallery = $(cacheThis.selector + ' .gallery-bg');
        $gallery.hide().append(initialAppend);
        $body.append(spinner);
        $gallery.find('img').on('load', function () {
            cacheThis.arrayLoaded[cacheThis.index] = true;
            cacheThis.afterLoad();
        });
        $gallery.find('img').on('error', function () {
            $(this).prop('src', cacheThis.arrayPicture[cacheThis.index + 1]);
            $(this).prop('alt', cacheThis.arrayTitle[cacheThis.index + 1]);
            cacheThis.arrayLoaded[cacheThis.index + 1] = true;
            cacheThis.afterLoad();
        });
    },
    afterLoad: function () {
        $(this.selector + ' .gallery-bg').fadeIn();
        this.hideSpinner();
        this.setupGallery();
    },
    showSpinner: function () {
        var that = this.selector;
        $(that + ' .icon-spinner').addClass('bg-spin');
        $(that + ' .bg-spinner').fadeIn();
    },
    hideSpinner: function () {
        var that = this.selector;
        $(that + ' .bg-spinner').stop(true, true).fadeOut(function () {
            $(that + ' .icon-spinner').removeClass('bg-spin');
        });
    },
    setupGallery: function () {
        var cacheThis = this;
        var that = this.selector;
        $(that + ' .gallery-left-arrow').on('touchstart', function (event) {
            event.stopPropagation();
            event.preventDefault();
            event.target.click();
        });
        var leftClick = false;
        $(that + ' .gallery-left-arrow').on('click', function () {
            if (!leftClick) {
                leftClick = true;
                var currentIndex = cacheThis.index;
                if (cacheThis.index <= 0) {
                    cacheThis.index = cacheThis.arrayPicture.length - 1;
                } else {
                    cacheThis.index = cacheThis.index - 1;
                }
                if (!$(that + ' .bg-id-' + cacheThis.index).length) {
                    var newImg = '<div class="bg-id-' + cacheThis.index + '">' +
                        '<img class="gallery-bg-img" src="' +
                        cacheThis.arrayPicture[cacheThis.index] + '"> ' + '</div>';
                    $(that + ' .gallery-bg').prepend(newImg);
                }

                var $new = $(that + ' .bg-id-' + cacheThis.index);
                $new.hide();
                var $old = $(that + ' .bg-id-' + currentIndex);
                var $img = $(that + ' .bg-id-' + cacheThis.index).find('img');

                var _pushLeft = function () {
                    var spanElement = $(that + ' .gallery-title').find('span');
                    spanElement.empty();
                    setTimeout(function () {
                        leftClick = false;
                        spanElement.text(cacheThis.arrayTitle[cacheThis.index]);
                    }, 600);
                    $old.hide();
                    $new.css({
                        display: 'block',
                        opacity: 0.1
                    });
                    $new.animate({
                        opacity: 1
                    },{
                        duration: 1000
                    });
                };

                if (cacheThis.arrayLoaded[cacheThis.index]) {
                    _pushLeft();
                } else {
                    cacheThis.showSpinner();
                    $img.on('load', function () {
                        $img.off('load');
                        cacheThis.hideSpinner();
                        cacheThis.arrayLoaded[cacheThis.index] = true;
                        _pushLeft();
                    });
                    $img.on('error', function () {
                        $img.off('error');
                        cacheThis.hideSpinner();
                        $(that + ' .gallery-left-arrow').trigger('click');
                    });
                }
            }
        });
        $(that + ' .gallery-right-arrow').on('touchstart', function (event) {
            event.stopPropagation();
            event.preventDefault();
            event.target.click();
        });
        var rightClick = false;
        $(that + ' .gallery-right-arrow').on('click', function () {
            if (!rightClick) {
                rightClick = true;
                var currentIndex = cacheThis.index;
                cacheThis.index = cacheThis.index + 1;
                if (cacheThis.index >= cacheThis.arrayPicture.length) {
                    cacheThis.index = 0;
                }
                if (!$(that + ' .bg-id-' + cacheThis.index).length) {
                    var newImg = '<div class="bg-id-' + cacheThis.index + '">' +
                        '<img class="gallery-bg-img" src="' +
                        cacheThis.arrayPicture[cacheThis.index] + '"> ' + '</div>';
                    $(that + ' .gallery-bg').prepend(newImg);
                }

                var $new = $(that + ' .bg-id-' + cacheThis.index);
                $new.hide();
                var $old = $(that + ' .bg-id-' + currentIndex);
                var $img = $(that + ' .bg-id-' + cacheThis.index).find('img');

                var _pushRight = function () {
                    var spanElement = $(that + ' .gallery-title').find('span');
                    spanElement.empty();
                    setTimeout(function () {
                        rightClick = false;
                        spanElement.text(cacheThis.arrayTitle[cacheThis.index]);
                    }, 500);
                    $old.hide();
                    $new.css({
                        display: 'block',
                        opacity: 0.1
                    });
                    $new.animate({
                        opacity: 1
                    },{
                        duration: 1000
                    });
                };

                if (cacheThis.arrayLoaded[cacheThis.index]) {
                    _pushRight();
                } else {
                    cacheThis.showSpinner();
                    $img.on('load', function () {
                        $img.off('load');
                        cacheThis.hideSpinner();
                        cacheThis.arrayLoaded[cacheThis.index] = true;
                        _pushRight();
                    });
                    $img.on('error', function () {
                        $img.off('error');
                        cacheThis.hideSpinner();
                        $(that + ' .gallery-right-arrow').trigger('click');
                    });
                }
            }
        });

        var xDown = null;
        var _handleTouchStart = function (e) {
            xDown = e.originalEvent.touches[0].clientX;
        };
        var _handleTouchMove = function (e) {
            if (!xDown) {
                return;
            }
            var xUp = e.originalEvent.touches[0].clientX;
            var xDiff = xDown - xUp;
            if (xDiff > 30) {
                // swipe left
                $(that + ' .gallery-right-arrow').trigger('click');
                xDown = null;
            } else if (xDiff < -30) {
                // swipe right
                $(that + ' .gallery-left-arrow').trigger('click');
                xDown = null;
            }
        };
        // attach events
        $(document).on('touchstart', _handleTouchStart);
        $(document).on('touchmove', _handleTouchMove);
    }

};




    var countries = {
        cuba: {
            'Brooklyn Bridge by night': 'http://www.radiantmediatechs.com/radiant-bgphoto/img/brooklyn-bridge-by-night.jpg',
            'Brooklyn Bridge within': 'http://www.radiantmediatechs.com/radiant-bgphoto/img/under-brooklyn-bridge.jpg',
            'Broadway view': 'http://www.radiantmediatechs.com/radiant-bgphoto/img/broadway.jpg',
            'Central Park bench': 'http://www.radiantmediatechs.com/radiant-bgphoto/img/central-park-bench.jpg',
            'Central Park under The snow': 'http://www.radiantmediatechs.com/radiant-bgphoto/img/central-park-under-the-snow.jpg'
           // 'Cuba': '<iframe width="560" height="315" src="https://www.youtube.com/embed/jctQR-TRYso" frameborder="0" allowfullscreen></iframe>'
        },
        russia: {
            'Long Island': 'http://www.radiantmediatechs.com/radiant-bgphoto/img/long-island.jpg',
            'Manhattan Black And White': 'http://www.radiantmediatechs.com/radiant-bgphoto/img/manhattan-black-and-white.jpg',
            'Manhattan Buildings': 'http://www.radiantmediatechs.com/radiant-bgphoto/img/manhattan-buildings.jpg',
            'New York City Cabs': 'http://www.radiantmediatechs.com/radiant-bgphoto/img/new-york-cabs.jpg',
            'New York City Buildings': 'http://www.radiantmediatechs.com/radiant-bgphoto/img/new-york-city-buildings.jpg'
        },
        latin: {
            'New York City By Night': 'http://www.radiantmediatechs.com/radiant-bgphoto/img/new-york-city-by-night.jpg',
            'New York City Docks': 'http://www.radiantmediatechs.com/radiant-bgphoto/img/new-york-city-docks.jpg',
            'New York City From The Sea': 'http://www.radiantmediatechs.com/radiant-bgphoto/img/new-york-city-view.jpg',
            'New York City Skyline': 'http://www.radiantmediatechs.com/radiant-bgphoto/img/new-york-skyline.jpg',
            'New York City Under The Snow': 'http://www.radiantmediatechs.com/radiant-bgphoto/img/new-york-under-the-snow.jpg',
            'The Statue Of Liberty': 'http://www.radiantmediatechs.com/radiant-bgphoto/img/statue-of-liberty.jpg',
            'The Big Apple': 'http://www.radiantmediatechs.com/radiant-bgphoto/img/the-big-apple.jpg',
            'Times Square': 'http://www.radiantmediatechs.com/radiant-bgphoto/img/times-square.jpg'
        }
    };

    // initialize tiles with countries
    function initPage(countries) {
        $('.gallery-bg').each(function(ix,val){
            if (val) {
                var country = val.textContent || val.innerText;
                if (country && countries[country] && !(gallery[country])) {
                    val.parentNode.id = country;
                    $(val).empty();
                    gallery[country] =  new Slider('#'+country, countries[country]);
                    gallery[country].init();
                }
            }
        });
    }

    initPage(countries);

});