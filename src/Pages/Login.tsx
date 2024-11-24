import axios from 'axios';
import { useEffect, useState } from 'react';

import Logo from '../Assets/Images/Logo.svg';

import Button from '../Components/Button';
import { clearCredentials, getCredentials, setCredentials } from '../Utils/Storage';

function login(credentials: Credentials) {
	return new Promise<Campaign | undefined>(resolve => {
		axios
			.post(credentials.URL + '/admin/login', {
				area: credentials.content.areaId,
				adminCode: credentials.content.password
			})
			.catch(err => {
				console.error(err);
				resolve(undefined);
			})
			.then(response => {
				if (typeof response == 'undefined') {
					resolve(undefined);
				} else {
					const loginResponse: LoginResponse = response.data.data;
					const campaign = {
						_id: loginResponse.actualCampaignId,
						name: loginResponse.actualCampaignName,
						areaName: loginResponse.areaName,
						calls: {
							max: loginResponse.actualCampaignMaxCall,
							timeBetween: loginResponse.actualCampaignTimeBetweenCall
						},
						hours: {
							start: new Date(loginResponse.actualCampaignCallStart),
							end: new Date(loginResponse.actualCampaignCallEnd)
						},
						status: loginResponse.actualCampaignStatus,
						script: loginResponse.actualCampaignScript,
						active: true
					};
					resolve(campaign);
				}
			});
	});
}

function getAreas(URL: string) {
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

async function testOldToken(URL: string) {
	return new Promise<Campaign | undefined>(resolve => {
		try {
			const oldCredentials = getCredentials();
			if (!oldCredentials) throw undefined;
			oldCredentials.URL = URL;
			login(oldCredentials).then(resolve);
		} catch (e) {
			resolve(undefined);
		}
	});
}

function LoginPage({
	renderApp,
	URL
}: {
	renderApp: (credentials: Credentials, campaign: Campaign) => void;
	URL: string;
}) {
	const [ButtonDisabled, setButtonDisabled] = useState(true);
	const [ButtonValue, setButtonValue] = useState('Connexion...');
	const [Areas, setAreas] = useState<Array<Area>>(new Array());

	useEffect(() => {
		const credentials = getCredentials();
		if (credentials != null) {
			testOldToken(URL).then(result => {
				if (result) {
					credentials.URL = URL;
					credentials.areaName = result.areaName;
					renderApp(credentials, result);
				} else {
					clearCredentials();
					load();
				}
			});
		} else {
			load();
		}
	}, []);

	function load() {
		getAreas(URL).then(areas => {
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
			URL: URL,
			content: {
				areaId: areaid,
				password: (document.getElementById('password') as HTMLInputElement).value
			}
		};

		login(credentials).then(result => {
			if (result) {
				setCredentials(credentials);
				renderApp(credentials, result);
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

	function enter(e: React.KeyboardEvent<HTMLInputElement>) {
		if (e.key === 'Enter') {
			connect();
		}
	}

	return (
		<div className="LoginPage">
			<img src={Logo} />
			<select id="area" className="inputField" disabled={ButtonDisabled}>
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
			<Button value={ButtonValue} onclick={connect} type={ButtonDisabled ? 'ButtonDisabled' : undefined} />
		</div>
	);
}

export default LoginPage;
