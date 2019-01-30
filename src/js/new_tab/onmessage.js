'use_strict';

import x from 'x';
import * as imgs from 'new_tab/imgs';

//> recieve messages
browser.runtime.onMessage.addListener(async (message, sender, send_response) => {
    try {
        const msg = message.message;

        if (msg === 'confirm_that_opened_tab_is_new_tab_page_and_that_it_is_not_in_preview_mode') {
            if (window.location.search.indexOf('preview') === -1) {
                send_response(true);

            } else {
                send_response(false);
            }

        } else if (msg === 'change_img') {
            if (await ed('slideshow') && window.location.search.indexOf('preview') === -1) {
                imgs.display_img(true);
            }

        } else if (msg === 'reload_img') {
            imgs.reload_img();
            x.send_message_to_background({ message: 'start_timer' });

        } else if (msg === 'display_img_on_ext_enable') {
            imgs.display_img();

        } else if (msg !== 'confirm_that_opened_tab_is_new_tab_page_and_that_it_is_not_in_preview_mode') {
            await x.delay(30000); // fixes bug when response is not received from background when sending same message to background while new tab page is open (firefox only)
        }

    } catch (er) {
        err(er, 67);
    }

    return true;
});
//< recieve messages
