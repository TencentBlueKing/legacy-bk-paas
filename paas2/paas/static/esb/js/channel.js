$(function() {
    $('#id_component_system').bind('change', function() {
        var component_system_name = $(this).find('option:selected').text();

        var component_system_name = component_system_name.match(/^\[(.*?)\]/);
        if (component_system_name) {
            component_system_name = component_system_name[1];
        } else {
            component_system_name = '';
        }

        var id_component_codename = $('#id_component_codename');
        var component_codename = id_component_codename.val();
        component_codename = component_codename.split('.');
        if (component_codename.length == 3) {
            component_codename[0] = 'generic'
            component_codename[1] = component_system_name.toLowerCase();
            component_codename = component_codename.join('.');
        } else {
            component_codename = 'generic.' + component_system_name.toLowerCase() + '.';
        }
        id_component_codename.val(component_codename);
    });

    $('#id_rate_limit_required').bind('change', function() {
        if ($(this).is(":checked")) {
            $('.rate-limit-config-container').show();
        } else {
            $('.rate-limit-config-container').hide();
        };
    });
});
