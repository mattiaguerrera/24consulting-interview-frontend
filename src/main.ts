import App from './app';
import './assets/scss/style.scss';
import './assets/style/main.scss';

const app: App = new App();

/**
 * Start the app after DOM loaded
 */
document.addEventListener('DOMContentLoaded', (): void => {
    app.startApp();
});



