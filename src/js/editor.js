/**
 * Created by Cheng on 2017/9/27.
 */
require('../css/style.css');
import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-default/index.css';
import editor from './vuefiles/editor.vue'
import _ from 'lodash';
import VueResource from 'vue-resource';
Vue.use(VueResource);
Vue.use(ElementUI);
new Vue({
        el: '#app',
        render: h => h(editor)
});


