import axios from 'axios';
import { useState } from 'react';

import Button from '../../Components/Button';
import { startWithVowel } from '../../Utils/Utils';

function ChangeCallerPassword({
	credentials,
	caller,
	next
}: {
	credentials: Credentials;
	caller: Caller;
	next: () => void;
}) {
	const [ButtonDisabled, setButtonDisabled] = useState(false);
	const [ButtonValue, setButtonValue] = useState('Valider');

	function modify(pin: string) {
		return new Promise<boolean>(resolve => {
			axios
				.post(credentials.URL + '/admin/caller/changeCallerPassword', {
					adminCode: credentials.content.password,
					area: credentials.content.areaId,
					Callerphone: caller.phone,
					newPassword: pin
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
		const pin = (document.getElementById('pin') as HTMLInputElement).value;

		if (pin == '') {
			setButtonDisabled(false);
			setButtonValue('Le mot de passe ne peut pas être vide');
			return;
		}

		modify(pin).then(result => {
			if (result) {
				next();
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

	function enter(e: React.KeyboardEvent<HTMLInputElement>) {
		if (e.key == 'Enter') {
			updatePassword();
		}
	}

	return (
		<div className="GenericPage">
			<h1>Changer le pin {startWithVowel(caller.name) ? "d'" + caller.name : 'de ' + caller.name}</h1>
			<div>
				<input
					id="pin"
					type="tel"
					placeholder="Nouveau pin"
					className="inputField"
					disabled={ButtonDisabled}
					maxLength={4}
					onChange={change}
					onKeyUp={enter}
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

export default ChangeCallerPassword;
