import { useState } from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';

import Footer from './Components/Footer';
import NavBar from './Components/NavBar';
import Callers from './Pages/Callers/Callers';
import Clients from './Pages/Clients/Clients';
import Dashboard from './Pages/Dashboard';
import E404 from './Pages/E404';
import Settings from './Pages/Settings/Settings';
import Statistics from './Pages/Statistics/GlobalPage';

function App({
	credentials,
	renderLogin,
	campaign
}: {
	credentials: Credentials;
	renderLogin: () => void;
	campaign: Campaign;
}) {
	const [Credentials, setCredentials] = useState(credentials);
	const [Campaign, setCampaign] = useState(campaign);

	const routes = [
		{
			path: '/',
			element: <Dashboard />
		},
		{
			path: '/Statistics/*',
			element: <Statistics credentials={Credentials} />
		},
		{
			path: '/Clients/*',
			element: <Clients campaign={Campaign} credentials={Credentials} />
		},
		{
			path: '/Callers/*',
			element: <Callers credentials={Credentials} />
		},
		{
			path: '/Settings/*',
			element: (
				<Settings
					setCampaign={setCampaign}
					credentials={Credentials}
					setCredentials={setCredentials}
					renderLogin={renderLogin}
				/>
			)
		},
		{
			path: '/*',
			element: <E404 />
		}
	];

	return (
		<HashRouter>
			<div className="Main">
				<NavBar />
				<div>
					<div className="App">
						<Routes>
							{routes.map((element, i) => {
								return <Route path={element.path} element={element.element} key={i} />;
							})}
						</Routes>
					</div>
					<Footer />
				</div>
			</div>
		</HashRouter>
	);
}

export default App;
