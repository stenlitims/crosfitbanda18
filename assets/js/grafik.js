"use strict";

loadFancy();



var weak = [{
            day: 'Понедельник',
            num: 1
        },
        {
            day: 'Вторник',
            num: 2
        },
        {
            day: 'Среда',
            num: 3
        },
        {
            day: 'Четверг',
            num: 4
        },
        {
            day: 'Пятница',
            num: 5
        },
        {
            day: 'Суббота',
            num: 6
        },
        {
            day: 'Воскресенье',
            num: 0
        }
    ],
    hours = ['07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22'];

var app = new Vue({
    el: '.inner-page',
    data: {
        weak: $.extend(true, [], weak),
        hours: hours,
        items: {},
        days: {},
        today: new Date().toLocaleDateString(),
        list: {},
        d: false,
        dateFirst: '',
        dateLast: '',
        modal: 1,
        cal: '',
        city: 'kiev',
        navActive: true
    },
    created: function () {
        this.city = $('.list-city .active').data('city');
        if (this.city == 'odessa') {
            this.cal = $('.list-city .active').data('cal');
            console.log(this.cal);
        } else {
            if ($('.nav-clubs .active').length > 0) {
                this.cal = $('.nav-clubs .active a').data('cal');
            } else {
                $('.nav-clubs li:first-child').addClass('active');
                this.cal = $('.nav-clubs li:first-child a').data('cal');
            }
        }
        this.fetchData(new Date());
    },
    updated: function () {
        $('[data-tipso]').tipso();
    },
    methods: {
        fetchData: function (date) {
            date.setHours(23.59);
            var timeMax = new Date(date),
                day = timeMax.getDay();
            timeMax.setDate(timeMax.getDate() - day);
            date.setDate(date.getDate() + (7 - day));
            var that = this,
                timeMin = date;
            $.getJSON(
                'https://www.googleapis.com/calendar/v3/calendars/' + this.cal + '/events?key=AIzaSyBn_wC3Z9gd6ba4YmIRKzmy5nkXlrZPqN4&timeMin=' + timeMax.toJSON() + '&timeMax=' + timeMin.toJSON() + '&singleEvents=true&maxResults=9999',
                function (d, textStatus, jqXHR) {
                    app.items = d;
                    app.getDays(d);
                }
            )

        },
        getDays: function (data) {
            var weak2 = $.extend(true, [], weak),
                list = {};
            data.items.forEach(item => {
                if (item.start) {
                    if (item.status == 'cancelled') return;
                    var lDate = new Date(item.start.dateTime);
                    weak2.forEach((day, i) => {
                        if (!weak2[i].date) {
                            if (day.num == lDate.getDay()) {
                                weak2[i].date = lDate.toLocaleDateString();
                                weak2[i].dateO = lDate;
                            }
                        }
                        var day = lDate.getDay();
                        var tempH = {},
                            tempHar = [];
                        if (!list[day]) list[day] = {};
                        this.hours.forEach(h => {
                            if (!list[day][h]) list[day][h] = {};
                            if (lDate.getHours() == h && !list[day][h][item.id]) {
                                var ds = item.description.split('\n');
                                item.name = ds[ds.length - 2];
                                //console.log(ds);
                                var type = ds[ds.length - 1];
                                if (type != 'включен в карту') {
                                    item.class = 'red';
                                }
                                list[day][h][item.id] = item;
                            }
                        });

                    });
                }
            });
            this.weak = weak2;
            this.list = list;
            this.dateLast = weak2[weak2.length - 1].dateO;
            this.dateFirst = weak2[0].dateO;

        },
        page: function (val) {
            if (val == 'next') {
                var date = this.weak[this.weak.length - 1].dateO;
                this.fetchData(new Date(date.setDate(date.getDate() + 7)));
            }
            if (val == 'prev') {
                var date = this.weak[0].dateO;
                this.fetchData(new Date(date.setDate(date.getDate() - 7)));
            }
        },
        setModal: function (val) {
            this.modal = val;
            $.fancybox.open({
                src: '.modal-d',
                type: 'inline'
            });
        },
        nav: function (e) {
            e.preventDefault();
            // console.log($(e.target).data('cal'));
            $('.nav-clubs li').removeClass('active');
            $(e.target).parent().addClass('active');
            this.cal = $(e.target).data('cal');
            this.fetchData(new Date());

            history.pushState(null, $(e.target).text(), $(e.target).attr('href'));
        },
        setCity: function (e) {
            this.city = $(e.target).data('city');
            if (this.city == 'odessa') {
                this.navActive = false;
                this.cal = $(e.target).data('cal');
            } else {
                this.navActive = true;
                this.cal = $('.nav-clubs .active a').data('cal');
            }
            this.fetchData(new Date());
        }
    },
    filters: {
        time: function (value) {
            if (!value) return '';
            var date = new Date(value),
                min = date.getMinutes();
            if (min == 0) min = '00';
            var out = date.getHours() + ':' + min;
            return out;
        },
        day: function (value) {
            if (!value) return '';
            var date = new Date(value);
            return date.getDate();
        },
        year: function (value) {
            if (!value) return '';
            var date = new Date(value);
            return date.getFullYear();
        },
        month: function (value) {
            if (!value) return '';
            var date = new Date(value);
            var monthNames = [
                "Январь", "Февраль", "Март",
                "Апрель", "Май", "Июнь", "Июль",
                "Август", "Сентябрь", "Октябрь",
                "Ноябрь", "Декабрь"
            ];
            var monthIndex = date.getMonth();
            return monthNames[monthIndex];
        }
    },
    computed: {}
});