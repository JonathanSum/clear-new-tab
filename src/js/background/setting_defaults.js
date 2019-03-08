import { db, init_db } from 'js/init_db';
import * as generate_random_color from 'js/generate_random_color';

window.set_default_settings = async page => { // this function also called in options.js when clicking on "Restore global defaults" button
    try {
        const ext_data_o = {
            id: 1,
            download_img_when_link_given: false,
            current_img: 0,
            future_img: 1,
            last_img_change_time: 0,
            use_theme_img: true,
            keep_old_themes_imgs: false,
            set_last_uploaded: false,
            change_interval: '3600000',
            img_already_changed: true,
            mode: 'theme',
            current_random_color: generate_random_color.generate_random_color(),
            shuffle: true,
            slideshow: false,
            img_change_effect: 'crossfade',
            slide_direction: 'from_right_to_left',
            size: 'dont_resize',
            position: '50% 50%',
            repeat: 'no-repeat',
            color: '#ffffff',
            video_volume: 0,
        };

        if (page === 'background') {
            ext_data_o.show_install_help = true;
            ext_data_o.show_bookmarks_bar = false;
            ext_data_o.enable_paste = false;
            ext_data_o.allow_downloading_images_by_link = false;
            ext_data_o.last_installed_theme_theme_id = '';
            ext_data_o.show_link_to_default_new_tab = false;
            ext_data_o.allow_analytics = false;
            ext_data_o.answered_to_analytics_privacy_question = false;

            db.on('populate', () => {
                try {
                    db.ed.add(ext_data_o);

                    browser.runtime.openOptionsPage();

                } catch (er) {
                    err(er, 37, null, true);
                }
            });

            db.open();

        } else if (page === 'options') {
            try {
                init_db();

                await db.transaction('rw', db.ed, async () => {
                    try {
                        db.ed.update(1, ext_data_o);

                    } catch (er) {
                        err(er, 36, null, true);
                    }
                });

            } catch (er) {
                err(er, 35, null, true);
            }
        }

    } catch (er) {
        err(er, 34, null, true);
    }
};
