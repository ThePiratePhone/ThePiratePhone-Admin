import axios from 'axios';
import { useEffect, useState } from 'react';
import Button from '../Components/Button';

const URL = 'https://cs.mpqa.fr:7000/api/admin';

function Clients({ credentials }: { credentials: Credentials }) {
	const [UserCount, setUserCount] = useState<number | null>(null);

	function getClientCount() {
		return new Promise<number | null>(resolve => {
			axios
				.post(URL + '/listClientCampaign', {
					adminCode: credentials.onlineCredentials.password,
					area: credentials.onlineCredentials.areaId
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

	useEffect(() => {
		getClientCount().then(value => {
			if (value != null) {
				setUserCount(value);
			}
		});
	}, [getClientCount]);

	return (
		<div className="Clients">
			<h1>Clients</h1>
			<div>
				<div>
					Nombre de client: <span className="Phone">{UserCount == null ? '...' : UserCount}</span>
				</div>
			</div>
			<div>
				<Button value="Ajouter un client" link="AddOne" />
				<Button value="Importer un fichier" link="Add" />
				<Button value="Rechercher un client" link="Search" />
				<Button value="Retier un client" link="Remove" />
				<Button value="Retirer tous les clients" type="RedButton" link="Purge" />
			</div>
		</div>
	);
}

export default Clients;
