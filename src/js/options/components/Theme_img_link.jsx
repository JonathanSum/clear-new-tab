import React from 'react';

export const Theme_img_link = () => {
    //> open theme image when clicking on 'this'(install_help_theme_img_link) in install_help or theme_img_link
    const open_theme_img = e => {
        e.preventDefault();

        browser.runtime.getBackgroundPage(background => background.open_theme_img());
    };
    //< open theme image when clicking on 'this'(install_help_theme_img_link) in install_help or theme_img_link

    return (
        <button
            type="button"
            className="link theme_img_link"
            data-text="theme_img_link_text"
            href="#"
            onClick={open_theme_img}
        />
    );
};