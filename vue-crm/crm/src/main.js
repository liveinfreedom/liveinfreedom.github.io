import Vue from 'vue'
import Vuelidate from "vuelidate"
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import dateFilter from './filter/date.filter'
import messagePlugin from '@/utils/message.plugin'
import 'materialize-css/dist/js/materialize.min'

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

Vue.config.productionTip = false
Vue.use(messagePlugin)
Vue.use(Vuelidate)
Vue.filter('date', dateFilter)

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyCUYQYteRp5dyoLWJ7B-ZXSrCeTtfOgQNE",
  authDomain: "dzvokovskiy-vue-crm.firebaseapp.com",
  projectId: "dzvokovskiy-vue-crm",
  storageBucket: "dzvokovskiy-vue-crm.appspot.com",
  messagingSenderId: "897712724921",
  appId: "1:897712724921:web:12fd92992b444d3e9af468"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

let app

firebase.auth().onAuthStateChanged(()=>{
  if (!app) { // чтобы каждый раз не создавать новый app, т.к. onAuthStateChanged() может выполняться не один раз
    app = new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount('#app')
  }
})

