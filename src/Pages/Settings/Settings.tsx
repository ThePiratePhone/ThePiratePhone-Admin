import { Route, Routes } from 'react-router-dom';

import Button from '../../Components/Button';
import { clearCredentials } from '../../Utils/Storage';
import E404 from '../E404';
import AreaSettings from './AreaSettings';
import Campaign from './Campaign/Campaign';
import CampaignsSettings from './Campaigns';

function SettingsHome({ renderLogin }: { renderLogin: () => void }) {
	function logout() {
		clearCredentials();
		renderLogin();
	}

	return (
		<div className="Settings">
			<h1>Paramètres</h1>
			<div>
				<Button link="Area" value="Paramètres de l'organisation" />
				<Button link="Campaigns" value="Gérer les campagnes" />
				<Button value="Se déconnecter" type="RedButton" onclick={logout} />
			</div>
		</div>
	);
}

function Settings({
	credentials,
	setCredentials,
	renderLogin,
	setCampaign
}: {
	credentials: Credentials;
	setCredentials: (credentials: Credentials) => void;
	renderLogin: () => void;
	setCampaign: (campaign: Campaign) => void;
}) {
	const routes = [
		{
			path: '/',
			element: <SettingsHome renderLogin={renderLogin} />
		},
		{
			path: '/Area/*',
			element: <AreaSettings credentials={credentials} setCredentials={setCredentials} />
		},
		{
			path: '/Campaigns',
			element: <CampaignsSettings credentials={credentials} />
		},
		{
			path: '/Campaigns/:campaignId/*',
			element: <Campaign setCampaign={setCampaign} credentials={credentials} />
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
