import axios from 'axios';
import { useState } from 'react';

import Button from '../Components/Button';
import { useNavigate } from 'react-router-dom';

const URL = 'https://cs.mpqa.fr:7000/api/admin';

function AddOneClient({ credentials }: { credentials: Credentials }) {
	const [ButtonDisabled, setButtonDisabled] = useState(false);
	const [ButtonValue, setButtonValue] = useState('Ajouter');
	const navigate = useNavigate();

	function create(name: string, phone: string) {
		return new Promise<number>(resolve => {
			axios
				.post(URL + '/createClient', {
					adminCode: credentials.onlineCredentials.password,
					area: credentials.onlineCredentials.areaId,
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

	function add(name: string, phone: string) {
		return new Promise<number>(resolve => {
			axios
				.post(URL + '/addClientCampaign', {
					adminCode: credentials.onlineCredentials.password,
					area: credentials.onlineCredentials.areaId,
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
					console.error(err);
					if (!err.response.data.message) {
						console.error(err);
						resolve(-1);
					} else {
						resolve(-1);
					}
				});
		});
	}

	function click() {
		if (ButtonDisabled) return;
		setButtonDisabled(true);
		setButtonValue('Vérification...');

		const name = (document.getElementById('name') as HTMLInputElement).value;
		const phone = (document.getElementById('phone') as HTMLInputElement).value;

		create(name, phone).then(status => {
			if (status == 1) {
				setButtonDisabled(false);
				setButtonValue('Mauvais numéro de téléphone');
			} else if (status == 2) {
				add(name, phone).then(status => {
					if (status == 0) {
						navigate('/Clients');
					} else {
						setButtonDisabled(false);
						setButtonValue('Une erreur est survenue');
					}
				});
			} else if (status == 0) {
				add(name, phone).then(status => {
					if (status == 0) {
						navigate('/Clients');
					} else {
						setButtonDisabled(false);
						setButtonValue('Une erreur est survenue');
					}
				});
			} else {
				setButtonDisabled(false);
				setButtonValue('Une erreur est survenue');
			}
		});
	}

	function change() {
		if (ButtonValue != 'Ajouter') {
			setButtonValue('Ajouter');
		}
	}

	function next(e: any, index: number) {
		if (e.key != 'Enter') return;
		if (index == 0) {
			document.getElementById('phone')?.focus();
		} else {
			click();
		}
	}

	return (
		<div className="GenericPage">
			<h1>Ajouter un client</h1>
			<div>
				<input
					onKeyUp={e => next(e, 0)}
					disabled={ButtonDisabled}
					id="name"
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
				<Button onclick={click} value={ButtonValue} type={ButtonDisabled ? 'ButtonDisabled' : undefined} />
			</div>
		</div>
	);
}

export default AddOneClient;
