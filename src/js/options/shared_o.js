import { toJS, action, runInAction, configure } from 'mobx';

import x from 'x';
import { db } from 'js/init_db';
import * as shared_b_o from 'js/shared_b_o';
import { inputs_data } from 'options/inputs_data';
import * as permissions from 'options/permissions';
import * as settings from 'options/settings';

configure({ enforceActions: 'observed' });

export const get_img_i_by_id = img_id => shared_b_o.ob.imgs.findIndex(img => img.id === img_id);

export const get_img_i_by_el = el => Array.prototype.slice.call(mut.img_w_tr_nodes).indexOf(el);

export const decide_what_inputs_to_hide = action(async () => {
    try {
        inputs_data.obj.img_settings.keep_old_themes_imgs.visible = ed.mode === 'theme';
        inputs_data.obj.img_settings.slideshow.visible = !!(ed.mode === 'multiple' || ed.mode === 'random_solid_color');
        inputs_data.obj.img_settings.shuffle.visible = ed.mode === 'multiple';
        inputs_data.obj.img_settings.change_interval.visible = !!(ed.mode === 'multiple' || ed.mode === 'random_solid_color');
        inputs_data.obj.img_settings.current_img.visible = !!(ed.mode === 'one' || ed.mode === 'multiple');

        const contains_allow_downloading_images_by_link_permission = await permissions.contains_permission(toJS(inputs_data.obj.other_settings.allow_downloading_images_by_link.permissions));
        const contains_enable_paste_permission = await permissions.contains_permission(toJS(inputs_data.obj.other_settings.enable_paste.permissions));

        runInAction(() => {
            inputs_data.obj.upload.download_img_when_link_given.visible = !!contains_allow_downloading_images_by_link_permission;
            inputs_data.obj.upload.paste.adjacent_btn_is_visible = !!contains_enable_paste_permission;
        });

    } catch (er) {
        console.error(er);
    }
});

export const deselect_selected_img = action(() => {
    const selected_img_i = get_img_i_by_id(mut.selected_img_id);
    const img_exist = shared_b_o.ob.imgs[selected_img_i]; // if not deleted selected image

    if (img_exist) {
        shared_b_o.ob.imgs[selected_img_i].selected = false;
    }

    change_input_val('img_settings', 'settings_type', 'global');
});

export const change_input_val = action((family, name, val) => {
    inputs_data.obj[family][name].val = val;
});

export const change_current_img_input_val = action(val => {
    inputs_data.obj.img_settings.current_img.val = val;
});

export const show_or_hide_global_options = action(bool => {
    settings.ob.global_options_is_visible = bool;
});

export const set_color_input_vizualization_color = action((family, name, color) => {
    inputs_data.obj[family][name].vizualization_color = color;
});

export const set_color_global_checkbox_val = async name => {
    const settings_obj = await db.imgs.get(mut.selected_img_id);

    runInAction(() => {
        if (settings_obj[name] === 'global') {
            inputs_data.obj.img_settings[name].color_global_checkbox_val = true;

        } else {
            inputs_data.obj.img_settings[name].color_global_checkbox_val = false;
        }
    });
};

//> enable / disable ui
export const enable_ui = () => x.remove(s('.ui_disabled'));
export const disable_ui = () => x.load_css('ui_disabled');
//< enable / disable ui

export const switch_to_settings_type = async (name, val, force_inputs_reset) => {
    if ((name === 'settings_type' && val === 'global') || force_inputs_reset) {
        mut.storage_type = 'ed';

        settings.load_settings_inner('img_settings', await eda());
        set_color_input_vizualization_color('img_settings', 'color', ed.color);
        deselect_selected_img();
        show_or_hide_global_options(false);
    }

    if (name === 'settings_type' && val === 'specific') {
        alert(x.msg('change_img_settings_alert'));
    }
};

export const mut = {
    img_w_tr_nodes: null,
    storage_type: 'ed',
    selected_img_id: 1,
    offset: 0,
    current_color_pickier: {
        el: null,
        name: '',
        color: '',
    },
};
