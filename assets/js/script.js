$('body').addClass('loaded');


var wow = new WOW({
    //	boxClass: 'wow', // default
    //	animateClass: 'animated', // default
    //	offset: 0, // default
    mobile: false, // default
    //live: false // default
    //	callback: function (box) {
    //	}
});
wow.init();


setTimeout(function () {
    $('body').addClass('loaded');
}, 4000);


var mapLoaded = false;

function loadMap() {
    if (mapLoaded) return;
    mapLoaded = true;
    $.getScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyAmWmdKbeYcWqCZrLJSoMV6ygZgELvWxmE", function () {
        $.getScript("assets/js/map.js", function () {});
    });
}


if ($('.js-map').length > 0) loadMap();


var fancyLoaded = false;

function loadFancy() {
    if (fancyLoaded) return;
    fancyLoaded = true;
    $('head').append($('<link rel="stylesheet" type="text/css" />').attr('href', 'https://cdnjs.cloudflare.com/ajax/libs/fancybox/3.1.25/jquery.fancybox.min.css'));
    $.getScript("https://cdnjs.cloudflare.com/ajax/libs/fancybox/3.1.25/jquery.fancybox.min.js", function () {
        $('.js-btn-modal').fancybox({
            animationDuration: 350,
            animationEffect: 'material',
            beforeShow: function (e) {
                var $par = e.group[e.currIndex].opts.$orig;

                if ($par.data('n') != '') {
                    var name = $par.data('n'),
                        $op = $('#modal_card select[name=card] option');
                    $op.attr('selected', false);
                    $op.each(function () {
                        if ($(this).text() == name) {
                            $(this).attr('selected', true);
                        }
                    });
                }
            }
        });

        $('.js-btn-vacan').fancybox({
            animationDuration: 350,
            animationEffect: 'material',
            beforeShow: function (e) {
                // console.log(e);
                var $par = e.group[e.currIndex].opts.$orig,
                    title = $par.closest('.item').find('.title').text();
                $('.js-v-name').text(title);
                $('input[name=vacan]').val(title);
            }
        });


        $('.js-btn-panorama').fancybox({
            touch: false,
            beforeShow: function (e) {
                $('#panorama').html('');
                console.log(e);
                var $par = e.group[e.currIndex].opts.$orig;
                pannellum.viewer('panorama', {
                    "type": "equirectangular",
                    "panorama": $par.data('url')
                });
            }
        });


        $('a[data-type=ajax]').fancybox({
            animationDuration: 350,
            animationEffect: 'material',
            arrows: false,
        });


        //		$('a[data-fancybox=gallery]').fancybox({
        //			animationEffect: "fade",
        //			toolbar: true,
        //			buttons: [
        //						//'slideShow',
        //						//'fullScreen',
        //						//'thumbs',
        //						'close'
        //					],
        //		});


    });
}







var g = {
    getOs: function () {
        var userAgent = navigator.userAgent || navigator.vendor || window.opera;
        if (/windows phone/i.test(userAgent)) {
            return "Windows Phone";
        }
        if (/android/i.test(userAgent)) {
            return "Android";
        }
        if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
            return "iOS";
        }
        return "unknown";
    }
}

var os = g.getOs(),
    eventClick = os == 'iOS' ? 'touchstart' : 'click';


