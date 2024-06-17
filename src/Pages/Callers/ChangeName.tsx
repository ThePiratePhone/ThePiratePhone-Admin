import axios from 'axios';
import { useState } from 'react';

import Button from '../../Components/Button';
import { startWithVowel } from '../../Utils/Utils';

function ChangeCallerName({
	credentials,
	caller,
	next
}: {
	credentials: Credentials;
	caller: Caller;
	next: (name: string) => void;
}) {
	const [ButtonDisabled, setButtonDisabled] = useState(false);
	const [ButtonValue, setButtonValue] = useState('Valider');

	function modify(name: string) {
		return new Promise<boolean>(resolve => {
			axios
				.post(credentials.URL + '/admin/caller/changeName', {
					adminCode: credentials.content.password,
					area: credentials.content.areaId,
					phone: caller.phone,
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

	function updateName() {
		if (ButtonDisabled) return;
		setButtonDisabled(true);
		setButtonValue('Vérification...');
		const name = (document.getElementById('firstname') as HTMLInputElement).value;

		modify(name).then(result => {
			if (result) {
				next(name);
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

	function enter(e: any) {
		if (e.key == 'Enter') {
			updateName();
		}
	}

	return (
		<div className="GenericPage">
			<h1>Changer le nom {startWithVowel(caller.name) ? "d'" + caller.name : 'de ' + caller.name}</h1>
			<div>
				<input
					id="firstname"
					type="text"
					placeholder="Nom"
					defaultValue={caller.name}
					className="inputField"
					disabled={ButtonDisabled}
					onChange={change}
					onKeyUp={enter}
				/>
				<Button type={ButtonDisabled ? 'ButtonDisabled' : undefined} value={ButtonValue} onclick={updateName} />
			</div>
		</div>
	);
}

export default ChangeCallerName;
