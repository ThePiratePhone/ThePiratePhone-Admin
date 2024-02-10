import React from 'react';
import ReactDOM from 'react-dom/client';

import './declarations.d.ts';

import Login from './Pages/Login';

import './Stylesheets/index.css';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
	<React.StrictMode>
		<Login />
	</React.StrictMode>
);
