import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Button from '../../../Components/Button';

function ChangeHours({ credentials, loginResponse }: { credentials: Credentials; loginResponse: LoginResponse }) {
	const [ButtonDisabled, setButtonDisabled] = useState(false);
	const [ButtonValue, setButtonValue] = useState('Valider');
	const navigate = useNavigate();

	function modify(start: string, end: string) {
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
		const start = (document.getElementById('start') as HTMLInputElement).value;
		const end = (document.getElementById('end') as HTMLInputElement).value;

		modify(start, end).then(result => {
			if (result) {
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

	const start = new Date(loginResponse.actualCampaignCallEnd);
	const end = new Date(loginResponse.actualCampaignCallEnd);

	console.log(start, end);

	return (
		<div className="GenericPage">
			<h1>Changer les heures d'appel</h1>
			<div>
				<div className="HoursChange">
					<input
						defaultValue={'Test'}
						id="start"
						type="time"
						className="inputField"
						disabled={ButtonDisabled}
						onChange={change}
					/>
					à
					<input id="end" type="time" className="inputField" disabled={ButtonDisabled} onChange={change} />
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
