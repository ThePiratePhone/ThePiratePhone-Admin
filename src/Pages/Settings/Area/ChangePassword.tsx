import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Button from '../../../Components/Button';

function ChangeAreaPassword({
	credentials,
	setCredentials
}: {
	credentials: Credentials;
	setCredentials: (credentials: Credentials) => void;
}) {
	const [ButtonDisabled, setButtonDisabled] = useState(false);
	const [ButtonValue, setButtonValue] = useState('Valider');
	const navigate = useNavigate();

	function modify(password: string) {
		return new Promise<boolean>(resolve => {
			axios
				.post(credentials.URL + '/changePassword', {
					adminCode: credentials.content.password,
					area: credentials.content.areaId,
					newAdminCode: password
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
			setButtonValue("Le mot de passe est identique à l'ancien");
			return;
		}

		if (password == '') {
			setButtonDisabled(false);
			setButtonValue('Le mot de passe ne peut pas être vide');
			return;
		}

		modify(password).then(result => {
			if (result) {
				credentials.content.password = password;
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
			<h1>Changer le mot de passe d'administration</h1>
			<div>
				<input
					id="password"
					type="password"
					placeholder="Nouveau mot de passe"
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

export default ChangeAreaPassword;
