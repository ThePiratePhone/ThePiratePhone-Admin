import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Button from '../../../Components/Button';

function SetActive({ credentials, campaign }: { credentials: Credentials; campaign: Campaign }) {
	const [ButtonDisabled, setButtonDisabled] = useState(false);
	const [ButtonValue, setButtonValue] = useState('Activer');
	const navigate = useNavigate();

	function modify() {
		return new Promise<boolean>(resolve => {
			axios
				.post(credentials.URL + '/admin/campaign/setActive', {
					adminCode: credentials.content.password,
					area: credentials.content.areaId,
					active: true,
					campaign: campaign._id
				})
				.then(() => {
					resolve(true);
				})
				.catch(err => {
					console.error(err);
					resolve(false);
				});
		});
	}

	function set() {
		if (ButtonDisabled) return;
		setButtonDisabled(true);
		setButtonValue('Vérification...');

		modify().then(result => {
			if (result) {
				navigate('/Settings/Campaigns/' + campaign._id);
				return;
			} else {
				setButtonDisabled(false);
				setButtonValue('Une erreur est survenue');
			}
		});
	}

	return (
		<div className="GenericPage">
			<h1>Changer la campagne actuelle</h1>
			<span>
				Ceci mettera en pause la campagne actuelle et la remplacera par la nouvelle. Aucune donnée ne sera
				supprimée.
			</span>
			<div>
				<Button type={ButtonDisabled ? 'ButtonDisabled' : 'RedButton'} value={ButtonValue} onclick={set} />
			</div>
		</div>
	);
}

export default SetActive;
