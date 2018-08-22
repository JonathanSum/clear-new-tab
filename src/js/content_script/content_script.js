//> insert "Install theme" buttons t

//> insert "Undo" button t

//^

'use strict';

import 'normalize.css';

import x from 'x';

import 'content_script/onmessage';
import * as installing_theme from 'content_script/installing_theme';

import { Ff_install_btn } from 'content_script_components/Ff_install_btn';
import { Undo_btn } from 'content_script_components/Undo_btn';

import react from 'react';
import react_dom from 'react-dom';

//> insert "Install theme" buttons t
(() => {
    const observer = new MutationObserver(function (mutations) {
        for (const mutation of mutations) {
            for (const added_node of mutation.addedNodes) {
                x.remove(sb(added_node, '.h-Yb-wa')); // remove "You will need Google Chrome to install most apps, extensions and themes." message
                const added_node_is_theme_install_screen = x.matches(added_node, '.sf-f');

                if (added_node_is_theme_install_screen && installing_theme.mut.cancel_theme_screen_opening) { //> cancel theme screen opening when clicking on "Install theme" button in search list
                    installing_theme.mut.cancel_theme_screen_opening = false;

                    const protecting_screen = x.closest(added_node, '.h-F-f-k');

                    protecting_screen.click();

                } else {
                    const themes = added_node_is_theme_install_screen ? [added_node] : sab(added_node, '.h-Ja-d-Ac'); // sf-f (theme_install_screen_class) = theme install screen, h-Ja-d-Ac = theme in search list 
                    for (const theme of themes) {
                        const ff_install_btn_already_exist = sb(theme, '.ff_install_btn');

                        if (!ff_install_btn_already_exist) {
                            const stars_in_theme_install_screen = sb(theme, '.rsw-stars');
                            const theme_install_screen_theme_url = stars_in_theme_install_screen ? stars_in_theme_install_screen.getAttribute('g:url') : null;
                            const theme_id = added_node_is_theme_install_screen ? theme_install_screen_theme_url.substring(theme_install_screen_theme_url.lastIndexOf("=") + 1) : theme.href.substring(theme.href.lastIndexOf("/") + 1).split('?')[0];
                            const ff_install_btn_w = x.create('div', 'ff_install_btn_w');
                            x.after(sb(theme, '.g-U-c-Ph-Lh, .h-d-Ra-c'), ff_install_btn_w); //g-U-c-Ph-Lh = share button in theme install screen, h-d-Ra-c = available on chrome button in search list 

                            react_dom.render(
                                <Ff_install_btn theme_id={theme_id} />,
                                ff_install_btn_w
                            );
                        }
                    }
                }
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
//< insert "Install theme" buttons t

//> insert "Undo" button t
(() => {
    const undo_btn_w = x.create('div', 'undo_btn_w');
    x.append(document.body, undo_btn_w);

    react_dom.render(
        <Undo_btn />,
        undo_btn_w
    );
})();
//< insert "Undo" button t
