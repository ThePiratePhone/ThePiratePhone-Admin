import { Link, Route, Routes } from 'react-router-dom';

import Button from '../../Components/Button';
import E404 from '../E404';
import AreaSettings from './AreaSettings';
import CampaignSettings from './CampaignSettings';
import ChangeAreaPassword from './ChangeAreaPassword';
import ChangeCampaignPassword from './ChangeCampaignPassword';

function SettingsHome({ renderLogin }: { renderLogin: () => void }) {
	function logOut() {
		localStorage.removeItem('credentials');
		renderLogin();
	}

	return (
		<div className="Settings">
			<h1>Paramètres</h1>
			<div>
				<div className="SettingsList">
					<Link to="Area">Paramètres de l'organisation</Link>
					<Link to="Campaign">Paramètres de la campagne</Link>
				</div>
				<div>
					<Button value="Se déconnecter" onclick={logOut} />
				</div>
			</div>
		</div>
	);
}

function Settings({
	credentials,
	setCredentials,
	renderLogin
}: {
	credentials: Credentials;
	setCredentials: (credentials: Credentials) => void;
	renderLogin: () => void;
}) {
	const routes = [
		{
			path: '/',
			element: <SettingsHome renderLogin={renderLogin} />
		},
		{
			path: '/Area',
			element: <AreaSettings />
		},
		{
			path: '/Area/ChangePassword',
			element: <ChangeAreaPassword setCredentials={setCredentials} credentials={credentials} />
		},
		{
			path: '/Campaign',
			element: <CampaignSettings />
		},
		{
			path: '/Campaign/ChangeKey',
			element: <ChangeCampaignPassword credentials={credentials} />
		},
		{
			path: '/*',
			element: <E404 />
		}
	];

	return (
		<Routes>
			{routes.map((element, i) => {
				return <Route path={element.path} element={element.element} key={i} />;
			})}
		</Routes>
	);
}

export default Settings;
