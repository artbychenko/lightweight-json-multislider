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

//-----------------$gallery inner block start

            var galleryItem = $('<div>',{
                class: 'bg-id-' + cacheThis.index,
                css: {
                    'width': '100%',
                    'height': '100%',
                    'overflow': 'hidden'
                }
            }).append(newImage);

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
            }).append(Slider.svg.prev_slide);

            var $rightArrow = $('<div>',{
               class: 'gallery-right-arrow',
                css: {
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
            }).append(Slider.svg.next_slide);

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

            $gallery.append(galleryItem).append($galleryTitleAndControl);

//-----------------$gallery inner block end

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
                class: 'spinner',
                css: {
                    'position': 'absolute',
                    'left': '50%',
                    'top': '50%',
                    'z-index': 1,
                    'margin-left': '-16px',
                    'margin-top': '-16px',
                    'width': '32px',
                    'height': '32px'
                }
            }).append(Slider.svg.icon_spin);

            $main.append($galleryName);//.append($spinner);

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
        $(that + ' .spinner').show();
    },

    hideSpinner: function () {
        var that = this.selector;
        $(that + ' .spinner').hide();
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
                $zoom.empty().append(Slider.svg.icon_play);
                break;
            case 'img':
                $zoom.empty().append(Slider.svg.icon_zoom);
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
Slider.svg = {
    prev_slide:
        [
            '<svg version="1.1" id="_x32_0_x25__1_" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px"',
            'y="0px" viewBox="-295 386 21 21" style="position: absolute; enable-background:new -295 386 21 21;" xml:space="preserve">',
            '<style type="text/css">',
            '.st0{fill:#FFFFFF;}',
            '</style>',
            '<path class="st0" d="M-295,396.5c0,5.8,4.7,10.5,10.5,10.5s10.5-4.7,10.5-10.5s-4.7-10.5-10.5-10.5S-295,390.7-295,396.5z',
            'M-288,396.4l3.8-4.6l1.9,0.3l-3.6,4.4l3.5,4.3l-1.8,0.2L-288,396.4z"/>',
            '</svg>'
        ].join('\n'),
    next_slide:
        [
            '<svg version="1.1" id="_x32_0_x25__1_" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px"',
            'y="0px" viewBox="-295 386 21 21" style="position: absolute; enable-background:new -295 386 21 21;" xml:space="preserve">',
            '<style type="text/css">',
            '.st0{fill:#FFFFFF;}',
            '</style>',
            '<path class="st0" d="M-284.5,386c-5.8,0-10.5,4.7-10.5,10.5s4.7,10.5,10.5,10.5s10.5-4.7,10.5-10.5S-278.8,386-284.5,386z',
            'M-284.8,401l-1.9-0.3l3.5-4.3l-3.7-4.3l1.9-0.3l3.8,4.6L-284.8,401z"/>',
            '</svg>'
        ].join('\n'),
    icon_play:
        [
            '<svg version="1.1" id="icon_x5F_video_x5F_no_x5F_hover_x5F_effect_1_"',
            'xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="-284 376 42 42"',
            'style="position: absolute; enable-background:new -284 376 42 42;" xml:space="preserve">',
            '<style type="text/css">',
            '.st0{fill:#FFFFFF;}',
            '</style>',
            '<path class="st0" d="M-263,376c-11.6,0-21,9.4-21,21s9.4,21,21,21s21-9.4,21-21S-251.4,376-263,376z M-267,405v-15.9l12,8L-267,405z"/>',
            '</svg>'
        ].join('\n'),
    icon_zoom:
        [
            '<svg version="1.1" id="icon_x5F_image_x5F_no_x5F_hover_1_"',
            'xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="-284 376 42 42"',
            'style="position: absolute; enable-background:new -284 376 42 42;" xml:space="preserve">',
            '<style type="text/css">',
            '.st0{fill:#FFFFFF;}',
            '</style>',
            '<g id="icon_x5F_image_x5F_no_x5F_hover">',
            '<g>',
            '<path class="st0" d="M-264,391c-2.8,0-5,2.3-5,5c0,2.8,2.3,5,5,5c2.8,0,5-2.3,5-5C-259,393.2-261.2,391-264,391z M-263,376',
            'c-11.6,0-21,9.4-21,21s9.4,21,21,21s21-9.4,21-21S-251.4,376-263,376z M-254,406h-1.6l-4.3-4.2c-1.2,0.8-2.6,1.3-4.1,1.3',
            'c-3.9,0-7-3.1-7-7s3.1-7,7-7s7,3.1,7,7c0,1.5-0.5,2.9-1.3,4.1l4.3,4.2V406z"/>',
            '</g>',
            '</g>',
            '</svg>'
        ].join('\n'),
    icon_close:
        [
            '<svg version="1.1" id="icon_x5F_close_x5F_hover_1_"',
            'xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="-291 383 28 28"',
            'style="position: absolute; enable-background:new -291 383 28 28;" xml:space="preserve">',
            '<style type="text/css">',
            '.st0{fill:#FFFFFF;}',
            '</style>',
            '<g id="icon_x5F_close_x5F_hover">',
            '<g>',
            '<path class="st0" d="M-277,383c-7.7,0-14,6.3-14,14s6.3,14,14,14s14-6.3,14-14S-269.3,383-277,383z M-270.9,401.5l-0.3,1.3',
            'l-1.3,0.3l-4.5-4.5l-4.4,4.5l-1.4-0.3l-0.3-1.3l4.5-4.5l-4.4-4.5l0.2-1.3l1.4-0.3l4.5,4.4l4.5-4.4l1.3,0.3l0.3,1.3l-4.6,4.5',
            'L-270.9,401.5z"/>',
            '</g>',
            '</g>',
            '</svg>'
        ].join('\n'),
    icon_spin:
        [
            '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"',
            'viewBox="-289 381 32 32" style="position: absolute; enable-background:new -289 381 32 32;" xml:space="preserve">',
            '<style type="text/css">',
            '.st0{fill:none;}',
            '.st1{fill:#00B2FF;}',
            '</style>',
            '<rect x="-289" y="381" class="st0" width="32" height="32"/>',
            '<path class="st1" d="M-273,384.2L-273,384.2c0.6,0,1.1,0.7,1.1,1.6v3.2c0,0.9-0.5,1.6-1.1,1.6l0,0c-0.6,0-1.1-0.7-1.1-1.6v-3.2',
            'C-274.1,384.9-273.6,384.2-273,384.2z">',
            '<animate  fill="remove" begin="0s" to="0" from="1" repeatCount="indefinite" restart="always" calcMode="linear" accumulate="none" additive="replace" dur="1s" attributeName="opacity">',
            '</animate>',
            '</path>',
            '<path class="st1" d="M-266.6,385.9L-266.6,385.9c0.5,0.3,0.6,1.2,0.2,1.9l-1.6,2.8c-0.4,0.8-1.2,1.1-1.8,0.8l0,0',
            'c-0.5-0.3-0.6-1.2-0.2-1.9l1.6-2.8C-267.9,386-267.1,385.6-266.6,385.9z">',
            '<animate  fill="remove" begin="0.08333333333333333s" to="0" from="1" repeatCount="indefinite" restart="always" calcMode="linear" accumulate="none" additive="replace" dur="1s" attributeName="opacity">',
            '</animate>',
            '</path>',
            '<path class="st1" d="M-261.9,390.6L-261.9,390.6c0.3,0.5-0.1,1.3-0.8,1.8l-2.8,1.6c-0.8,0.4-1.6,0.4-1.9-0.2l0,0',
            'c-0.3-0.5,0.1-1.3,0.8-1.8l2.8-1.6C-263.1,390-262.2,390.1-261.9,390.6z">',
            '<animate  fill="remove" begin="0.16666666666666666s" to="0" from="1" repeatCount="indefinite" restart="always" calcMode="linear" accumulate="none" additive="replace" dur="1s" attributeName="opacity">',
            '</animate>',
            '</path>',
            '<path class="st1" d="M-260.2,397L-260.2,397c0,0.6-0.7,1.1-1.6,1.1h-3.2c-0.9,0-1.6-0.5-1.6-1.1l0,0c0-0.6,0.7-1.1,1.6-1.1h3.2',
            'C-260.9,395.9-260.2,396.4-260.2,397z">',
            '<animate  fill="remove" begin="0.25s" to="0" from="1" repeatCount="indefinite" restart="always" calcMode="linear" accumulate="none" additive="replace" dur="1s" attributeName="opacity">',
            '</animate>',
            '</path>',
            '<path class="st1" d="M-261.9,403.4L-261.9,403.4c-0.3,0.5-1.2,0.6-1.9,0.2l-2.8-1.6c-0.8-0.4-1.1-1.2-0.8-1.8l0,0',
            'c0.3-0.5,1.2-0.6,1.9-0.2l2.8,1.6C-262,402.1-261.6,402.9-261.9,403.4z">',
            '<animate  fill="remove" begin="0.3333333333333333s" to="0" from="1" repeatCount="indefinite" restart="always" calcMode="linear" accumulate="none" additive="replace" dur="1s" attributeName="opacity">',
            '</animate>',
            '</path>',
            '<path class="st1" d="M-266.6,408.1L-266.6,408.1c-0.5,0.3-1.3-0.1-1.8-0.8l-1.6-2.8c-0.4-0.8-0.4-1.6,0.2-1.9l0,0',
            'c0.5-0.3,1.3,0.1,1.8,0.8l1.6,2.8C-266,406.9-266.1,407.8-266.6,408.1z">',
            '<animate  fill="remove" begin="0.4166666666666667s" to="0" from="1" repeatCount="indefinite" restart="always" calcMode="linear" accumulate="none" additive="replace" dur="1s" attributeName="opacity">',
            '</animate>',
            '</path>',
            '<path class="st1" d="M-273,409.8L-273,409.8c-0.6,0-1.1-0.7-1.1-1.6V405c0-0.9,0.5-1.6,1.1-1.6l0,0c0.6,0,1.1,0.7,1.1,1.6v3.2',
            'C-271.9,409.1-272.4,409.8-273,409.8z">',
            '<animate  fill="remove" begin="0.5s" to="0" from="1" repeatCount="indefinite" restart="always" calcMode="linear" accumulate="none" additive="replace" dur="1s" attributeName="opacity">',
            '</animate>',
            '</path>',
            '<path class="st1" d="M-279.4,408.1L-279.4,408.1c-0.5-0.3-0.6-1.2-0.2-1.9l1.6-2.8c0.4-0.8,1.2-1.1,1.8-0.8l0,0',
            'c0.5,0.3,0.6,1.2,0.2,1.9l-1.6,2.8C-278.1,408-278.9,408.4-279.4,408.1z">',
            '<animate  fill="remove" begin="0.5833333333333334s" to="0" from="1" repeatCount="indefinite" restart="always" calcMode="linear" accumulate="none" additive="replace" dur="1s" attributeName="opacity">',
            '</animate>',
            '</path>',
            '<path class="st1" d="M-284.1,403.4L-284.1,403.4c-0.3-0.5,0.1-1.3,0.8-1.8l2.8-1.6c0.8-0.4,1.6-0.4,1.9,0.2l0,0',
            'c0.3,0.5-0.1,1.3-0.8,1.8l-2.8,1.6C-282.9,404-283.8,403.9-284.1,403.4z">',
            '<animate  fill="remove" begin="0.6666666666666666s" to="0" from="1" repeatCount="indefinite" restart="always" calcMode="linear" accumulate="none" additive="replace" dur="1s" attributeName="opacity">',
            '</animate>',
            '</path>',
            '<path class="st1" d="M-285.8,397L-285.8,397c0-0.6,0.7-1.1,1.6-1.1h3.2c0.9,0,1.6,0.5,1.6,1.1l0,0c0,0.6-0.7,1.1-1.6,1.1h-3.2',
            'C-285.1,398.1-285.8,397.6-285.8,397z">',
            '<animate  fill="remove" begin="0.75s" to="0" from="1" repeatCount="indefinite" restart="always" calcMode="linear" accumulate="none" additive="replace" dur="1s" attributeName="opacity">',
            '</animate>',
            '</path>',
            '<path class="st1" d="M-284.1,390.6L-284.1,390.6c0.3-0.5,1.2-0.6,1.9-0.2l2.8,1.6c0.8,0.4,1.1,1.2,0.8,1.8l0,0',
            'c-0.3,0.5-1.2,0.6-1.9,0.2l-2.8-1.6C-284,391.9-284.4,391.1-284.1,390.6z">',
            '<animate  fill="remove" begin="0.8333333333333334s" to="0" from="1" repeatCount="indefinite" restart="always" calcMode="linear" accumulate="none" additive="replace" dur="1s" attributeName="opacity">',
            '</animate>',
            '</path>',
            '<path class="st1" d="M-279.4,385.9L-279.4,385.9c0.5-0.3,1.3,0.1,1.8,0.8l1.6,2.8c0.4,0.8,0.4,1.6-0.2,1.9l0,0',
            'c-0.5,0.3-1.3-0.1-1.8-0.8l-1.6-2.8C-280,387.1-279.9,386.2-279.4,385.9z">',
            '<animate  fill="remove" begin="0.9166666666666666s" to="0" from="1" repeatCount="indefinite" restart="always" calcMode="linear" accumulate="none" additive="replace" dur="1s" attributeName="opacity">',
            '</animate>',
            '</path>',
            '</svg>'
        ].join('\n')
};

Slider.gallery =[];

module.exports = Slider;