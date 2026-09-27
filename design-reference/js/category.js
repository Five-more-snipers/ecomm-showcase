jQuery(function($){
    $('body').on('click', '.ecommerce_marketplace_upload_image_button', function(e){
        e.preventDefault();
        ecommerce_marketplace_aw_uploader = wp.media({
            title: 'Custom image',
            button: {
                text: 'Use this image'
            },
            multiple: false
        }).on('select', function() {
            var attachment = ecommerce_marketplace_aw_uploader.state().get('selection').first().toJSON();
            $('#cat-image').val(attachment.url);
        })
        .open();
    });
});