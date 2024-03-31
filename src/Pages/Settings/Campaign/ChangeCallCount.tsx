import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Button from '../../../Components/Button';

function ChangeCallCount({
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

	function modify(value: number) {
		return new Promise<boolean>(resolve => {
			axios
				.post(credentials.URL + '/admin/changeNumberMaxCall', {
					adminCode: credentials.content.password,
					area: credentials.content.areaId,
					newNumberMaxCall: value.toString()
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

	function updateCount() {
		if (ButtonDisabled) return;
		setButtonDisabled(true);
		setButtonValue('Vérification...');
		const value = parseInt((document.getElementById('value') as HTMLInputElement).value);

		modify(value).then(result => {
			if (result) {
				campaign.calls.max = value;
				setCampaign(campaign);
				navigate('/Settings/Campaign');
				return;
			} else {
				setButtonDisabled(false);
				setButtonValue('Une erreur est survenue');
			}
		});
	}

	return (
		<div className="GenericPage">
			<h1>Changer le nombre d'appel</h1>
			<div>
				<span>
					Chaque client sera appelé une seule fois. Cette valeur décrit le nombre d'appel à réeffectuer si le
					client ne répond pas.
				</span>
				<div className="HoursChange">
					<select id="value" defaultValue={campaign.calls.max} className="inputField">
						{[1, 2, 3, 4, 5, 10, 20].map((value, i) => (
							<option key={i} value={value}>
								{value}
							</option>
						))}
					</select>
				</div>
				<Button
					type={ButtonDisabled ? 'ButtonDisabled' : undefined}
					value={ButtonValue}
					onclick={updateCount}
				/>
			</div>
		</div>
	);
}

export default ChangeCallCount;
