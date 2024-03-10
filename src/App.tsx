import { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Footer from './Components/Footer';
import NavBar from './Components/NavBar';
import AddClients from './Pages/AddClients';
import AddOneClient from './Pages/AddOneClient';
import Clients from './Pages/Clients';
import Dashboard from './Pages/Dashboard';
import E404 from './Pages/E404';
import AreaSettings from './Pages/Settings/AreaSettings';
import CampaignSettings from './Pages/Settings/CampaignSettings';
import ChangeAreaPassword from './Pages/Settings/ChangeAreaPassword';
import Settings from './Pages/Settings/Settings';
import ChangeCampaignPassword from './Pages/Settings/ChangeCampaignPassword';

function App({ credentials, renderLogin }: { credentials: Credentials; renderLogin: () => void }) {
	const [Credentials, setCredentials] = useState(credentials);

	const routes = [
		{
			path: '/',
			element: <Dashboard />
		},
		{
			path: '/Clients',
			element: <Clients credentials={Credentials} />
		},
		{
			path: '/Clients/AddOne',
			element: <AddOneClient credentials={Credentials} />
		},
		{
			path: '/Clients/Add',
			element: <AddClients credentials={Credentials} />
		},
		{
			path: '/Settings',
			element: <Settings renderLogin={renderLogin} />
		},
		{
			path: '/Settings/Area',
			element: <AreaSettings />
		},
		{
			path: '/Settings/Area/ChangePassword',
			element: <ChangeAreaPassword setCredentials={setCredentials} credentials={Credentials} />
		},
		{
			path: '/Settings/Campaign',
			element: <CampaignSettings />
		},
		{
			path: '/Settings/Campaign/ChangeKey',
			element: <ChangeCampaignPassword credentials={Credentials} />
		},
		{
			path: '/*',
			element: <E404 />
		}
	];

	return (
		<BrowserRouter>
			<div className="Main">
				<NavBar />
				<div className="App">
					<Routes>
						{routes.map((element, i) => {
							return <Route path={element.path} element={element.element} key={i} />;
						})}
					</Routes>
					<Footer />
				</div>
			</div>
		</BrowserRouter>
	);
}

export default App;
