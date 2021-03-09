$(function(){
    $('[data-toggle="tooltip"]').tooltip();
    $('.show_esb_url').bind('click', function (ev) {
        $('body').addClass('menu-active');
        $(ev.currentTarget).find('.dropdown-content').show();
    });
    $('.mymodal-backdrop').bind('click', function () {
        $('body').removeClass('menu-active');
        $('.dropdown .dropdown-content').hide();
    });
    $('.copy-to-clipboard').bind('click', function (ev) {
        var btn = ev.currentTarget;
        var input = $(btn).parent().prev();
        var el_tooltip = $(btn).parent().find('.tooltip-inner');

        input[0].select();
        try {
            document.execCommand("copy");
            el_tooltip.text(gettext('已复制'));
        } catch(err) {
            el_tooltip.text(gettext('复制失败，请手动复制'));
        }
        clearSelection();
    });
    function clearSelection() {
        var sel;
        if ( (sel = document.selection) && sel.empty ) {
            sel.empty();
        } else {
            if (window.getSelection) {
                window.getSelection().removeAllRanges();
            }
            var activeEl = document.activeElement;
            if (activeEl) {
                var tagName = activeEl.nodeName.toLowerCase();
                if ( tagName == "textarea" ||
                        (tagName == "input" && activeEl.type == "text") ) {
                    // Collapse the selection to the end
                    activeEl.selectionStart = activeEl.selectionEnd;
                }
            }
        }
    }
});
