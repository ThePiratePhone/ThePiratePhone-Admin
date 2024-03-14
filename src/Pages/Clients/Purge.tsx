import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Button from '../../Components/Button';

function Purge({ credentials, clientNumber }: { credentials: Credentials; clientNumber: number | null }) {
	const [ButtonDisabled, setButtonDisabled] = useState(false);
	const [ButtonValue, setButtonValue] = useState('Supprimer');

	const navigate = useNavigate();

	function remove() {
		return new Promise<boolean>(resolve => {
			axios
				.post(credentials.URL + '/admin/client/removeClients', {
					area: credentials.content.areaId,
					adminCode: credentials.content.password
				})
				.then(() => resolve(true))
				.catch(err => {
					console.error(err);
					resolve(false);
				});
		});
	}

	function click() {
		if (ButtonDisabled) return;
		setButtonDisabled(true);
		remove().then(res => {
			if (res) {
				navigate('/Clients');
			} else {
				setButtonValue('Une erreur est survenue');
			}
		});
	}

	return (
		<div className="GenericPage">
			<h1>Supprimer tous les clients</h1>
			<div>
				<h4>
					Voulez-vous vraiment supprimer {clientNumber ?? 'TOUS les'}{' '}
					{clientNumber == null || clientNumber < 2 ? 'client' : 'clients'} ?
				</h4>
				<Button onclick={click} value={ButtonValue} type={ButtonDisabled ? 'ButtonDisabled' : 'RedButton'} />
			</div>
		</div>
	);
}

export default Purge;
