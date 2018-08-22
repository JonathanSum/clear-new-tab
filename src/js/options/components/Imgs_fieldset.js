//> Imgs_fieldset c

//>1 get total number of images to load and previous number of images when imgs array length changes. i use it instead componentWillReceiveProps

//> Imgs c

//>1 img_load_callback f

//>1 img_load_callback f

//>1 show transparency background checkerboard t

//> Img_inner_w c

//> Img c

//>1 open image in new tab when clicking on preview button t

//^

'use strict';

import x from 'x';
import * as img_loading from 'js/img_loading';
import * as moving from 'js/moving';
import * as shared_o from 'options/shared_o';
import * as prevent_scrolling from 'js/prevent_scrolling';
import * as img_selection from 'options/img_selection';
import * as img_deletion from 'options/img_deletion';
import * as changing_imgs_fieldset_width from 'options/changing_imgs_fieldset_width';
import * as scrolling from 'options/scrolling';
import { Tr } from 'js/Tr';

import { Btn } from 'options_components/Btn';

import cross_svg from 'svg/cross';

import Svg from 'svg-inline-react';
import react from 'react';
import react_dom from 'react-dom';
import { reaction } from "mobx";
import { observer } from "mobx-react";

//> Imgs_fieldset c
export class Imgs_fieldset extends react.Component {
    constructor(props) {
        super(props);

        this.imgs_w = react.createRef();
        this.imgs_fieldset = react.createRef();
    }

    componentDidMount() {
        shared_o.mut.img_w_tr_nodes = this.imgs_w.current.getElementsByClassName('img_w_tr');
        scrolling.mut.imgs_fieldset = this.imgs_fieldset.current;
        this.resize_imgs_binded = changing_imgs_fieldset_width.resize_imgs.bind(null, this.imgs_w.current);

        window.addEventListener('resize', this.resize_imgs_binded);

        changing_imgs_fieldset_width.resize_imgs(this.imgs_w.current);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.resize_imgs_binded);
    }

    //>1 get total number of images to load and previous number of images when imgs array length changes. i use it instead componentWillReceiveProps 
    get_total_imgs_to_load_and_previous_number_of_imgs = reaction(
        () => shared_o.ob.imgs.length,
        number_of_displayed_imgs => {
            if (img_loading.mut.previous_number_of_imgs != number_of_displayed_imgs) {
                img_loading.mut.imgs_loaded = 0;
                img_loading.mut.total_imgs_to_load = number_of_displayed_imgs - img_loading.mut.previous_number_of_imgs;
                img_loading.mut.previous_number_of_imgs = number_of_displayed_imgs;
            }
        }
    )
    //<1 get total number of images to load and previous number of images when imgs array length changes. i use it instead componentWillReceiveProps 

    componentDidUpdate() {
        scrolling.show_or_hide_imgs_fieldset_fillers();
    }

    render() {
        return (
            <div
                className='imgs_w'
                ref={this.imgs_w}
            >
                <div
                    className='imgs'
                    style={{ width: changing_imgs_fieldset_width.ob.imgs_width }}
                >
                    <div
                        className='imgs_legend'
                    >
                        {x.message('imgs_legend_text')}
                        <div className='imgs_legend_line'></div>
                    </div>

                    <div className={x.cls(['imgs_fieldset_filler', 'imgs_fieldset_filler_top', scrolling.ob.imgs_fieldset_filler_top_none_cls])}></div>
                    <fieldset
                        className='imgs_fieldset'
                        onWheel={prevent_scrolling.prevent_scrolling.bind(this.imgs_fieldset.current)}
                        onScroll={scrolling.show_or_hide_imgs_fieldset_fillers}
                        ref={this.imgs_fieldset}
                    >
                        <Tr
                            attr={{
                                className: 'imgs_w_1'
                            }}
                            tag='div'
                            name='imgs_w_1'
                            state={img_deletion.ob.show_imgs_w_1}
                            delete_all_images_tr_end={img_deletion.delete_all_images_tr_end}
                        >
                            <div className='imgs_w_2'>
                                <Imgs
                                    imgs={shared_o.ob.imgs}
                                />
                            </div>
                            <Tr
                                attr={{
                                    className: 'load_btns_w'
                                }}
                                tag='div'
                                name='gen'
                                state={shared_o.ob.show_load_btns_w}
                            >
                                <Btn
                                    name='load_more'
                                    load_50_or_all_imgs={{ onClick: img_loading.load_50_or_all_imgs.bind(null, 50, 'load_more') }}
                                />
                                <Btn
                                    name='load_all'
                                    load_50_or_all_imgs={{ onClick: img_loading.load_50_or_all_imgs.bind(null, 1000, 'load_all') }}
                                />
                            </Tr>
                        </Tr>
                    </fieldset>
                    <div className={x.cls(['imgs_fieldset_filler', 'imgs_fieldset_filler_bottom', scrolling.ob.imgs_fieldset_filler_bottom_none_cls])}></div>
                </div>
            </div>
        );
    }
}
//< Imgs_fieldset c

//> Imgs c
class Imgs extends react.Component {
    constructor(props) {
        super(props);

        this.set_img_refs = this.set_img_refs.bind(this);
        this.img_refs = {};
        this.img_w_trs = [];
    }

