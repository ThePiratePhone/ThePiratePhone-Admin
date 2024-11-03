import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Button from '../../../Components/Button';

function ChangeCampaignPassword({ credentials, campaign }: { credentials: Credentials; campaign: Campaign }) {
	const [ButtonDisabled, setButtonDisabled] = useState(false);
	const [ButtonValue, setButtonValue] = useState('Valider');
	const navigate = useNavigate();

	function modify(password: string) {
		return new Promise<boolean>(resolve => {
			axios
				.post(credentials.URL + '/admin/campaign/changePassword', {
					adminCode: credentials.content.password,
					area: credentials.content.areaId,
					newCampaignCode: password,
					CampaignId: campaign._id
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

	function updatePassword() {
		if (ButtonDisabled) return;
		setButtonDisabled(true);
		setButtonValue('Vérification...');
		const password = (document.getElementById('password') as HTMLInputElement).value;

		if (password == credentials.content.password) {
			setButtonDisabled(false);
			setButtonValue("La clé est identique à l'ancienne");
			return;
		}

		if (password == '') {
			setButtonDisabled(false);
			setButtonValue('La clé ne peut pas être vide');
			return;
		}

		modify(password).then(result => {
			if (result) {
				navigate('/Settings/Campaigns/' + campaign._id);
				return;
			} else {
				setButtonDisabled(false);
				setButtonValue('Une erreur est survenue');
			}
		});
	}

	function change() {
		if (ButtonValue != 'Valider') {
			setButtonValue('Valider');
		}
	}

	return (
		<div className="GenericPage">
			<h1>Changer la clé d'accès de la campagne</h1>
			<div>
				<input
					id="password"
					type="password"
					placeholder="Nouvelle clé"
					className="inputField"
					disabled={ButtonDisabled}
					onChange={change}
				/>
				<Button
					type={ButtonDisabled ? 'ButtonDisabled' : undefined}
					value={ButtonValue}
					onclick={updatePassword}
				/>
			</div>
		</div>
	);
}

export default ChangeCampaignPassword;
