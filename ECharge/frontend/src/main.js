import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import './assets/css/main.css';
import './utils/test-user'; // Import the test script

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount('#app'); 