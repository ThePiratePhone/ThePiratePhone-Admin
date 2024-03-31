import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Button from '../../../Components/Button';

function ChangeCallTime({
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

	function modify(time: number) {
		return new Promise<boolean>(resolve => {
			axios
				.post(credentials.URL + '/admin/changeTimeBetwenCall', {
					adminCode: credentials.content.password,
					area: credentials.content.areaId,
					newTimeBetweenCall: time
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

	function updateTime() {
		if (ButtonDisabled) return;
		setButtonDisabled(true);
		setButtonValue('Vérification...');
		const time = (document.getElementById('time') as HTMLInputElement).value.split(':');

		const value = parseInt(time[0]) * 3_600_000 + parseInt(time[1]) * 60_000;

		modify(value).then(result => {
			if (result) {
				campaign.calls.timeBetween = value;
				setCampaign(campaign);
				navigate('/Settings/Campaign');
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

	const value =
		(campaign.calls.timeBetween / 3_600_000).toFixed().toString().padStart(2, '0') +
		':' +
		((campaign.calls.timeBetween % 60_000) / 60_000).toFixed().toString().padStart(2, '0');

	return (
		<div className="GenericPage">
			<h1>Changer le temps entre les appels</h1>
			<div>
				<span>
					Cette valeur représente le temps d'attente avant de rappeler un contact qui n'a pas répondu.
				</span>
				<div className="HoursChange">
					<input
						defaultValue={value}
						id="time"
						type="time"
						className="inputField"
						disabled={ButtonDisabled}
						onChange={change}
					/>
				</div>
				<Button type={ButtonDisabled ? 'ButtonDisabled' : undefined} value={ButtonValue} onclick={updateTime} />
			</div>
		</div>
	);
}

export default ChangeCallTime;
