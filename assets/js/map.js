(function ($) {
    var map,
        dataMap = null,
        styles = [{
            "featureType": "all",
            "elementType": "labels.text.fill",
            "stylers": [{
                "saturation": 36
            }, {
                "color": "#000000"
            }, {
                "lightness": 40
            }]
        }, {
            "featureType": "all",
            "elementType": "labels.text.stroke",
            "stylers": [{
                "visibility": "on"
            }, {
                "color": "#000000"
            }, {
                "lightness": 16
            }]
        }, {
            "featureType": "all",
            "elementType": "labels.icon",
            "stylers": [{
                "visibility": "off"
            }]
        }, {
            "featureType": "administrative",
            "elementType": "geometry.fill",
            "stylers": [{
                "color": "#000000"
            }, {
                "lightness": 20
            }]
        }, {
            "featureType": "administrative",
            "elementType": "geometry.stroke",
            "stylers": [{
                "color": "#000000"
            }, {
                "lightness": 17
            }, {
                "weight": 1.2
            }]
        }, {
            "featureType": "landscape",
            "elementType": "geometry",
            "stylers": [{
                "color": "#000000"
            }, {
                "lightness": 20
            }]
        }, {
            "featureType": "poi",
            "elementType": "geometry",
            "stylers": [{
                "color": "#000000"
            }, {
                "lightness": 21
            }]
        }, {
            "featureType": "road.highway",
            "elementType": "geometry.fill",
            "stylers": [{
                "color": "#000000"
            }, {
                "lightness": 17
            }]
        }, {
            "featureType": "road.highway",
            "elementType": "geometry.stroke",
            "stylers": [{
                "color": "#000000"
            }, {
                "lightness": 29
            }, {
                "weight": 0.2
            }]
        }, {
            "featureType": "road.arterial",
            "elementType": "geometry",
            "stylers": [{
                "color": "#000000"
            }, {
                "lightness": 18
            }]
        }, {
            "featureType": "road.local",
            "elementType": "geometry",
            "stylers": [{
                "color": "#000000"
            }, {
                "lightness": 16
            }]
        }, {
            "featureType": "transit",
            "elementType": "geometry",
            "stylers": [{
                "color": "#000000"
            }, {
                "lightness": 19
            }]
        }, {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [{
                "color": "#000000"
            }, {
                "lightness": 17
            }]
        }];


    var citys = {
            'kiev': {
                zoom: 11,
                center: new google.maps.LatLng(50.4619838, 30.534791)
            },
            'odessa': {
                zoom: 14,
                center: new google.maps.LatLng(46.4122406, 30.707520499999987)
            }
        },
        mapOptions = {
            zoom: citys.kiev.zoom,
            center: citys.kiev.center,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            scrollwheel: false,
            mapTypeControl: false,
            scaleControl: false,
            styles: styles
        };


    function setCenter(city) {
        map.setCenter(city.center);
        map.setZoom(city.zoom);
    }


    if ($('#map').length > 0) {

        map = new google.maps.Map(document.getElementById('map'), mapOptions);
        var InfoBoxs = [],
            markers = [];

        $.getJSON("ajax?action=mapLoc", function (dataMap) {
            //console.log(dataMap);
            $.each(dataMap, function (index) {
                if (this.cord) {
                    var cord = this.cord.split(',');
                    markers[index] = new google.maps.Marker({
                        position: {
                            lat: +cord[0],
                            lng: +cord[1]
                        },
                        map: map,
                        title: this.name,
                        icon: {
                            url: '/assets/images/' + this.pin + '.png',
                        }
                    });
                    InfoBoxs[index] = new google.maps.InfoWindow({
                        content: '<div class="wr-loc">' + this.title + '</div>'
                    });

                    google.maps.event.addListener(markers[index], 'click', function (i) {
                        markers.forEach(function (item, i) {
                            InfoBoxs[i].close();
                        });
                        InfoBoxs[index].open(map, markers[index]);
                    });
                }
            });
        });


        $(document).on(eventClick, '.js-map-nav a', function () {
            var city = $(this).data('center');
            setCenter(citys[city]);
            $('.footer-clubs').removeClass('active');
            $('.footer-clubs.' + city).addClass('active');
        });


        $(document).on(eventClick, '.footer-clubs .col', function (e) {
            e.preventDefault();
            var id = $(this).data('id');
            markers.forEach(function (item, i) {
                InfoBoxs[i].close();
            });
            InfoBoxs[id].open(map, markers[id]);

            $('body').scrollTo('#map', 500, {
                //    offset: -$('.line1').outerHeight()
            });

        });

        
    }


    if ($('#map-club').length > 0) {
        mapOptions.center = new google.maps.LatLng(clubC[0], clubC[1]);
        mapOptions.zoom = 16;
        var map = new google.maps.Map(document.getElementById('map-club'), mapOptions);
        var marker = new google.maps.Marker({
            position: {
                lat: +clubC[0],
                lng: +clubC[1]
            },
            map: map,
            title: clubTitle,
            icon: {
                url: '/assets/img/map-marker.png',
            }
        });
        var InfoBox = new google.maps.InfoWindow({
            content: '<p class="content-map"><b>' + clubTitle + '</b><br>' + clubAdress + '<br><a href="tel:' + clubPhone + '">' + clubPhone + '</a></p>'
        });
        google.maps.event.addListener(marker, 'click', function (i) {
            InfoBox.open(map, marker);

        });

    }

})(jQuery);