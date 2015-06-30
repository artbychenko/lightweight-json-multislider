//  <section id = "images_container">
//      <article class="country countries"> one big block here
//          <h1 class="gallery-bg">latin</h1>
//      </article>
//      <article class="country"> many normal blocks here
//          <h1 class="gallery-bg">russia</h1>
//      </article>

function Slider(selector,bgDataArray) {
    this.arrayPicture = [];
    this.arrayThumbs = [];
    this.arrayTitle = [];
    this.arrayLoaded = [];
    this.index = 0;
    this.selector = selector;
    this.country = selector.slice(1,2).toUpperCase()+selector.slice(2);
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
        '<span class="title-name visibleNot">' + cacheThis.arrayTitle[cacheThis.index] + '</span>' +
        '<div class="gallery-left-arrow"></div>' +
        '<div class="gallery-right-arrow"></div>'+
        '<div class="gallery-zoom visibleNot"></div>'+
        '</div>';
        var name = '<div class="gallery-name"><span class="name">'+this.country+'</span></div>';
        var spinner = '<div class="bg-spinner">' +
            '<span class="icon-spinner bg-spin"></span>' +
            '</div>';
        var $gallery = $(cacheThis.selector + ' .gallery-bg');
        $gallery.hide().append(initialAppend);
        $body.append(name);
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
                var $zoom =$(that + ' .gallery-zoom');

                var _pushLeft = function () {
                    var spanElement = $(that + ' .title-name');
                    spanElement.empty();
                    $zoom.removeClass('visible7');
                    setTimeout(function () {
                        leftClick = false;
                        spanElement.text(cacheThis.arrayTitle[cacheThis.index]);
                        $zoom.addClass('visible7'); // добавить условие для показа
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
                var $zoom =$(that + ' .gallery-zoom');

                var _pushRight = function () {
                    var spanElement = $(that + ' .title-name');
                    spanElement.empty();
                    $zoom.removeClass('visible7');
                    setTimeout(function () {
                        rightClick = false;
                        spanElement.text(cacheThis.arrayTitle[cacheThis.index]);
                        $zoom.addClass('visible7'); // добавить условие для показа
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
Slider.gallery =[];
module.exports = Slider;