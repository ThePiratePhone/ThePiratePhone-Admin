import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, Route, Routes, useNavigate, useParams } from 'react-router-dom';

import { cleanNumber, startWithVowel } from '../../Utils';
import E404 from '../E404';
import Button from '../../Components/Button';
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
	const [Callers, setCallers] = useState<Array<Caller> | null>(null);

	function getCallers() {
		return new Promise<Array<Caller> | undefined>(resolve => {
			axios
				.post(credentials.URL + '/admin/listCaller', {
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

	useEffect(() => {
		getCallers().then(res => {
			if (res) {
				setCallers(res);
			}
		});
	}, []);

	return (
		<div className="ExplorePage">
			<h1>Gérer les appelants</h1>
			<div>
				<Caller callers={Callers} />
			</div>
		</div>
	);
}

function CallerDetail({ credentials }: { credentials: Credentials }) {
	const { phone } = useParams();
	const [Page, setPage] = useState(<div className="GenericPage"></div>);

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

	function RemovePage({ caller }: { caller: Caller }) {
		return (
			<div className="GenericPage RemovePage">
				<h1>Supprimer {caller.name}</h1>
				<div>
					<span>Voulez-vous vraiment supprimer {caller.name} ?</span>
					<Button value="Supprimer" type="RedButton" onclick={() => remove(caller.phone)} />
				</div>
			</div>
		);
	}

	function DefaultPage({ caller }: { caller: CallerInfos }) {
		return (
			<div className="GenericPage CallerPage">
				<h1>Informations {startWithVowel(caller.name) ? "d'" + caller.name : 'de ' + caller.name}</h1>
				<span>
					<span>
						Nom:<h4>{caller.name}</h4>
					</span>
					<span>
						Téléphone: <span className="Phone">{cleanNumber(caller.phone)}</span>
					</span>
					<span>
						Nombre d'appel: <span className="Phone">{caller.nbCalls}</span>
					</span>
					<span>
						Temps en appel: <span className="Phone">{caller.totalTime.toLocaleTimeString()}</span>
					</span>
					<Button
						value="Modifier le pin"
						onclick={() => {
							setPage(
								<ChangeCallerPassword
									credentials={credentials}
									caller={{ id: caller.id, name: caller.name, phone: caller.phone }}
								/>
							);
						}}
					/>
					<Button
						value="Supprimer"
						type="RedButton"
						onclick={() => {
							setPage(<RemovePage caller={caller} />);
						}}
					/>
				</span>
			</div>
		);
	}

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
							Math.floor(duration / (1000 * 3600)),
							Math.floor(duration / (1000 * 60)),
							Math.floor(duration / 1000)
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
				setPage(<DefaultPage caller={res} />);
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
