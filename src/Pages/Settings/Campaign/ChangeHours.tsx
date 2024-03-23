import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Button from '../../../Components/Button';
function ChangeHours({
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

	function modify(start: Date, end: Date) {
		return new Promise<boolean>(resolve => {
			axios
				.post(credentials.URL + '/admin/campaign/changeCallHours', {
					adminCode: credentials.content.password,
					area: credentials.content.areaId,
					newStartHours: start,
					newEndHours: end
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

	function updateHours() {
		if (ButtonDisabled) return;
		setButtonDisabled(true);
		setButtonValue('Vérification...');
		const start = (document.getElementById('start') as HTMLInputElement).value.split(':');
		const end = (document.getElementById('end') as HTMLInputElement).value.split(':');

		const startDate = new Date(1970, 0, 1, parseInt(start[0]), parseInt(start[1]));
		const endDate = new Date(1970, 0, 1, parseInt(end[0]), parseInt(end[1]));

		modify(startDate, endDate).then(result => {
			if (result) {
				campaign.hours.start = startDate;
				campaign.hours.end = endDate;
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

	return (
		<div className="GenericPage">
			<h1>Changer les heures d'appel</h1>
			<div>
				<div className="HoursChange">
					<input
						defaultValue={campaign.hours.start.toLocaleTimeString()}
						id="start"
						type="time"
						className="inputField"
						disabled={ButtonDisabled}
						onChange={change}
					/>
					à
					<input
						defaultValue={campaign.hours.end.toLocaleTimeString()}
						id="end"
						type="time"
						className="inputField"
						disabled={ButtonDisabled}
						onChange={change}
					/>
				</div>
				<Button
					type={ButtonDisabled ? 'ButtonDisabled' : undefined}
					value={ButtonValue}
					onclick={updateHours}
				/>
			</div>
		</div>
	);
}

export default ChangeHours;
