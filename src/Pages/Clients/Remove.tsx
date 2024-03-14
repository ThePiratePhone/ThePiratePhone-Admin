import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Button from '../../Components/Button';

function Remove({ credentials }: { credentials: Credentials }) {
	const [ButtonDisabled, setButtonDisabled] = useState(false);
	const [ButtonValue, setButtonValue] = useState('Supprimer');

	const navigate = useNavigate();

	function remove(phone: string) {
		return new Promise<number>(resolve => {
			axios
				.post(credentials.URL + '/admin/client/removeClient', {
					area: credentials.content.areaId,
					adminCode: credentials.content.password,
					phone: phone
				})
				.then(() => resolve(0))
				.catch(err => {
					if (!err?.response?.data?.message) {
						console.error(err);
						resolve(1);
					} else if (err.response.data.message == 'Client not found') {
						resolve(2);
					} else if (err.response.data.message == 'Wrong phone number') {
						resolve(3);
					} else {
						console.error(err);
						resolve(1);
					}
				});
		});
	}

	function click() {
		if (ButtonDisabled) return;
		setButtonDisabled(true);

		const phone = (document.getElementById('phone') as HTMLInputElement).value;

		remove(phone).then(res => {
			if (res == 0) {
				navigate('/Clients');
			} else if (res == 2) {
				setButtonValue('Client non trouvé');
				setButtonDisabled(false);
			} else if (res == 3) {
				setButtonValue('Mauvais numéro');
				setButtonDisabled(false);
			} else {
				setButtonValue('Une erreur est survenue');
			}
		});
	}

	function change() {
		if (ButtonValue === 'Supprimer') return;
		setButtonValue('Supprimer');
	}

	function enter(e: any) {
		if (e.key === 'Enter') {
			click();
		}
	}

	return (
		<div className="GenericPage">
			<h1>Supprimer un client</h1>
			<div>
				<input
					onKeyUp={enter}
					disabled={ButtonDisabled}
					id="phone"
					placeholder="Téléphone"
					type="tel"
					className="inputField"
					onChange={change}
				/>
				<Button onclick={click} value={ButtonValue} type={ButtonDisabled ? 'ButtonDisabled' : 'RedButton'} />
			</div>
		</div>
	);
}

export default Remove;
