import React from 'react';
import ReactDOM from 'react-dom/client';

import './Stylesheets/index.css';

import './declarations.d.ts';

import App from './App';
import LoginPage from './Pages/Login';
import MobilePage from './Pages/MobilePage';
import { mobileCheck } from './Utils';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

const URL = 'https://cs.mpqa.fr:7000/api';

function renderApp(credentials: Credentials, loginResponse: LoginResponse) {
	credentials.URL = URL;
	root.render(
		<React.StrictMode>
			<App credentials={credentials} renderLogin={renderLogin} loginResponse={loginResponse} />
		</React.StrictMode>
	);
}

function renderLogin() {
	root.render(
		<React.StrictMode>
			<LoginPage URL={URL} renderApp={renderApp} />
		</React.StrictMode>
	);
}

if (mobileCheck()) {
	root.render(
		<React.StrictMode>
			<MobilePage />
		</React.StrictMode>
	);
} else {
	renderLogin();
}
