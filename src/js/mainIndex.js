require('../css/style.css');
//document.body.innerHTML="webpack";
import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-default/index.css';
import App from './vuefiles/main.vue';
import _ from 'lodash';

import VueResource from 'vue-resource';
import backTop from './components/backtop';
Vue.use(backTop);


Vue.use(VueResource);
Vue.use(ElementUI);


new Vue({
	el:'#app',
	data:{
		title:'hello vue'
	},
    render: h => h(App),
})