function gAn($form) {
    var action = $form.find('input[name=action]').val(),
        list = {
            28: 'Podol',
            29: 'Arena',
            30: 'Poznyaki',
            31: 'Vasilkovskaya',
            32: 'Obolon',
            33: 'Odessa',
            34: 'VDNH',
            35: 'Sky Park',
            36: 'Atlet',
            37: 'Spartak',
            38: 'QCC',
            39: 'Gulliver',
            40: 'TsUM',
        };
    if (action == 'modal_tr') {
        var loc = $form.find('select[name=location]').val();
        //  console.log(list[loc]);
        var val = list[loc];
        if (!val) val = $form.find('select[name=location] option:checked').text();
        ga('send', 'event', 'Free training', val);
    }
    if (action == 'modal_test') {
        ga('send', 'event', 'Services', 'Testing');
    }
    if (action == 'modal_mas') {
        ga('send', 'event', 'Services', 'Massage');
    }
    if (action == 'modal_reb') {
        ga('send', 'event', 'Services', 'Rehab');
    }
    if (action == 'modal_person') {
        ga('send', 'event', 'Services', 'Online training');
    }
    if (action == 'vacan') {
        ga('send', 'event', 'Career', 'Send request');
    }
    if (action == 'modal_card') {
        var card = $form.find('select[name=card]').val();
        ga('send', 'event', 'Booking', card);
    }
    if (action == 'modal_def') {
        var card = $form.find('input[name=form]').val();
        if (card = 'Карта Лето, сайт (новость)') {
            ga('send', 'event', 'SummerCard', 'Reserve');
        } else {
            ga('send', 'event', 'Booking', card);
        }
    }


}


