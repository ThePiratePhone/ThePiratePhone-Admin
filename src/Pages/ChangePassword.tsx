import { useState } from 'react';
import Button from '../Components/Button';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const URL = 'https://cs.mpqa.fr:7000/api/admin';

function ChangePassword({
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
				.post(URL + '/changePassword', {
					adminCode: credentials.onlineCredentials.password,
					area: credentials.onlineCredentials.areaId,
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

		if (password == credentials.onlineCredentials.password) {
			setButtonDisabled(false);
			setButtonValue("Le mot de passe est identique à  l'ancien");
			return;
		}

		if (password == '') {
			setButtonDisabled(false);
			setButtonValue('Le mot de passe ne peut pas être vide');
			return;
		}

		modify(password).then(result => {
			if (result) {
				credentials.onlineCredentials.password = password;
				setCredentials(credentials);
				navigate('/Settings');
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
		<div className="ChangePassword">
			<h1>Changer le mot de passe</h1>
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

export default ChangePassword;
