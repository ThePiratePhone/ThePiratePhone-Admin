import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Button from '../../Components/Button';

function CreateCaller({ credentials }: { credentials: Credentials }) {
	const [ButtonDisabled, setButtonDisabled] = useState(false);
	const [ButtonValue, setButtonValue] = useState('Créer');
	const navigate = useNavigate();

	function create(name: string, phone: string, pin: string) {
		return new Promise<number>(resolve => {
			axios
				.post(credentials.URL + '/admin/caller/createCaller', {
					adminCode: credentials.content.password,
					area: credentials.content.areaId,
					pinCode: pin,
					phone: phone,
					name: name
				})
				.then(res => {
					if (res.data.OK) {
						resolve(0);
					} else {
						resolve(-1);
					}
				})
				.catch(err => {
					if (!err.response.data.message) {
						console.error(err);
						resolve(-1);
					} else if (err.response.data.message == 'Wrong phone number') {
						resolve(1);
					} else if (err.response.data.message == 'User already exist') {
						resolve(2);
					} else {
						console.error(err);
						resolve(-1);
					}
				});
		});
	}

	function click() {
		if (ButtonDisabled) return;
		setButtonDisabled(true);
		setButtonValue('Création...');

		const name = (document.getElementById('firstname') as HTMLInputElement).value;
		const phone = (document.getElementById('phone') as HTMLInputElement).value;
		const pin = (document.getElementById('pin') as HTMLInputElement).value;

		create(name, phone, pin).then(status => {
			if (status == 0) {
				navigate('/Callers');
			} else if (status == 1) {
				setButtonDisabled(false);
				setButtonValue('Mauvais numéro de téléphone');
			} else if (status == 2) {
				setButtonDisabled(false);
				setButtonValue('Numéro déjà utilisé');
			} else {
				setButtonDisabled(false);
				setButtonValue('Une erreur est survenue');
			}
		});
	}

	function change() {
		if (ButtonValue != 'Créer') {
			setButtonValue('Créer');
		}
	}

	function next(e: any, index: number) {
		if (e.key != 'Enter') return;
		if (index == 0) {
			document.getElementById('phone')?.focus();
		} else if (index == 1) {
			document.getElementById('pin')?.focus();
		} else {
			click();
		}
	}

	return (
		<div className="GenericPage">
			<h1>Créer un appelant</h1>
			<div>
				<input
					onKeyUp={e => next(e, 0)}
					disabled={ButtonDisabled}
					id="firstname"
					placeholder="Nom"
					className="inputField"
					onChange={change}
				/>
				<input
					onKeyUp={e => next(e, 1)}
					disabled={ButtonDisabled}
					id="phone"
					placeholder="Téléphone"
					type="tel"
					className="inputField"
					onChange={change}
				/>
				<input
					onKeyUp={e => next(e, 2)}
					disabled={ButtonDisabled}
					id="pin"
					placeholder="Pin"
					type="tel"
					maxLength={4}
					className="inputField"
					onChange={change}
				/>
				<Button onclick={click} value={ButtonValue} type={ButtonDisabled ? 'ButtonDisabled' : undefined} />
			</div>
		</div>
	);
}

export default CreateCaller;
