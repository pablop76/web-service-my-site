$(document).ready(function () {
    $('nav').hover(function () {
        $('nav ul').stop().hide().slideDown(500).css('display', 'block');
    }, function () {
        $('nav ul').stop().slideUp(500);
    }); //koniec hover menu
    $('a[href^="#"]').click(function (e) { //przewijanie strony
        e.preventDefault();
        var hash = $(this).attr('href');
        $('html, body').animate({
            scrollTop: $(hash).offset().top - 10
        }, 1500);
        return false;
    }); //koniec przewijania do #
    $('#scrollTop').hide();
    $(window).scroll(function () {
        if ($(this).scrollTop() > 500) {
            $('#scrollTop').fadeIn(500);
        } else {
            $('#scrollTop').fadeOut(500);
        }
    }); //pokaz/ukryj scrollTop
    $("#contactForm").validate({
        rules: {
            name: "required",
            message: "required",
            email: {
                required: true,
                email: true
            }
        },
        messages: {
            name: "Prosze podać imię i nazwisko",
            email: {
                required: "Musimy mieć Twój adres email, aby skontaktować się z Tobą",
                email: "Twój adres e-mail musi mieć formę np: name@domain.com"
            },
            message: "Proszę wpisz swoją wiadomość"
        }
    });
    $(function () {
        var $inputs = $('form input[required], form textarea[required], select[required]');

        var displayFieldError = function ($elem) {
            var $fieldRow = $elem.closest('.form-row');
            var $fieldError = $fieldRow.find('.field-error');
            if (!$fieldError.length) {
                var errorText = $elem.attr('data-error');
                var $divError = $('<div class="field-error">' + errorText + '</div>');
                $fieldRow.append($divError);
            }
        };

        var hideFieldError = function ($elem) {
            var $fieldRow = $elem.closest('.form-row');
            var $fieldError = $fieldRow.find('.field-error');
            if ($fieldError.length) {
                $fieldError.remove();
            }
        };

        $inputs.on('input', function () {
            var $elem = $(this);
            if (!$elem.get(0).checkValidity()) {
                $elem.addClass('error');
            } else {
                $elem.removeClass('error');
                hideFieldError($elem);
            }
        });

        $inputs.filter(':checkbox').on('click', function () {
            var $elem = $(this);
            var $row = $(this).closest('.form-row');
            if ($elem.is(':checked')) {
                $elem.removeClass('error');
                hideFieldError($elem);
            } else {
                $elem.addClass('error');
            }
        });

        var checkFieldsErrors = function () {
            //ustawiamy zmienną na true. Następnie robimy pętlę po wszystkich polach
            //jeżeli któreś z pól jest błędne, przełączamy zmienną na false.
            var fieldsAreValid = true;
            $inputs.each(function (i, elem) {
                var $elem = $(elem);
                //if (new RegExp(pattern).test($elem.val())) {
                if (elem.checkValidity()) {
                    hideFieldError($elem);
                    $elem.removeClass('error');
                } else {
                    displayFieldError($elem);
                    $elem.addClass('error');
                    fieldsAreValid = false;
                }
            });
            return fieldsAreValid;
        };

        $('.form').on('submit', function (e) {
            e.preventDefault();

            var $form = $(this);

            if (checkFieldsErrors()) {
                var dataToSend = $form.serializeArray();
                dataToSend = dataToSend.concat(
                    $form.find('input:checkbox:not(:checked)').map(function () {
                        return {
                            "name": this.name,
                            "value": this.value
                        }
                    }).get()
                );

                var $submit = $form.find(':submit');
                $submit.prop('disabled', 1);
                $submit.addClass('element-is-busy');

                $.ajax({
                    url: $form.attr('action'),
                    method: $form.attr('method'),
                    dataType: 'json',
                    data: dataToSend,
                    success: function (ret) {
                        if (ret.errors) {
                            ret.errors.map(function (el) {
                                return '[name="' + el + '"]'
                            });
                            checkFieldsErrors($form.find(ret.errors.join(',')));
                        } else {
                            if (ret.status == 'ok') {
                                $form.replaceWith('<div class="form-send-success"><strong>Wiadomość została wysłana</strong><span>Dziękujemy za kontakt. Postaramy się odpowiedzieć jak najszybciej</span></div>');
                            }
                            if (ret.status == 'error') {
                                $submit.after('<div class="send-error">Wysłanie wiadomości się nie powiodło</div>');
                            }
                        }
                    },
                    error: function () {
                        console.error('Wystąpił błąd z połączeniem');
                    },
                    complete: function () {
                        $submit.prop('disabled', 0);
                        $submit.removeClass('element-is-busy');
                    }
                });
            }
        })
    });
    var fooReveal = { /*początek pluginu scrollreveal*/

        delay: 200,
        distance: '90px',
        easing: 'ease-in-out',
        rotate: {
            z: 10
        },
        scale: 1.1
    };
    window.sr = ScrollReveal({
        duration: 1000,
        delay: 500
    }, 50);
    sr.reveal('h2');
    sr.reveal('.obaut img');
    sr.reveal('blockquote');
    sr.reveal('.main .row .col-4');
    sr.reveal('article');
    sr.reveal('form');
    sr.reveal('.social');
    sr.reveal('.gallery a', fooReveal);
    sr.reveal('.blog img', fooReveal);
    /*koniec pluginu scrollreveal*/
    //    nicescroll
    $(function () {
        $("body").niceScroll({
            cursorcolor: "#7b7b7b",
            zindex: 999
        });
    });
}); //koniec ready
