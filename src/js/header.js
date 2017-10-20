/**
 * Created by Administrator on 2017-09-14.
 */
require('../css/style.css');
//document.body.innerHTML="webpack";
import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-default/index.css';
import App from './vuefiles/header.vue';

Vue.use(ElementUI);


new Vue({
    el:'#header',
    data:{
        title:'hello vue'
    },
    render: h => h(App),
})

