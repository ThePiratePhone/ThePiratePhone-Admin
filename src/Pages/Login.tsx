import axios from 'axios';
import { useEffect, useState } from 'react';

const URL = 'https://cs.mpqa.fr:7000/api';

function Login(credentials: Credentials): Promise<boolean> {
	return new Promise(resolve => {
		axios
			.post(`${URL}/admin/login`, {
				area: credentials.onlineCredentials.areaId,
				adminCode: credentials.onlineCredentials.password
			})
			.catch(err => {
				console.error(err);
				resolve(false);
			})
			.then(response => {
				if (typeof response == 'undefined') {
					resolve(false);
				} else {
					resolve(true);
				}
			});
	});
}

function getAreas() {
	return new Promise<Array<Area> | undefined>(resolve => {
		axios
			.get(URL + '/getArea')
			.then(res => {
				if (res.data.OK) {
					resolve(res.data.data);
				} else {
					resolve(undefined);
				}
			})
			.catch(err => {
				console.error(err);
				resolve(undefined);
			});
	});
}

async function testOldToken() {
	const oldCredentials = JSON.parse(window.localStorage.getItem('credentials') as string);
	return Login(oldCredentials);
}

function LoginPage({ renderApp }: { renderApp: (credentials: Credentials) => void }) {
	const [ButtonDisabled, setButtonDisabled] = useState(true);
	const [ButtonValue, setButtonValue] = useState('Connexion...');
	const [Areas, setAreas] = useState<Array<Area>>([]);

	useEffect(() => {
		if (window.localStorage.getItem('credentials') != null) {
			testOldToken().then(result => {
				if (result) {
					return renderApp(JSON.parse(window.localStorage.getItem('credentials') as string));
				} else {
					window.localStorage.removeItem('credentials');
					load();
				}
			});
		} else {
			load();
		}
	}, [renderApp]);

	function load() {
		getAreas().then(areas => {
			if (areas) {
				setAreas(areas);
				setButtonDisabled(false);
				setButtonValue('Se connecter');
			} else {
				setButtonValue('Une erreur est survenue');
			}
		});
	}

	function connect() {
		if (ButtonDisabled) return;
		setButtonDisabled(true);
		setButtonValue('Connexion...');

		const areaid = (document.getElementById('area') as HTMLInputElement).value;

		const credentials = {
			areaName: Areas.find(val => val._id === areaid)?.name ?? '',
			onlineCredentials: {
				areaId: areaid,
				password: (document.getElementById('password') as HTMLInputElement).value
			}
		};

		Login(credentials).then(result => {
			if (result) {
				window.localStorage.setItem('credentials', JSON.stringify(credentials));
				renderApp(credentials);
			} else {
				setButtonValue('Identifiants invalides');
				setButtonDisabled(false);
			}
		});
	}

	function change() {
		if (ButtonValue === 'Se connecter') return;
		setButtonValue('Se connecter');
	}

	function enter(e: any) {
		if (e.key === 'Enter') {
			connect();
		}
	}

	return (
		<div className="LoginPage">
			<h1>Administration de Callsphere</h1>
			<select id="area" className="inputField">
				{Areas.map((area, i) => {
					return (
						<option key={i} value={area._id}>
							{area.name}
						</option>
					);
				})}
			</select>
			<input
				className="inputField"
				disabled={ButtonDisabled}
				id="password"
				type="password"
				onChange={change}
				placeholder="Mot de passe"
				onKeyDown={enter}
			/>
			<div className="NavButton">
				<button onClick={connect} className={ButtonDisabled ? 'ButtonDisabled' : ''}>
					{ButtonValue}
				</button>
			</div>
		</div>
	);
}

export default LoginPage;
