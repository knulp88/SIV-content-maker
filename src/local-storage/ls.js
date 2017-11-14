import Vue from 'vue'
import VueLocalStorage from 'vue-ls';

const options = {
 namespace: 'ls__'
};

export default Vue.use(VueLocalStorage, options);
