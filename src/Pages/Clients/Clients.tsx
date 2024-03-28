import axios from 'axios';
import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import Button from '../../Components/Button';
import E404 from '../E404';
import AddClients from './AddClients';
import AddOneClient from './AddOneClient';
import Search from './Explore';
import exportCSV from './Export';
import Purge from './Purge';
import Remove from './Remove';

function ClientsHome({
	clientCount,
	campaign,
	credentials
}: {
	clientCount: number | null;
	campaign: Campaign;
	credentials: Credentials;
}) {
	const [ButtonDisabled, setButtonDisabled] = useState(false);
	const [ButtonValue, setButtonValue] = useState('Exporter les clients');

	function exp() {
		setButtonDisabled(true);
		setButtonValue('Exportation en cours...');
		exportCSV(credentials).then(res => {
			if (res) {
				const blob = new Blob([res], { type: 'text/csv' });
				saveFile(blob);
				setButtonDisabled(false);
				setButtonValue('Exporté !');
			} else {
				setButtonDisabled(false);
				setButtonValue('Une erreur est survenue');
			}
		});
	}

	async function saveFile(blob: Blob) {
		const a = document.createElement('a');
		a.download = 'Export ' + campaign.name + ' ' + new Date().toLocaleDateString() + '.csv';
		a.href = URL.createObjectURL(blob);
		a.addEventListener('click', () => {
			setTimeout(() => URL.revokeObjectURL(a.href), 30 * 1000);
		});
		a.click();
	}

	return (
		<div className="Settings">
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
				<Button type={ButtonDisabled ? 'ButtonDisabled' : ''} value={ButtonValue} onclick={exp} />
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
			.catch(err => {
				console.error(err);
				resolve(null);
			});
	});
}

function Clients({ credentials, campaign }: { credentials: Credentials; campaign: Campaign }) {
	const [ClientCount, setClientCount] = useState<number | null>(null);
	const location = useLocation();

	const routes = [
		{
			path: '/',
			element: <ClientsHome campaign={campaign} credentials={credentials} clientCount={ClientCount} />
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
			element: <Search campaign={campaign} credentials={credentials} />
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
