import ReactDOM from 'react-dom/client';

import './Stylesheets/index.scss';

import './declarations.d.ts';

import App from './App';
import LoginPage from './Pages/Login';
import MobilePage from './Pages/MobilePage';
import { mobileCheck } from './Utils/Utils';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

const URL = 'http://localhost:8081';

function renderApp(credentials: Credentials, campaign: Campaign) {
	credentials.URL = URL;
	root.render(<App credentials={credentials} renderLogin={renderLogin} campaign={campaign} />);
}

function renderLogin() {
	root.render(<LoginPage URL={URL} renderApp={renderApp} />);
}

if (mobileCheck()) {
	root.render(<MobilePage />);
} else {
	renderLogin();
}
