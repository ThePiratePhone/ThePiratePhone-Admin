import { Route, Routes } from 'react-router-dom';

import Button from '../../Components/Button';
import E404 from '../E404';
import ChangeAreaPassword from './Area/ChangePassword';
import AreaSettings from './AreaSettings';
import ChangeHours from './Campaign/ChangeHours';
import ChangeCampaignName from './Campaign/ChangeName';
import ChangeCampaignPassword from './Campaign/ChangePassword';
import CampaignSettings from './CampaignSettings';
import ChangeAreaName from './Area/ChangeName';
import ChangeCallTime from './Campaign/ChangeCallTime';

function SettingsHome({ renderLogin }: { renderLogin: () => void }) {
	function logOut() {
		localStorage.removeItem('credentials');
		renderLogin();
	}

	return (
		<div className="Settings">
			<h1>Paramètres</h1>
			<div>
				<Button link="Area" value="Paramètres de l'organisation" />
				<Button link="Campaign" value="Paramètres de la campagne" />
				<Button value="Se déconnecter" type="RedButton" onclick={logOut} />
			</div>
		</div>
	);
}

function Settings({
	credentials,
	setCredentials,
	renderLogin,
	campaign,
	setCampaign
}: {
	credentials: Credentials;
	setCredentials: (credentials: Credentials) => void;
	renderLogin: () => void;
	campaign: Campaign;
	setCampaign: (campaign: Campaign) => void;
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
			path: '/Area/ChangeName',
			element: <ChangeAreaName setCredentials={setCredentials} credentials={credentials} />
		},
		{
			path: '/Campaign',
			element: <CampaignSettings />
		},
		{
			path: '/Campaign/ChangeCallTime',
			element: <ChangeCallTime setCampaign={setCampaign} credentials={credentials} campaign={campaign} />
		},
		{
			path: '/Campaign/ChangeKey',
			element: <ChangeCampaignPassword credentials={credentials} />
		},
		{
			path: '/Campaign/ChangeHours',
			element: <ChangeHours setCampaign={setCampaign} credentials={credentials} campaign={campaign} />
		},
		{
			path: '/Campaign/ChangeName',
			element: <ChangeCampaignName setCampaign={setCampaign} credentials={credentials} campaign={campaign} />
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
