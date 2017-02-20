$(function () {
    var logout = $('#logout');
    logout.click(function (e) {
        e.preventDefault();
        // alert('fff');
        $.post('/logout', function () {
            location.href = '/';
        });

        return false
    });

    var menus = $('#menus'),
        menu = menus.find('.menu'),
        popup = menus.find('.popup');

    menu.click(function () {


        popup.toggleClass('show');
        return false;
    })
});