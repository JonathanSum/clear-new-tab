import x from 'x';
import 'js/error_init';
import 'new_tab/onmessage';
import { run_everything } from 'js/init_All';

s('title').textContent = x.msg('new_tab_title_text');

x.get_ed(run_everything.bind(null, 'new_tab'));