(function () {
    var form = {
        url: 'ajax',
        load: function (tpl, id) {
            var data = {
                data: tpl,
                action: 'loadForm'
            };

            if (id) data.id = id;

            $.ajax({
                url: this.url,
                type: "POST",
                data: data,
                success: function (data) {
                    $('#modal-content .modal-body').html(data);
                    $('#modal-content').modal('show');
                }
            });
        },
        valid: function (par) {
            var valid = true,
                name = '',
                patternEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            $(par).find("input.required, textarea.required").each(function (i, e) {
                $(e).removeClass("in-error");
                name = $(e).attr('name');
                if (name == 'email' && !patternEmail.test($(e).val())) {
                    if (valid)
                        $(e).focus();
                    $(e).addClass("in-error");
                    valid = false;
                }
                if ($(e).val() == "") {
                    if (valid)
                        $(e).focus();
                    $(e).addClass("in-error");
                    valid = false;
                }
            });
            return valid;
        },

        send: function (that) {
            var formData = new FormData($(that).get(0));
            $(that).addClass('loder');
            var action = $(that).data('action');
            if (action) formData.append('action', action);
            formData.append('pagetitle', $('title').text());
            formData.append('link', location.href);
            $.ajax({
                url: this.url,
                type: "POST",
                data: formData,
                dataType: 'json',
                contentType: false,
                processData: false,
                success: function (data) {
                    console.log(data);
                    txt = '<div class="alert alert-' + data.type + '">' + data.text + '</div>';
                    $(that).find('.btns').before(txt);
                    if (data.type == 'success') {
                        $(that).find('input[type=text], input[type=email]').val('');
                        $(that).find('textarea').val('');
                        gAn($(that));
                    }
                    $(that).removeClass('loder');
                    var time = 5000;
                    if (data.url) time = 3000;

                    setTimeout(function () {
                        $.fancybox.close();
                        if (data.url) {
                            location.href = data.url;
                        }
                        $('.alert').remove();
                        $('.js-in').removeClass('comp');
                    }, time);
                }
            });

        }
    }


    if ($('a[data-fancybox]').length > 0) {
        loadFancy();
    }

    // copy nav
    $('body').append('<div class="mob-nav"><div class="close-modal hidden-lg"></div><div class="main-nav">' + $('.main-nav').html() + '</div></div>');


    // mob mav
    $(document).on(eventClick, '.js-open-nav', function () {
        $('.mob-nav').addClass('active');
        $('body').append('<div class="mask-site"></div>');
        setTimeout(function () {
            $('body').addClass('o-hide');
        }, 10);
    });

    $(document).on(eventClick, '.mask-site, .close-modal', function () {
        $('.mob-nav').removeClass('active');
        $('.mask-site').remove();
        setTimeout(function () {
            $('body').removeClass('o-hide');
        }, 100);

    });


    $(document).on('submit', '.js-form', function (e) {
        e.preventDefault();
        if (form.valid(this)) {
            form.send(this);
        }
    });

    $(document).on('click', '.js-form-call', function (e) {
        form.load('form-call');
    });


    if ($('a[href="#"]').length > 0) {
        $(document).on('click', 'a[href="#"]', function (e) {
            e.preventDefault();
        })
    }

    $('.main-slider').owlCarousel({
        loop: false,
        margin: 0,
        nav: true,
        dots: false,
        items: 1,
        center: true,
        autoplay: true,
        smartSpeed: 900,
        autoplaySpeed: 900,
        autoplayTimeout: 6000,
        navText: ['<svg><use xlink:href="#icon-arr"></use></svg>', '<svg><use xlink:href="#icon-arr"></use></svg>'],
        responsiveClass: true,
        //   mouseDrag: true,
        //  touchDrag: false,
        responsive: {
            0: {
                items: 1,
                autoHeight: true,
                mouseDrag: false,
                touchDrag: true
            },
            600: {
                items: 1,
                autoHeight: true,
                mouseDrag: false,
                touchDrag: true
            },
        }
    });

    $('.class-list').owlCarousel({
        loop: true,
        margin: 0,
        nav: false,
        dots: false,
        items: 2,
        center: true,
        //  autoplay: true,
        smartSpeed: 900,
        autoplaySpeed: 900,
        autoplayTimeout: 6000,
        //  navText: ['<svg><use xlink:href="#icon-arr"></use></svg>', '<svg><use xlink:href="#icon-arr"></use></svg>'],
        responsiveClass: true,
        responsive: {
            0: {
                items: 1,
                autoHeight: true,
                mouseDrag: false,
                touchDrag: true
            },
            600: {
                items: 2,
                margin: 60,
                autoHeight: true,
                mouseDrag: false,
                touchDrag: true
            },
            1200: {
                items: 2
            },
            1500: {
                items: 2
            }
        }
    });

    $('.news-list.owl-carousel').owlCarousel({
        loop: true,
        margin: 45,
        nav: true,
        dots: true,
        items: 2,
        //  center: true,
        //  autoplay: true,
        smartSpeed: 900,
        autoplaySpeed: 900,
        autoplayTimeout: 6000,
        navText: ['', ''],
        responsiveClass: true,
        responsive: {
            0: {
                items: 1,
                autoHeight: true,
                mouseDrag: false,
                touchDrag: true
            },
            600: {
                items: 1,
                autoHeight: true,
                mouseDrag: false,
                touchDrag: true

            },
            1000: {
                items: 2
            }
        }
    });


    $('.list-comand.owl-carousel').owlCarousel({
        loop: false,
        margin: 25,
        nav: true,
        dots: true,
        items: 2,
        //  center: true,
        //  autoplay: true,
        smartSpeed: 900,
        autoplaySpeed: 900,
        autoplayTimeout: 6000,
        navText: ['', ''],
        responsiveClass: true,
        responsive: {
            0: {
                items: 1,
                autoHeight: true,
                mouseDrag: false,
                touchDrag: true
            },
            600: {
                items: 2,
                autoHeight: true,
                mouseDrag: false,
                touchDrag: true
            },
            1000: {
                margin: 45,
                items: 2
            },
            1300: {
                margin: 65,
                items: 2

            }
        }
    });

    $('.nav-clubs-slider.owl-carousel').owlCarousel({
        margin: 60,
        loop: false,
        autoWidth: true,
        nav: true,
        dots: false,
        navText: ['', ''],
        items: 5,
        responsiveClass: true,
        responsive: {
            0: {
                margin: 20,
                autoHeight: true,
                mouseDrag: false,
                touchDrag: true
            },
            600: {
                margin: 20,
                autoHeight: true,
                mouseDrag: false,
                touchDrag: true
            },
            1000: {
                margin: 30,
            },
            1300: {
                margin: 50,

            }
        }
    });

    function runGal() {
        $('.clubs-gal.owl-carousel').owlCarousel({
            loop: false,
            margin: 20,
            nav: true,
            dots: false,
            items: 2,
            //  center: true,
            //  autoplay: true,
            //  smartSpeed: 900,
            //   autoplaySpeed: 900,
            //   autoplayTimeout: 6000,
            navText: ['', ''],
            responsiveClass: true,
            responsive: {
                0: {
                    items: 2,
                    autoHeight: true,
                    mouseDrag: false,
                    touchDrag: true
                },
                600: {
                    items: 3,
                    autoHeight: true,
                    mouseDrag: false,
                    touchDrag: true
                },
                1000: {
                    items: 3
                },
                1300: {
                    margin: 20,
                    items: 4

                }
            }
        });
    }

    if ($('.clubs-gal').length > 0) {
        runGal();
    }

    $('input[name=phone]').mask('+38(000) 000 00 00');


    $(document).on(eventClick, '.list-city a', function (e) {
        e.preventDefault();
        var $par = $(this).closest('.list-city');
        $par.find('a').removeClass('active');
        $(this).addClass('active');
    });

    // scroll header
    $('.js-scroll').on(eventClick, function (e) {
        e.preventDefault();
        $('body').scrollTo($(this).attr('href'), 500, {
            offset: -$('.line1').outerHeight()
        });
    });


    if ($(window).width() > 1200 && $('.main-nav').length > 0) {
        $('.main-nav').prepend('<div class="sh"></div>');
        $('.main-nav > ul > li > a').hover(function () {
            $('.main-nav .sh').css({
                left: $(this).offset().left + 'px',
                width: $(this).outerWidth(),
                height: $(this).outerHeight()
            });
        });
    }


    $('.fixed-action-btn').hover(function (e) {
        $('.fixed-action-btn ul li').show();
        setTimeout(function () {
            $('.fixed-action-btn ul').addClass('anim');
        }, 300);
    }, function () {
        $('.fixed-action-btn ul li').hide();
        $('.fixed-action-btn ul').removeClass('anim');
    });

    $(document).on(eventClick, '.more-info .close', function (e) {
        $(this).parent().removeClass('active');
    });


    $(document).on(eventClick, '.js-nav-block a', function (e) {
        var city = $(this).data('center');
        $('.js-city').removeClass('active');
        $('.js-city').hide();
        $('.js-city[data-city=' + city + ']').show().addClass('active');
    });


    $(document).on(eventClick, '.js-nav-trener a', function (e) {
        $('.js-nav-trener li').removeClass('active');
        $(this).parent().addClass('active');
        e.preventDefault();
        var id = $(this).data('id');
        if ($(this).data('center') == 'odessa') {
            $('.nav-clubs').hide();
        } else {
            $('.nav-clubs').show();
        }
        $.post("ajax", {
            id: id,
            action: "getTrener"
        }, function (data) {
            $('.list-tr .row').html(data);
        });
    });


    $(document).on(eventClick, '.js-nav-clubs a', function (e) {
        e.preventDefault();
        var id = $(this).data('id'),
            city = $(this).data('city');

        if (city == 'kiev') {
            $('.nav-clubs').show();
            //  return;
        } else if (city == 'odessa') {
            $('.nav-clubs').hide();
        }

        $('.js-nav-clubs li').removeClass('active');
        $(this).parent().addClass('active');

        $('#clubGal').addClass('loder');
        $.post("ajax", {
            id: id,
            action: "getGal"
        }, function (data) {
            var hei = $('#clubGal a img').height();
            $('#clubGal').html(data);
            $('#clubGal a img').css('height', hei + 'px');
            runGal();
            $('#clubGal').removeClass('loder');
        });
        return false;
    });


    $(document).on(eventClick, '.js-city-cart a', function () {
        $('.js-card-block .js-btn-modal').attr('data-n', $(this).data('n'));
    });


})();