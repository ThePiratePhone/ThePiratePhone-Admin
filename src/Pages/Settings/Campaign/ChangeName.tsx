import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Button from '../../../Components/Button';

function ChangeCampaignName({
	credentials,
	campaign,
	setCampaign
}: {
	credentials: Credentials;
	campaign: Campaign;
	setCampaign: (campaign: Campaign) => void;
}) {
	const [ButtonDisabled, setButtonDisabled] = useState(false);
	const [ButtonValue, setButtonValue] = useState('Valider');
	const navigate = useNavigate();

	function modify(name: string) {
		return new Promise<boolean>(resolve => {
			axios
				.post(credentials.URL + '/admin/campaign/changeName', {
					adminCode: credentials.content.password,
					area: credentials.content.areaId,
					newName: name,
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
		const name = (document.getElementById('value') as HTMLInputElement).value;

		if (name == '') {
			setButtonDisabled(false);
			setButtonValue('Le nom ne peut pas être vide');
			return;
		}

		modify(name).then(result => {
			if (result) {
				campaign.name = name;
				setCampaign(campaign);
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
			<h1>Changer le nom de la campagne</h1>
			<div>
				<input
					id="value"
					type="text"
					placeholder="Nom de la campagne"
					defaultValue={campaign.name}
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

export default ChangeCampaignName;
