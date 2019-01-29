import x from 'x';
import * as populate_storage_with_images_and_display_them from 'js/populate_storage_with_images_and_display_them';
import * as total_number_of_imgs from 'js/total_number_of_imgs';
import * as shared_o from 'options/shared_o';
import * as img_loading from 'options/img_loading';

//> recieve messages
browser.runtime.onMessage.addListener(async message => {
    const msg = message.message;

    if (msg === 'load_last_page') { // remove old theme images and then load new
        populate_storage_with_images_and_display_them.mut.uploading_imgs = true;

        total_number_of_imgs.set_total_number_of_imgs()
            .then(() => {
                const last_page = Math.ceil(total_number_of_imgs.ob.number_of_imgs / populate_storage_with_images_and_display_them.sta.imgs_per_page);

                img_loading.load_page('load_page', last_page);

            }).catch(er => {
                console.error(er);
            });

    } else if (msg === 'change_current_img_input_val') {
        const current_img = await ed('current_img');

        shared_o.change_current_img_input_val(current_img + 1);

    } else if (msg !== 'confirm_that_opened_tab_is_new_tab_page_and_that_it_is_not_in_preview_mode') {
        await x.delay(30000); // fixes bug when response is not received from background when sending same message to background while options page is open (firefox only)
    }

    if (msg !== 'confirm_that_opened_tab_is_new_tab_page_and_that_it_is_not_in_preview_mode') {
        return true;
    }

    return undefined;
});
//< recieve messages
