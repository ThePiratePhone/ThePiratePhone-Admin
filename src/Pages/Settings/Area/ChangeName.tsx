import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Button from '../../../Components/Button';

function ChangeAreaName({
	credentials,
	setCredentials
}: {
	credentials: Credentials;
	setCredentials: (credentials: Credentials) => void;
}) {
	const [ButtonDisabled, setButtonDisabled] = useState(false);
	const [ButtonValue, setButtonValue] = useState('Valider');
	const navigate = useNavigate();

	function modify(name: string) {
		return new Promise<boolean>(resolve => {
			axios
				.post(credentials.URL + '/admin/area/changeName', {
					adminCode: credentials.content.password,
					area: credentials.content.areaId,
					newName: name
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
				credentials.areaName = name;
				setCredentials(credentials);
				navigate('/Settings/Area');
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
			<h1>Changer le nom de l'organisation</h1>
			<div>
				<input
					id="value"
					type="text"
					placeholder="Nom de l'organisation"
					defaultValue={credentials.areaName}
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

export default ChangeAreaName;
