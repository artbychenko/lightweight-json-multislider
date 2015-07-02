//  <section id = "images_container">
//      <article class="country countries"> one big block here
//          <h1 class="gallery-bg">latin</h1>
//      </article>
//      <article class="country"> many normal blocks here
//          <h1 class="gallery-bg">russia</h1>
//      </article>

function Slider(selector,bgDataArray) {
    this.arrayPicture = [];
    this.arrayType = [];
    this.arrayTitle = [];
    this.arrayLoaded = [];
    this.arrayError = [];
    this.index = 0;
    this.selector = selector;
    this.country = this.prepareCountryName(selector);
    var setupIndex = 0;
    var filterLink = [];

    for (var key in bgDataArray) {
        filterLink = this.filterLink(bgDataArray[key]);
        this.arrayType[setupIndex] = filterLink[0];
        this.arrayPicture[setupIndex] = filterLink[1];
        this.arrayTitle[setupIndex] = key;
        this.arrayLoaded[setupIndex] = false;
        setupIndex = setupIndex + 1;
    }
}

Slider.prototype = {
    constructor: Slider,
    prepareCountryName: function(country){
        var words = country.slice(1).split('_');
        for (var i = 0; i < words.length; i++){
            words[i] = words[i].slice(0,1).toUpperCase()+words[i].slice(1);
        }
        return words.join(' ');
    },
    init: function () {
        /* append to DOM */
        var cacheThis = this;
        var $body = $(cacheThis.selector);
        $body.addClass('body-bg-img');
        var newImage = new Image();

        $(newImage).on('load', function () {
            $(newImage).attr({
                'data-width': newImage.width,
                'data-height': newImage.height,
                'alt': cacheThis.arrayTitle[cacheThis.index],
                'class': 'gallery-bg-img'
            });
            var initialAppend = $('<div class = "bg-id-' + cacheThis.index + '">');

            var nextElements ='<div class="gallery-title">' +
                '<span class="title-name visibleNot">' + cacheThis.arrayTitle[cacheThis.index] + '</span>' +
                '<div class="gallery-left-arrow"></div>' +
                '<div class="gallery-right-arrow"></div>'+
                '<div class="gallery-zoom displayNot"></div>'+
                '</div>';

            var nameAndSpinner = '<div class="gallery-name"><span class="name">'+cacheThis.country+'</span></div>';
            nameAndSpinner += '<div class="bg-spinner"><span class="icon-spinner bg-spin"></span></div>';

            initialAppend.append(newImage);

            var $gallery = $(cacheThis.selector + ' .gallery-bg');
            $gallery.hide().append(initialAppend);
            $gallery.append(nextElements);
            $body.append(nameAndSpinner);

            cacheThis.arrayLoaded[cacheThis.index] = true;

            cacheThis.afterLoad();

        });

        $(newImage).on('error', function () {
            cacheThis.index += 1;
            $(this).prop('src', cacheThis.arrayPicture[cacheThis.index]);
            $(this).prop('alt', cacheThis.arrayTitle[cacheThis.index]);
        });

        newImage.src = cacheThis.arrayPicture[cacheThis.index];
    },

    afterLoad: function () {
        var that = this.selector;
        $(that + ' .gallery-bg').fadeIn();
        this.hideSpinner();
        var $zoom = $(that + ' .gallery-zoom');
        var $img = $(that + ' .gallery-bg-img');

        if (this.checkImageSize($img)) {
            $zoom.removeClass('displayNot');
        } else {
        }

        this.switchZoomOrPlay(this.arrayType[this.index],$zoom);

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

    filterLink: function (link){
        if (link.search(/^(https:\/\/www\.youtube\.com)/) !== -1) {
            var id = link.match(/(watch\?v=)(.*)$/)[2];
            return [
                'video',
                'https://img.youtube.com/vi/' + id + '/hqdefault.jpg',
                '<iframe src="//www.youtube.com/embed/' + id + '?autoplay=1&' +
                    '" frameborder="0" allowfullscreen></iframe>'
            ];
        } else if (link.search('http') === -1) {
            return [
                'text',
                link ];
        } else {
            return [
                'img',
                link ];
        }
    },

    checkImageSize: function ($img){
        var imgWidth = $img.attr('data-width');
        var imgHeight = $img.attr('data-height');
        if (imgWidth > $img.width() && imgHeight > $img.height()) {
            return true;
        }
    },

    switchZoomOrPlay: function (typeLink,$zoom){
        switch (typeLink){
            case 'video':
                $zoom.addClass('play').removeClass('zoom');
                break;
            case 'img':
                $zoom.addClass('zoom').removeClass('play');
                break;
        }
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

            var _pushLeft = function () {
                var $new = $(that + ' .bg-id-' + cacheThis.index);
                $new.hide();

                var spanElement = $(that + ' .title-name');
                spanElement.empty();

                setTimeout(function () {
                    leftClick = false;
                    spanElement.text(cacheThis.arrayTitle[cacheThis.index]);

                    var $img = $(' .gallery-bg-img', $new);

                    if (cacheThis.checkImageSize($img)) {
                        $zoom.addClass('visible7').removeClass('displayNot');
                    }
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

            if (!leftClick) {
                leftClick = true;

                var currentIndex = cacheThis.index;

                // check error links
                do {
                    if (cacheThis.index <= 0) {
                        cacheThis.index = cacheThis.arrayPicture.length - 1;
                    } else {
                        cacheThis.index = cacheThis.index - 1;
                    }
                } while(cacheThis.arrayError[cacheThis.index]);

                var $old = $(that + ' .bg-id-' + currentIndex);
                var $zoom =$(that + ' .gallery-zoom');

                //check type of link
                var typeLink = cacheThis.arrayType[cacheThis.index];

                // show zoom-icon background type = play or zoom
                $zoom.addClass('displayNot').removeClass('visible7');
                cacheThis.switchZoomOrPlay(typeLink,$zoom);

                if (!$(that + ' .bg-id-' + cacheThis.index).length) {

                    var initialAppend = $('<div class = "bg-id-' + cacheThis.index + '">');

                    if (typeLink !== 'text') {

                        var newImg = new Image();

                        $(newImg).on('load', function () {
                            $(this).off('load');
                            cacheThis.hideSpinner();
                            cacheThis.arrayLoaded[cacheThis.index] = true;
                            $(this).attr({
                                'data-width': newImg.width,
                                'data-height': newImg.height,
                                'alt': cacheThis.arrayTitle[cacheThis.index],
                                'class': 'gallery-bg-img'
                            });
                            initialAppend.append(newImg);
                            $(that + ' .gallery-bg').prepend(initialAppend);
                            _pushLeft();
                        });

                        $(newImg).on('error', function () {
                            cacheThis.arrayError[cacheThis.index] = true;
                            $(newImg).off('load');
                            $(newImg).off('error');
                            newImg = null;
                            $old.hide();
                            cacheThis.hideSpinner();
                            leftClick = false;
                            $(that + ' .gallery-left-arrow').trigger('click');
                        });

                        newImg.src = cacheThis.arrayPicture[cacheThis.index];
                    } else {
                        cacheThis.hideSpinner();
                        cacheThis.arrayLoaded[cacheThis.index] = true;
                        $('<span class ="gallery-bg-text">' +
                            cacheThis.arrayPicture[cacheThis.index]+'</span>').appendTo(initialAppend);
                        $(that + ' .gallery-bg').prepend(initialAppend);
                        _pushLeft();
                    }
                }



                if (cacheThis.arrayLoaded[cacheThis.index]) {
                    _pushLeft();
                } else {
                    cacheThis.showSpinner();
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

            var _pushRight = function () {
                var $new = $(that + ' .bg-id-' + cacheThis.index);
                $new.hide();

                var spanElement = $(that + ' .title-name');
                spanElement.empty();

                setTimeout(function () {
                    rightClick = false;
                    spanElement.text(cacheThis.arrayTitle[cacheThis.index]);
                    var $img = $(' .gallery-bg-img', $new);

                    if (cacheThis.checkImageSize($img)) {
                        $zoom.addClass('visible7').removeClass('displayNot');
                    }
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

            if (!rightClick) {
                rightClick = true;

                var currentIndex = cacheThis.index;

               //check error links
                do {
                    cacheThis.index = cacheThis.index + 1;

                    if (cacheThis.index >= cacheThis.arrayPicture.length) {
                        cacheThis.index = 0;
                    }
                } while(cacheThis.arrayError[cacheThis.index]);

                var $old = $(that + ' .bg-id-' + currentIndex);
                var $zoom = $(that + ' .gallery-zoom');

                //check type of link
                var typeLink = cacheThis.arrayType[cacheThis.index];
                $zoom.addClass('displayNot').removeClass('visible7');
                cacheThis.switchZoomOrPlay(typeLink,$zoom);

                if (!$(that + ' .bg-id-' + cacheThis.index).length) {

                    var initialAppend = $('<div class = "bg-id-' + cacheThis.index + '">');

                    if (typeLink !== 'text') {
                        var newImg = new Image();

                        $(newImg).on('load', function () {
                            $(newImg).off('load');
                            cacheThis.hideSpinner();
                            cacheThis.arrayLoaded[cacheThis.index] = true;
                            $(newImg).attr({
                                'data-width': newImg.width,
                                'data-height': newImg.height,
                                'alt': cacheThis.arrayTitle[cacheThis.index],
                                'class': 'gallery-bg-img'
                            });
                            initialAppend.append(newImg);
                            $(that + ' .gallery-bg').prepend(initialAppend);
                            _pushRight();
                        });

                        $(newImg).on('error', function () {
                            cacheThis.arrayError[cacheThis.index] = true;
                            $(newImg).off('load');
                            $(newImg).off('error');
                            newImg = null;
                            $old.hide();
                            cacheThis.hideSpinner();
                            rightClick = false;
                            $(that + ' .gallery-right-arrow').trigger('click');
                        });

                        newImg.src = cacheThis.arrayPicture[cacheThis.index];

                    } else {
                        cacheThis.hideSpinner();
                        cacheThis.arrayLoaded[cacheThis.index] = true;
                        $('<span class ="gallery-bg-text">' +
                            cacheThis.arrayPicture[cacheThis.index]+'</span>').appendTo(initialAppend);
                        $(that + ' .gallery-bg').prepend(initialAppend);
                        _pushRight();
                    }

                }

                if (cacheThis.arrayLoaded[cacheThis.index]) {
                    _pushRight();
                } else {
                    cacheThis.showSpinner();
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

Slider.gallery =[];
module.exports = Slider;