    //>1 img_load_callback f
    set_img_refs(id, img) {
        this.img_refs[id] = img;
    }
    //<1 img_load_callback f

    //>1 img_load_callback f
    img_load_callback = async id => {
        if (shared_o.ob.imgs.length != 0) { // prevent bug when deleting all images when solid color image present
            img_loading.mut.imgs_loaded++;

            if ((img_loading.mut.total_imgs_to_load > 0 && img_loading.mut.imgs_loaded == img_loading.mut.total_imgs_to_load) || (img_loading.mut.total_imgs_to_load == 0 && img_loading.mut.imgs_loaded == shared_o.ob.imgs.length)) {
                img_loading.mut.imgs_loaded = 0;
                img_loading.hide_loading_screen();
                scrolling.show_or_hide_imgs_fieldset_fillers();

                if (img_loading.mut.loading_all) {
                    await img_loading.load_50_or_all_imgs(1000, 'load_all');

                    if (!img_loading.mut.loading_all) {
                        await x.delay(400);
                        shared_o.enable_ui();
                    }

                } else {
                    await x.delay(400);
                    shared_o.enable_ui();
                }
            }

            img_loading.show_loaded_img(id, this.img_refs[id]);
        }
    }
    //<1 img_load_callback f

    //>1 show transparency background checkerboard t
    show_checkerboard = id => {
        img_loading.show_checkerboard(id);
    }
    //<1 show transparency background checkerboard t

    render() {
        return (
            <react.Fragment>
                {
                    shared_o.ob.imgs.map((img, i) => {
                        return (
                            <Tr
                                attr={{
                                    className: 'img_w_tr'
                                }}
                                tag='span'
                                name='gen'
                                state={img.show_delete}
                                tr_end_callbacks={[img_deletion.delete_img_tr_end_callback]}
                                key={img.key}
                                ref={img_w_tr => this.img_w_trs[i] = img_w_tr}
                            >
                                <span
                                    className={x.cls(['img_w', img.selected ? 'selected_img' : null])}
                                    tabIndex='0'
                                    style={{
                                        backgroundColor: img.placeholder_color,
                                        backgroundImage: img.show_checkerboard ? 'url("checkerboard.png")' : null,
                                        backgroundRepeat: '14px 14px',
                                        backgroundSize: '14px 14px'
                                    }}
                                    onClick={img_selection.select_img.bind(null, img.id)}
                                    onMouseDown={(e) => moving.start_drag(react_dom.findDOMNode(this.img_w_trs[i]), e)}
                                    onMouseMove={(e) => moving.create_drop_area(react_dom.findDOMNode(this.img_w_trs[i]), 'options', e)}
                                    onTransitionEnd={this.show_checkerboard.bind(null, img.id)}
                                >
                                    <Img_inner_w
                                        i={i}
                                        img={img}
                                        img_load_callback={this.img_load_callback}
                                        delete_img={img_deletion.delete_img.bind(null, img.id)}
                                        set_img_refs={this.set_img_refs}
                                    />
                                </span>
                            </Tr>
                        )
                    })
                }
            </react.Fragment>
        );
    }
}
//< Imgs c

//> Img_inner_w c
let Img_inner_w = props => {
    const img = props.img;

    return (
        <Tr
            attr={{
                className: 'img_inner_w'
            }}
            tag='div'
            name='img'
            state={img.show}
        >
            <Img
                i={props.i}
                img={img}
                img_load_callback={props.img_load_callback}
                delete_img={props.delete_img}
                set_img_refs={props.set_img_refs}
            />
        </Tr>
    );
};
//< Img_inner_w c

//> Img c
class Img extends react.Component {
    constructor(props) {
        super(props);

        this.img = props.img;
        this.is_img = this.img_el = this.img.type.indexOf('file') > - 1 || this.img.type.indexOf('link') > - 1;

        this.img_el = this.is_img ?
            <img
                className='img'
                draggable='false'
                src={this.img.img}
                onLoad={this.props.img_load_callback.bind(null, this.img.id, this.props.i)}
                ref={img_ref => this.props.set_img_refs(this.img.id, img_ref)}
            /> :
            <div
                className="solid_color_img"
                style={{ backgroundColor: this.img.img }}
                ref={this.props.img_load_callback.bind(null, this.img.id, this.props.i)}
            ></div>;
    }

    //>1 open image in new tab when clicking on preview button t
    preview_img = (id) => {
        x.send_message_to_background({ message: 'open_preview_img_tab', img_id: id });
    }
    //<1 open image in new tab when clicking on preview button t

    render() {
        return (
            <react.Fragment>
                <div className='img_cover'></div>
                {this.is_img ? <div className='img_size img_info'>{this.img.img_size}</div> : null}
                <div className='img_type img_info'>{x.message('img_type_' + this.img.type + '_text')}</div>
                <button className='img_preview img_info' onClick={this.preview_img.bind(null, this.img.id)}>Preview</button>
                {this.img_el}
                <button
                    className='delete_img_btn'
                    onClick={this.props.delete_img}
                >
                    <Svg src={cross_svg} />
                </button>
            </react.Fragment>
        );
    }
}
//< Img c

Imgs_fieldset = observer(Imgs_fieldset);
Imgs = observer(Imgs);
Img_inner_w = observer(Img_inner_w);
Img = observer(Img);