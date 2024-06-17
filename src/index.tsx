import React from 'react';
import ReactDOM from 'react-dom/client';

import './Stylesheets/index.scss';

import './declarations.d.ts';

import App from './App';
import LoginPage from './Pages/Login';
import MobilePage from './Pages/MobilePage';
import { mobileCheck } from './Utils/Utils';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

const URL = 'https://pp.mpqa.fr:8443/api';

function renderApp(credentials: Credentials, campaign: Campaign) {
	credentials.URL = URL;
	root.render(
		<React.StrictMode>
			<App credentials={credentials} renderLogin={renderLogin} campaign={campaign} />
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
