$(document).ready(function () {
    /* ---------------------------------------------------- */
    /* transform hamburger */
    /* ---------------------------------------------------- */

    var navClick = false;
    $('.navigation__hamburger').click(function () {
        if (!navClick) {
            $('.navigation__list').addClass('show_navigation');
            $('.navigation__hamburger-box-inner').addClass('transform');
            navClick = true;
        } else{
            $('.navigation__list').removeClass('show_navigation');
            $('.navigation__hamburger-box-inner').removeClass('transform');
            $('.navigation__title').css('color', '#fff');
             navClick = false;
        }
    });
    $('.navigation__hamburger').focus(function () {
        $('.navigation__title').css('color', '#FEA77E');
        $('.navigation__list').addClass('show_navigation');
        $('.navigation__hamburger-box-inner').addClass('transform');
    });

    /* ---------------------------------------------------- */
    /* menu hide/show */
    /* ---------------------------------------------------- */
    $('.navigation__hamburger').hover(function () {
        $('.navigation__title').css('color', '#FEA77E');
    }, function () {
        $('.navigation__title').css('color', '#fff');
    });

    /* ---------------------------------------------------- */
    /* hide/show scrollTop */
    /* ---------------------------------------------------- */
    $('#scrollTop').hide();
    $(window).scroll(function () {
        if ($(this).scrollTop() > 500) {
            $('#scrollTop').fadeIn(500);
        } else {
            $('#scrollTop').fadeOut(500);
        }
    });

    /* ---------------------------------------------------- */
    /* scroll animate */
    /* ---------------------------------------------------- */
    var $root = $('html, body');
    $('a[href^="#"]').click(function (e) {
        $('.navigation__list-links').each(function () {
            $(this).removeClass('active');
        });
        $(this).addClass('active');
        var href = $.attr(this, 'href');
        $root.animate({
            scrollTop: $(href).offset().top
        }, 500, function () {

            window.location.hash = href;
        });
        $('.navigation__list').removeClass('show_navigation');
        $('.navigation__hamburger-box-inner').removeClass('transform');
        $('.navigation__title').css('color', '#fff');
        navClick = false;
        return false;
    });

    /* ---------------------------------------------------- */
    /* pobranie linków w menu */
    /* ---------------------------------------------------- */
    var allNavItem = document.querySelectorAll('.navigation__list-item a');
    /* ---------------------------------------------------- */
    /* id docelowego elementu */
    /* ---------------------------------------------------- */
    var elemntsId = [];

    /* ---------------------------------------------------- */
    /* pobiera id z tablicy linków menu */
    /* ---------------------------------------------------- */
    allNavItem.forEach(function (value, index, array) {
        var id = value.getAttribute('href').slice(1);
        elemntsId.push(document.getElementById(id));
    });

    /* ---------------------------------------------------- */
    /* sprawdza odleglłość elementów od top okana przeglądarki*/
    /* ---------------------------------------------------- */
    var tick = false;
    window.addEventListener('scroll', function (e) {

        if (!tick) {
            tick = true;
            setTimeout(function () {
                tick = false;
                for (var i = 0; i < allNavItem.length; i++) {

                    /* ---------------------------------------------------- */
                    /* jeżeli element jest przewinięty co najmniej do top strony && nie schowal się więcej niż wysokości kontenera w którym się znajduje*/
                    /* ---------------------------------------------------- */
                    if ((elemntsId[i].getBoundingClientRect().top - 10 <= 0) && (!(elemntsId[i].getBoundingClientRect().top + elemntsId[i].parentElement.offsetHeight <= 0))) {
                        allNavItem[i].classList.add('active');
                    } else {
                        allNavItem[i].classList.remove('active');
                    }
                }
            }, 250);
        }
    });


    /* ---------------------------------------------------- */
    /* walidacja i wysyłanie formularza */
    /* ---------------------------------------------------- */
    const form = document.querySelector('.contact__form');
    const inputs = form.querySelectorAll('input[required], textarea[required]');

    //wyłączamy domyślną walidację
    form.setAttribute('novalidate', true);

    const displayFieldError = function (elem) {
        const fieldRow = elem.closest('.form-row');
        const fieldError = fieldRow.querySelector('.field-error');
        if (fieldError === null) {
            const errorText = elem.dataset.error;
            const divError = document.createElement('div');
            divError.classList.add('field-error');
            divError.innerText = errorText;
            fieldRow.appendChild(divError);
        }
    };

    const hideFieldError = function (elem) {
        const fieldRow = elem.closest('.form-row');
        const fieldError = fieldRow.querySelector('.field-error');
        if (fieldError !== null) {
            fieldError.remove();
        }
    };

    [...inputs].forEach(elem => {
        elem.addEventListener('input', function () {
            if (!this.checkValidity()) {
                this.classList.add('error');
            } else {
                this.classList.remove('error');
                hideFieldError(this);
            }
        });

        if (elem.type === "checkbox") {
            elem.addEventListener('click', function () {
                const formRow = this.closest('.form-row');
                if (this.checked) {
                    this.classList.remove('error');
                    hideFieldError(this);
                } else {
                    this.classList.add('error');
                }
            });
        }
    });

    const checkFieldsErrors = function (elements) {

        /* ---------------------------------------------------- */
        /*   ustawiamy zmienną na true. Następnie robimy pętlę po wszystkich polach */
        /*   jeżeli któreś z pól jest błędne, przełączamy zmienną na false. */
        /* ---------------------------------------------------- */
        let fieldsAreValid = true;

        [...elements].forEach(elem => {
            if (elem.checkValidity()) {
                hideFieldError(elem);
                elem.classList.remove('error');
            } else {
                displayFieldError(elem);
                elem.classList.add('error');
                fieldsAreValid = false;
            }
        });

        return fieldsAreValid;
    };

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        /* ---------------------------------------------------- */
        /*   jeżeli wszystkie pola są poprawne... */
        /* ---------------------------------------------------- */
        if (checkFieldsErrors(inputs)) {
            const elements = form.querySelectorAll('input:not(:disabled), textarea:not(:disabled)');

            const dataToSend = new FormData();
            [...elements].forEach(el => dataToSend.append(el.name, el.value));

            const url = form.getAttribute('action');
            const method = form.getAttribute('method');

            const submit = form.querySelector('[type="submit"]');
            submit.disabled = true;
            submit.classList.add('elem-is-busy');

            fetch(url, {
                    method: method.toUpperCase(),
                    body: dataToSend
                })
                .then(ret => ret.json())
                .then(ret => {
                    submit.disabled = false;
                    submit.classList.remove('elem-is-busy');

                    if (ret.errors) {
                        ret.errors.map(function (el) {
                            return '[name="' + el + '"]'
                        });
                        const selector = ret.errors.join(',');
                        checkFieldsErrors(form.querySelectorAll(sekector));

                    } else {
                        if (ret.status === 'ok') {

                            /* ---------------------------------------------------- */
                            /*   wyświetlamy komunikat powodzenia, cieszymy sie */
                            /* ---------------------------------------------------- */
                            const div = document.createElement('div');
                            div.classList.add('form-send-success');

                            div.innerHTML = '<strong>Wiadomość została wysłana</strong><span>Dziękujemy za kontakt. Postaramy się odpowiedzieć jak najszybciej</span>';
                            form.parentElement.insertBefore(div, form);
                            form.remove();
                        }

                        if (ret.status === 'error') {

                            /* ---------------------------------------------------- */
                            /*   komunikat błędu, niepowodzenia */
                            /* ---------------------------------------------------- */
                            const div = document.createElement('div');
                            div.classList.add('form-send-error');

                            div.innerText = 'Wysłanie wiadomości się nie powiodło';
                            form.parentElement.insertBefore(div, form);
                            form.remove();
                        }
                    }
                }).catch(_ => {
                    submit.disabled = false;
                    submit.classList.remove('element-is-busy');
                });
        }
    });
});
