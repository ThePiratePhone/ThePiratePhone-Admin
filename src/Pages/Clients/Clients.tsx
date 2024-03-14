import axios from 'axios';
import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import Button from '../../Components/Button';
import E404 from '../E404';
import AddClients from './AddClients';
import AddOneClient from './AddOneClient';
import Search from './Explore';
import Purge from './Purge';
import Remove from './Remove';

function ClientsHome({ clientCount }: { clientCount: number | null }) {
	return (
		<div className="Clients">
			<h1>Clients</h1>
			<div>
				<div>
					Nombre de client: <span className="Phone">{clientCount == null ? '...' : clientCount}</span>
				</div>
			</div>
			<div>
				<Button value="Ajouter un client" link="AddOne" />
				<Button value="Importer un fichier" link="Add" />
				<Button value="Rechercher un client" link="Explore" />
				<Button value="Retier un client" link="Remove" />
				<Button value="Retirer tous les clients" type="RedButton" link="Purge" />
			</div>
		</div>
	);
}

function getClientCount(credentials: Credentials) {
	return new Promise<number | null>(resolve => {
		axios
			.post(credentials.URL + '/admin/listClientCampaign', {
				adminCode: credentials.content.password,
				area: credentials.content.areaId
			})
			.then(res => {
				if (res.data.OK) {
					resolve(res.data.data.numberOfClients);
				} else {
					resolve(null);
				}
			})
			.catch(() => resolve(null));
	});
}

function Clients({ credentials }: { credentials: Credentials }) {
	const [ClientCount, setClientCount] = useState<number | null>(null);
	const location = useLocation();

	const routes = [
		{
			path: '/',
			element: <ClientsHome clientCount={ClientCount} />
		},
		{
			path: '/AddOne',
			element: <AddOneClient credentials={credentials} />
		},
		{
			path: '/Add',
			element: <AddClients credentials={credentials} />
		},
		{
			path: '/Explore/*',
			element: <Search credentials={credentials} />
		},
		{
			path: '/Remove',
			element: <Remove credentials={credentials} />
		},
		{
			path: '/Purge',
			element: <Purge clientNumber={ClientCount} credentials={credentials} />
		},
		{
			path: '/*',
			element: <E404 />
		}
	];

	useEffect(() => {
		getClientCount(credentials).then(value => {
			if (value != null) {
				setClientCount(value);
			}
		});
	}, [location.pathname]);

	return (
		<Routes>
			{routes.map((element, i) => {
				return <Route path={element.path} element={element.element} key={i} />;
			})}
		</Routes>
	);
}

export default Clients;
