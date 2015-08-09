//  <section id = "images-container">
//      <article class="country countries"> one big block here
//          <h1 class="gallery-bg">latin</h1>
//      </article>
//      <article class="country"> many normal blocks here
//          <h1 class="gallery-bg">russia</h1>
//      </article>

function Slider(container,data) { this.arrayPicture = [];
    this.arrayType = [];
    this.arrayTitle = [];
    this.arrayLoaded = [];
    this.arrayError = [];
    this.index = 0;
    this.container = container;
    this.id = this.addInnerSeparatorAndUniqNumber(data['name']);
    this.selector ='#'+ this.id;
    this.itemName = this.prepareName(data['name']);
    this.style = data['style'] || {};
    this.links = data['links'] || {};

    var setupIndex = 0;
    var filterLink = [];
    var data = this.links;
    for (var key in data) {
        filterLink = this.filterLink(data[key]);
        this.arrayType[setupIndex] = filterLink[0];
        this.arrayPicture[setupIndex] = filterLink[1];
        this.arrayTitle[setupIndex] = key;
        this.arrayLoaded[setupIndex] = false;
        setupIndex = setupIndex + 1;
    }
}

Slider.prototype = {
    constructor: Slider,
    prepareName: function(name){
        if (!name) {
            return '';
        }
        var words = name.trim().toLowerCase().split(' ');
        for (var i = 0; i < words.length; i++){
            words[i] = words[i].slice(0,1).toUpperCase()+words[i].slice(1);
        }
        return words.join(' ');
    },
    addInnerSeparatorAndUniqNumber: function(name){
        var id = Math.round(Math.random()*10000);
        if (!name){
            return id;
        }
        var words = name.trim().toLowerCase().split(' ');
        if (words.length > 1) {
            return words.join('_');
        } else return name;
    },
    init: function () {

        var cacheThis = this;

        var height = this.style.height || '200px';
        var width = this.style.width || '300px';

        var minSize = this.minSize = (parseInt(height) > parseInt(width))? parseInt(width): parseInt(height);

        var cssItemContainer = $.extend({
            'position': 'relative',
            'float': 'left',
            'width': width,
            'height': height,
            'background': '#282a2d',
            'color': '#ffffff',
            'line-height': height,
            'text-align': 'center',
            'overflow': 'hidden'
        },this.style);

        var $main =$('<article>',{
            class: 'item-container',
            id: cacheThis.id,
            css: cssItemContainer
        });

        var $gallery = $('<div>',{
            class: 'gallery-bg',
            css: {
                'display': 'block',
                'margin': 0,
                'padding': 0,
                'width': '100%',
                'height': '100%',
                'background': '#282a2d',
                'opacity': '0',
                'transition': 'opacity 0.3s linear'
            }
        });
        
        $main.append($gallery);
        
        $('#'+cacheThis.container).append($main);
       
        var newImage = new Image();

        $(newImage).on('load', function () {
            $(newImage).attr({
                'data-width': newImage.width,
                'data-height': newImage.height,
                'alt': cacheThis.arrayTitle[cacheThis.index],
                'class': 'gallery-bg-img'
            }).css({
                'margin': 0,
                'padding': 0,
                'max-height': '100%',
                'width': '100%',
                'height': '100%'
            });

            var galleryItem = $('<div>',{
                class: 'bg-id-' + cacheThis.index,
                css: {
                    'width': '100%',
                    'height': '100%',
                    'overflow': 'hidden'
                }
            });

            var $galleryTitleAndControl = $('<div>',{
                class: 'gallery-title',
                css: {
                    'position': 'relative',
                    'margin-top': '-'+height,
                    'height': height,
                    'width': width,
                    'text-align': 'left'
                }
            });

            var $title = $('<span>',{
                class: 'title-name',
                css: {
                    'opacity': 0,
                    'transition': 'opacity 0.3s linear',
                    'display': 'block',
                    'position':'absolute',
                    'bottom': minSize/15+'px',
                    'left': minSize/15+'px',
                    'width': '60%',
                    'color': '#fdfdfd',
                    'font': minSize/10 + 'px' + ' Georgia, serif'
                }
            }).text(cacheThis.arrayTitle[cacheThis.index]);

            var $leftArrow = $('<div>',{
                class: 'gallery-left-arrow',
                css: {
                    'background': 'url("images/svg/prev_slide.svg") no-repeat',
                    'opacity': '0.6',
                    'transition': 'opacity 0.3s ease',
                    'position': 'absolute',
                    'bottom': minSize/15+'px',
                    'right': minSize/4.5 +'px',
                    'width': minSize/10+'px',
                    'height': minSize/10+'px',
                    'cursor': 'pointer',
                    'z-index': 1
                }
            }).hover(function(e){
                e.currentTarget.style.opacity = 1;
            },function(e){
                e.currentTarget.style.opacity = 0.6;
            });

            var $rightArrow = $('<div>',{
               class: 'gallery-right-arrow',
                css: {
                    'background': 'url("images/svg/next_slide.svg") no-repeat',
                    'opacity': '0.6',
                    'transition': 'opacity 0.3s ease',
                    'position': 'absolute',
                    'bottom': minSize/15+'px',
                    'right': minSize/15+'px',
                    'width': minSize/10+'px',
                    'height': minSize/10+'px',
                    'cursor': 'pointer',
                    'z-index': 1
                }
            }).hover(function(e){
                e.currentTarget.style.opacity = 1;
            },function(e){
                e.currentTarget.style.opacity = 0.6;
            });

            var $zoom = $('<div>',{
               class: 'gallery-zoom',
                css: {
                    'display': 'none',
                    'opacity': 0,
                    'transition': 'opacity 0.3s ease',
                    'position': 'absolute',
                    'top': '50%',
                    'left': '50%',
                    'margin-left': -minSize/12 +'px',
                    'margin-top': -minSize/12 +'px',
                    'width': minSize/6+'px',
                    'height': minSize/6+'px',
                    'cursor': 'pointer',
                    'z-index': 1
                }
            }).hover(function(e){
                e.currentTarget.style.opacity = 1;
            },function(e){
                e.currentTarget.style.opacity = 0.6;
            });

            $galleryTitleAndControl.append($title).append($leftArrow).append($rightArrow).append($zoom);

            var $galleryName = $('<div>',{
                class: 'gallery-name',
                css: {
                    'font': minSize/6 +'px Georgia, serif',
                    'transition': 'opacity 0.3s linear',
                    'color': '#ffffff',
                    'position': 'absolute',
                    'top': '50%',
                    'margin-top': -minSize/12 +'px',
                    'width': '100%',
                    'height':  minSize/6 +'px',
                    'text-align': 'center',
                    'line-height':  minSize/6 +'px'
                }
            });

            var $galleryNameItem = $('<span>',{
                class: 'name'
            }).text(cacheThis.itemName);

            $galleryName.append($galleryNameItem);

            var $spinner = $('<div>',{
                class: 'bg-spinner'
            });

            var $spinnerItem = $('<span>',{
                class: 'icon-spinner bg-spin'
            });

            $spinner.append($spinnerItem);

            galleryItem.append(newImage);

            $gallery.append(galleryItem);
            $gallery.append($galleryTitleAndControl);
            $main.append($galleryName).append($spinner);

            cacheThis.arrayLoaded[cacheThis.index] = true;

            $main.hover(function(){
                $gallery.css({
                    'opacity': 1
                });
                $title.css({
                    'opacity': 1
                });
                $zoom.css({
                    'opacity': 0.6
                });
                $galleryName.css({
                    'opacity': 0
                });
                setTimeout(function(){
                    $galleryName.css({
                       'display': 'none'
                    });
                },300);
            },function(){
                $gallery.css({
                    'opacity': 0.7
                });
                $title.css({
                    'opacity': 0
                });
                $zoom.css({
                    'opacity': 0
                });
                $galleryName.css({
                    'opacity': 1
                });
                setTimeout(function(){
                    $galleryName.css({
                        'display': 'block'
                    });
                },300);
            });

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
        $(that + ' .gallery-bg').css({
            'opacity': 0.7
        });
        this.hideSpinner();
        var $zoom = $(that + ' .gallery-zoom');
        var $img = $(that + ' .gallery-bg-img');

        if (this.checkImageSize($img)) {
            $zoom.css({
                'display': 'block'
            });
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
    computeOptimalImgPosition: function (modalWidth,modalHeight,imgWidth,imgHeight){
        var width = (modalWidth-70 > imgWidth)? imgWidth: modalWidth-70;
        var height = width * imgHeight / imgWidth;
        height = (imgHeight > height)? height: imgHeight;
        height = (modalHeight-70 > height)? height: modalHeight-70;
        width = height * imgWidth / imgHeight;
        var top = (modalHeight - height)/2;
        top = (top > 35)? top: 35;
        top = ((modalHeight - height) > 400)? 200: top;
        return {
            width: width,
            height: height,
            top: top
        };
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
                        $zoom.css({
                            'opacity': 0.7,
                            'display': 'block'
                        });
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
                //$zoom.addClass('displayNot').removeClass('visible7');
                $zoom.css({
                    'display': 'none'
                });
                cacheThis.switchZoomOrPlay(typeLink,$zoom);

                if (!$(that + ' .bg-id-' + cacheThis.index).length) {

                    var initialAppend = $('<div>',{
                        class: 'bg-id-' + cacheThis.index,
                        css: {
                            'width': '100%',
                            'height': '100%',
                            'overflow': 'hidden'
                        }
                    });

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
                            }).css({
                                'margin': 0,
                                'padding': 0,
                                'max-height': '100%',
                                'width': '100%',
                                'height': '100%'
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

                        $('<span>',{
                            class: 'gallery-bg-text',
                            css: {
                                'display': 'block',
                                'overflow': 'hidden',
                                'width': 'auto',
                                'margin': cacheThis.minSize/14 + 'px '+cacheThis.minSize/20 + 'px',
                                'text-align': 'left',
                                'font': cacheThis.minSize/14 + 'px Verdana, monospace'
                            }
                        }).text(cacheThis.arrayPicture[cacheThis.index]).appendTo(initialAppend);

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
                        $zoom.css({
                            'opacity': 0.7,
                            'display': 'block'
                        });
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
                //$zoom.addClass('displayNot').removeClass('visible7');
                $zoom.css({
                    'display': 'none'
                });

                cacheThis.switchZoomOrPlay(typeLink,$zoom);

                if (!$(that + ' .bg-id-' + cacheThis.index).length) {

                    var initialAppend = $('<div>',{
                        class: 'bg-id-' + cacheThis.index,
                        css: {
                            'width': '100%',
                            'height': '100%',
                            'overflow': 'hidden'
                        }
                    });

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
                            }).css({
                                'margin': 0,
                                'padding': 0,
                                'max-height': '100%',
                                'width': '100%',
                                'height': '100%'
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

                        $('<span>',{
                            class: 'gallery-bg-text',
                            css: {
                                'display': 'block',
                                'overflow': 'hidden',
                                'width': 'auto',
                                'margin': cacheThis.minSize/14 + 'px '+cacheThis.minSize/20 + 'px',
                                'text-align': 'left',
                                'font': cacheThis.minSize/14 + 'px Verdana, monospace'
                            }
                        }).text(cacheThis.arrayPicture[cacheThis.index]).appendTo(initialAppend);

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

        $(that + ' .gallery-zoom').on('touchstart', function (event) {
            event.stopPropagation();
            event.preventDefault();
            event.target.click();
        });

        $(that + ' .gallery-zoom').on('click', function () {
            var $modal_container =  $('.modal_container');
            var $modal_window =  $('.modal_window');
            var modalWidth = $modal_container.width();
            var modalHeight = $modal_container.height();
            var typeLink = cacheThis.arrayType[cacheThis.index];
            var $imgContainer = $modal_container.removeClass('displayNot').find('.content');
                switch(typeLink) {
                case('img'):
                    var $img = $('.gallery-bg-img', that + ' .bg-id-' + cacheThis.index);
                    var imgSrc = $img.attr('src');
                    var imgWidth = $img.data('width');
                    var imgHeight = $img.data('height');

                    // compute the best img position
                    var pos = cacheThis.computeOptimalImgPosition(modalWidth, modalHeight, imgWidth, imgHeight);

                    $modal_window.css({
                        width: pos.width,
                        height: pos.height,
                        'top': pos.top + 'px'
                    });
                    var $newImg = $('<img>', {
                        src: imgSrc,
                        class: "modal_bg_img"
                    });
                    $imgContainer.append($newImg);
                    break;
                case('video'):
                    var videoId = cacheThis.arrayPicture[cacheThis.index].match(/(vi\/)([^\/]*)/);
                    videoId = videoId[videoId.length-1];
                    var videoSrc = 'https://www.youtube.com/embed/'+videoId;
                    var pos = cacheThis.computeOptimalImgPosition(modalWidth, modalHeight, 740, 530);
                    $modal_window.css({
                        width: pos.width,
                        height: pos.height,
                        'top': pos.top + 'px'
                    });
                    $('<iframe>',{
                        width: pos.width,
                        height: pos.height,
                        'src': videoSrc,
                        'frameborder': 0,
                        'allowfullscreen': true
                    }).appendTo($imgContainer);
            }
        });

        $('.back_button').on('touchstart', function (event) {
            event.stopPropagation();
            event.preventDefault();
            event.target.click();
        });

        $('.back_button').on('click', function () {
           $('.modal_container').addClass('displayNot').find('.content').empty();

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