//> Select c

//>1 create one option element t

//>1 change option value when selecting option t

//>1 hide options when clicking on option or select_title t

//^

'use strict';

import x from 'x';
import * as prevent_scrolling from 'js/prevent_scrolling';
import * as shared_o from 'options/shared_o';
import * as settings from 'options/settings';
import { Tr } from 'js/Tr';

import { Help } from 'options_components/Help';

import react from 'react';
import * as r from 'ramda';
import { observer } from "mobx-react";

//> Select c
export class Select extends react.Component {
    constructor(props) {
        super(props);

        this.select_w = react.createRef();
        this.select = react.createRef();
    }

    //>1 create one option element t
    create_option = option => {
        const get_none_class =
            r.ifElse(() => !this.props.show_global_options && option.global,
                () => 'none',

                () => ''
            );

        return <li key={option.key} className={x.cls(['option', get_none_class()])} data-storage={option.storage} data-val={option.val} onClick={this.change_select_val}>{option.text}</li>
    }
    //<1 create one option element t

    //>1 change option value when selecting option t
    change_select_val = e => {
        settings.change_select_val(e.target.dataset.storage, e.target.dataset.val, e.target.textContent);

        this.hide_options();
    }
    //<1 change option value when selecting option t

    //>1 hide options when clicking on option or select_title t
    hide_options = async () => {
        if (document.activeElement == this.select_w.current) {
            await x.delay(0);

            this.select_w.current.blur();
        }
    }
    //<1 hide options when clicking on option or select_title t

    render() {
        const options = settings.options[this.props.name];
        const selected_option_text = settings.ob.selected_options[this.props.name];
        const select_visibility=shared_o.ob.hidable_input_items[this.props.name];

        return (
            <Tr attr={{
                className: 'input_item select_input_item'
            }}
                tag='div'
                name='gen'
                state={typeof select_visibility == 'boolean' ? select_visibility : true}
            >
                <label
                    className='input_label'
                    data-text={this.props.name + '_label_text'}
                ></label>
                <div
                    className='select_w settings_input'
                    tabIndex='0'
                    ref={this.select_w}
                >
                    <div
                        className='select_title'
                        onMouseDown={this.hide_options}
                    >{selected_option_text}</div>
                    <ul
                        className='select'
                        onWheel={prevent_scrolling.prevent_scrolling.bind(this.select.current)}
                        ref={this.select}
                    >
                        {options.map(this.create_option)}
                    </ul>
                </div>
                <Help {...this.props} />
            </Tr>
        );
    }
}
//< Select c

Select = observer(Select);