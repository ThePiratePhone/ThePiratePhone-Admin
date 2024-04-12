import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, Route, Routes, useNavigate, useParams } from 'react-router-dom';

import Button from '../../Components/Button';
import { cleanNumber, startWithVowel } from '../../Utils';
import E404 from '../E404';
import ChangeCallerName from './ChangeName';
import ChangeCallerPassword from './ChangePassword';

function Caller({ callers }: { callers: Array<Caller> | null }) {
	if (callers == null) return <></>;
	if (callers.length == 0) return <div>Aucun résultat</div>;

	return (
		<div className="ExploreList">
			{callers.map((value, i) => {
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
	const [AllCallers, setAllCallers] = useState<Array<Caller> | null>(null);
	const [Callers, setCallers] = useState<Array<Caller> | null>(null);

	function getCallers() {
		return new Promise<Array<Caller> | undefined>(resolve => {
			axios
				.post(credentials.URL + '/admin/caller/listCaller', {
					area: credentials.content.areaId,
					adminCode: credentials.content.password
				})
				.then(res => {
					if (res.data.OK) {
						resolve(res.data.data.callers);
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

	function searchPhone(phone: string) {
		return new Promise<Array<Caller> | undefined>(resolve => {
			axios
				.post(credentials.URL + '/admin/caller/searchByPhone', {
					area: credentials.content.areaId,
					adminCode: credentials.content.password,
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
		return new Promise<Array<Caller> | undefined>(resolve => {
			axios
				.post(credentials.URL + '/admin/caller/searchByName', {
					area: credentials.content.areaId,
					adminCode: credentials.content.password,
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
			setCallers(AllCallers);
			return;
		}
		if (phone != '') {
			searchPhone(phone).then(res => {
				if (!res) return;
				setCallers(res);
			});
		} else {
			searchName(name).then(res => {
				if (!res) return;
				setCallers(res);
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
		}, 250);
	}

	function changeName() {
		(document.getElementById('phone') as HTMLInputElement).value = '';

		const oldValue = (document.getElementById('name') as HTMLInputElement).value;
		setTimeout(() => {
			const value = (document.getElementById('name') as HTMLInputElement).value;
			if (oldValue == value) {
				action();
			}
		}, 250);
	}

	function enter(e: any) {
		if (e.key == 'Enter') {
			action();
		}
	}

	useEffect(() => {
		getCallers().then(res => {
			if (res) {
				setAllCallers(res);
				setCallers(res);
			}
		});
	}, []);

	return (
		<div className="ExplorePage">
			<h1>Gérer les membres</h1>
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
				<Caller callers={Callers} />
			</div>
		</div>
	);
}

function CallerDetailMain({ credentials, caller }: { credentials: Credentials; caller: CallerInfos }) {
	const [Caller, setCaller] = useState<CallerInfos>(caller);
	const [Page, setPage] = useState(<DefaultPage />);

	const navigate = useNavigate();

	function remove(phone: string) {
		return new Promise<void>(resolve => {
			axios
				.post(credentials.URL + '/admin/caller/removeCaller', {
					area: credentials.content.areaId,
					adminCode: credentials.content.password,
					phone: phone
				})
				.then(() => {
					navigate('/Callers');
					resolve();
				})
				.catch(err => {
					console.error(err);
					resolve();
				});
		});
	}

	function RemovePage() {
		return (
			<div className="GenericPage RemovePage">
				<h1>Supprimer {Caller.name}</h1>
				<div>
					<span>Voulez-vous vraiment supprimer {Caller.name} ?</span>
					<Button value="Supprimer" type="RedButton" onclick={() => remove(Caller.phone)} />
				</div>
			</div>
		);
	}

	function DefaultPage() {
		return (
			<div className="GenericPage CallerPage">
				<h1>Informations {startWithVowel(Caller.name) ? "d'" + Caller.name : 'de ' + Caller.name}</h1>
				<span>
					<span>
						Nom:<h4>{Caller.name}</h4>
					</span>
					<span>
						Téléphone: <span className="Phone">{cleanNumber(Caller.phone)}</span>
					</span>
					<span>
						Nombre d'appel: <span className="Phone">{Caller.nbCalls}</span>
					</span>
					<span>
						Temps en appel: <span className="Phone">{Caller.totalTime.toLocaleTimeString()}</span>
					</span>
					<Button value="Modifier le nom" onclick={() => renderPage('name')} />
					<Button value="Modifier le pin" onclick={() => renderPage('password')} />
					<Button value="Supprimer" type="RedButton" onclick={() => renderPage('delete')} />
				</span>
			</div>
		);
	}

	function renderPage(link: 'home' | 'password' | 'name' | 'delete') {
		if (link == 'password') {
			setPage(<ChangeCallerPassword credentials={credentials} caller={Caller} next={() => renderPage('home')} />);
		} else if (link == 'name') {
			setPage(
				<ChangeCallerName
					credentials={credentials}
					caller={Caller}
					next={(name: string) => {
						Caller.name = name;
						setCaller(Caller);
						renderPage('home');
					}}
				/>
			);
		} else if (link == 'delete') {
			setPage(<RemovePage />);
		} else {
			setPage(<DefaultPage />);
		}
	}

	return Page;
}

function CallerDetail({ credentials }: { credentials: Credentials }) {
	const { phone } = useParams();
	const [Page, setPage] = useState(
		<div className="GenericPage">
			<div>
				<b>Récupération en cours...</b>
			</div>
		</div>
	);

	const navigate = useNavigate();

	function getInfos() {
		return new Promise<CallerInfos | undefined>(resolve => {
			axios
				.post(credentials.URL + '/admin/caller/callerInfo', {
					adminCode: credentials.content.password,
					area: credentials.content.areaId,
					phone: phone
				})
				.then(res => {
					if (res.data.OK) {
						const duration = res.data.data.totalTime;
						const date = new Date(
							1970,
							0,
							1,
							Math.floor((duration / (1000 * 3600)) % 24),
							Math.floor((duration / (1000 * 60)) % 60),
							Math.floor((duration / 1000) % 60)
						);
						res.data.data.totalTime = date;
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
		getInfos().then(res => {
			if (res) {
				setPage(<CallerDetailMain credentials={credentials} caller={res} />);
			} else {
				navigate('/Callers');
			}
		});
	}, []);

	return Page;
}

function Explore({ credentials }: { credentials: Credentials }) {
	return (
		<Routes>
			<Route path="/" element={<Search credentials={credentials} />} />
			<Route path="/:phone" element={<CallerDetail credentials={credentials} />} />
			<Route path="/*" element={<E404 />} />
		</Routes>
	);
}

export default Explore;
