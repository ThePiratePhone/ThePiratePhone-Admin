import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, Route, Routes, resolvePath, useParams } from 'react-router-dom';

import { cleanNumber } from '../../Utils';
import E404 from '../E404';

const URL = 'https://cs.mpqa.fr:7000/api/admin';

function Client({ clients }: { clients: Array<Client> | null }) {
	if (clients == null) return <></>;
	if (clients.length == 0) return <div>Aucun résultat</div>;

	return (
		<div className="ExploreList">
			{clients.map((value, i) => {
				return (
					<Link to={value.phone} key={i}>
						<div>{value.name}</div>
						<div className="Phone">{cleanNumber(value.phone)}</div>
					</Link>
				);
			})}
		</div>
	);
}

function Search({ credentials }: { credentials: Credentials }) {
	const [Clients, setClients] = useState<Array<Client> | null>(null);

	function searchPhone(phone: string) {
		return new Promise<Array<Client> | undefined>(resolve => {
			axios
				.post(URL + '/client/searchByPhone', {
					area: credentials.onlineCredentials.areaId,
					adminCode: credentials.onlineCredentials.password,
					phone: phone
				})
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

	function searchName(name: string) {
		return new Promise<Array<Client> | undefined>(resolve => {
			axios
				.post(URL + '/client/searchByName', {
					area: credentials.onlineCredentials.areaId,
					adminCode: credentials.onlineCredentials.password,
					name: name
				})
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

	function action() {
		const phone = (document.getElementById('phone') as HTMLInputElement).value.trim();
		const name = (document.getElementById('name') as HTMLInputElement).value.trim();

		if (name == '' && phone == '') {
			setClients(null);
			return;
		}
		if (phone != '') {
			searchPhone(phone).then(res => {
				if (!res) return;
				setClients(res);
			});
		} else {
			searchName(name).then(res => {
				if (!res) return;
				setClients(res);
			});
		}
	}

	function changePhone() {
		(document.getElementById('name') as HTMLInputElement).value = '';

		const oldValue = (document.getElementById('phone') as HTMLInputElement).value;
		setTimeout(() => {
			const value = (document.getElementById('phone') as HTMLInputElement).value;
			if (oldValue == value) {
				action();
			}
		}, 500);
	}

	function changeName() {
		(document.getElementById('phone') as HTMLInputElement).value = '';

		const oldValue = (document.getElementById('name') as HTMLInputElement).value;
		setTimeout(() => {
			const value = (document.getElementById('name') as HTMLInputElement).value;
			if (oldValue == value) {
				action();
			}
		}, 500);
	}

	function enter(e: any) {
		if (e.key == 'Enter') {
			action();
		}
	}

	return (
		<div className="ExplorePage">
			<h1>Rechercher un client</h1>
			<div>
				<div>
					<input
						onKeyUp={enter}
						id="phone"
						placeholder="Téléphone"
						type="tel"
						className="inputField"
						onChange={changePhone}
					/>
					<input
						onKeyUp={enter}
						id="name"
						placeholder="Nom"
						type="text"
						className="inputField"
						onChange={changeName}
					/>
				</div>
				<Client clients={Clients} />
			</div>
		</div>
	);
}

function ClientDetail({ credentials }: { credentials: Credentials }) {
	const { phone } = useParams();
	const [Client, setClient] = useState<ClientInfos | undefined>(undefined);

	function getInfos(phone: string) {
		return new Promise<ClientInfos | undefined>(resolve => {
			axios
				.post(URL + '/client/clientInfo', {
					adminCode: credentials.onlineCredentials.password,
					area: credentials.onlineCredentials.areaId,
					phone: phone
				})
				.then(res => {
					console.log(res);
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

	useEffect(() => {
		getInfos(phone as string).then(res => {
			setClient(res);
		});
	}, [getInfos]);

	return (
		<div className="ExplorePage">
			<h1>Informations d'un client</h1>
			<div>{Client?.client.name}</div>
		</div>
	);
}

function Explore({ credentials }: { credentials: Credentials }) {
	return (
		<Routes>
			<Route path="/" element={<Search credentials={credentials} />} />
			<Route path="/:phone" element={<ClientDetail credentials={credentials} />} />
			<Route path="/*" element={<E404 />} />
		</Routes>
	);
}

export default Explore;
