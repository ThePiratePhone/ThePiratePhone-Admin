import axios from 'axios';
import { JSX, useEffect, useState } from 'react';
import { Link, Route, Routes, useNavigate, useParams } from 'react-router-dom';

import Button from '../../Components/Button';
import { cleanCampaignResponse, cleanNumber } from '../../Utils/Cleaners';
import { getCallDuration } from '../../Utils/Utils';
import E404 from '../E404';

function Client({ clients }: { clients: Array<SearchClient> | null }) {
	if (clients == null) return <></>;
	if (clients.length == 0) return <div>Aucun résultat</div>;

	return (
		<div className="ExploreList">
			{clients.map((value, i) => {
				return (
					<Link to={value.phone} key={i}>
						<div>
							{value.name || value.firstname
								? `${value.name ?? ''} ${value.firstname ?? ''}`.trim()
								: 'Nom inconnu'}
						</div>
						<div className="Phone">{cleanNumber(value.phone)}</div>
					</Link>
				);
			})}
		</div>
	);
}

function Search({ credentials }: { credentials: Credentials }) {
	const [Clients, setClients] = useState<Array<SearchClient> | null>(null);

	function searchPhone(phone: string) {
		return new Promise<Array<SearchClient> | undefined>(resolve => {
			axios
				.post(credentials.URL + '/admin/client/searchByPhone', {
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
		return new Promise<Array<SearchClient> | undefined>(resolve => {
			axios
				.post(credentials.URL + '/admin/client/searchByName', {
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

	function enter(e: React.KeyboardEvent<HTMLInputElement>) {
		if (e.key == 'Enter') {
			action();
		}
	}

	return (
		<div className="ExplorePage">
			<h1>Rechercher un contact</h1>
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
	const [Client, setClient] = useState<Client | null | undefined>(undefined);
	const [Calls, setCalls] = useState<Array<JSX.Element> | undefined>(undefined);

	const [RemoveButtonValue, setRemoveButtonValue] = useState('Supprimer');
	const [EditButtonValue, setEditButtonValue] = useState('mettre à jour');
	const [RemoveButtonDisabled, setRemoveButtonDisabled] = useState(false);
	const [EditButtonDisabled, setEditButtonDisabled] = useState(true);
	const [Campaign, setCampaign] = useState<Campaign | undefined>(undefined);

	const navigate = useNavigate();

	function getInfos() {
		return new Promise<ClientInfos | undefined>(resolve => {
			axios
				.post(credentials.URL + '/admin/client/clientInfo', {
					adminCode: credentials.content.password,
					area: credentials.content.areaId,
					phone: phone
				})
				.then(res => {
					if (res.data.OK) {
						if (res.data?.data?.call?.length > 0) {
							res.data.data.call = res.data.data.call.map((el: { call: any; caller: Caller }) => {
								el.call.startCall = new Date(el.call.start);
								return el;
							});
						} else {
							res.data.data.call = [];
						}
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

	function sendRemoval(phone: string) {
		return new Promise<boolean>(resolve => {
			axios
				.post(credentials.URL + '/admin/client/removeClient', {
					area: credentials.content.areaId,
					adminCode: credentials.content.password,
					phone: phone
				})
				.then(() => resolve(true))
				.catch(err => {
					console.error(err);
					resolve(false);
				});
		});
	}

	useEffect(() => {
		getInfos().then(res => {
			if (res) {
				setClient(res.client);
				if (!res.call.length) {
					return;
				}
				const calls = new Array();
				calls.push(
					<b key={-5}>Date/Heure</b>,
					<b key={-4}>Durée</b>,
					<b key={-3}>Appelant·e</b>,
					<b key={-2}>Résultat</b>,
					<b key={-1}>Commentaire</b>
				);
				res.call.forEach((element, i) => {
					if (element.call.status == 'not called') {
						return;
					}

					function GetCallBounds() {
						if (element.call.startCall.toLocaleDateString() == 'Invalid Date') {
							return <>Inconnue</>;
						}
						return (
							<>
								<span className="Phone">{element.call.startCall.toLocaleDateString()}</span>
								{' à '}
								<span className="Phone">{element.call.startCall.toLocaleTimeString()}</span>
							</>
						);
					}

					calls.push(
						<span key={i + 'a'}>
							<GetCallBounds />
						</span>,
						<span key={i + 'b'} className="Phone">
							{getCallDuration(element.call.duration)}
						</span>,
						<span key={i + 'c'}>
							{res.call.find(el => el.caller.id == element.caller.id)?.caller.name}
						</span>,
						<span key={i + 'e'}>{element.call.satisfaction}</span>,
						<span key={i + 'f'}>{element.call.comment ?? 'Aucun commentaire'}</span>
					);
				});
				setCalls(calls);
			} else {
				navigate('/Clients/Explore');
			}
		});
		if (phone) {
			getCampaign(credentials.content.areaId).then(res => {
				if (res) {
					setCampaign(res);
				} else {
					setCampaign(undefined);
				}
			});
		}
	}, []);

	function remove() {
		if (Client) {
			setRemoveButtonDisabled(true);
			setRemoveButtonValue('Suppression...');
			sendRemoval(Client.phone).then(res => {
				if (res) {
					navigate('/Clients');
				} else {
					setRemoveButtonDisabled(false);
					setRemoveButtonValue('Une erreur est survenue');
				}
			});
		}
	}

	function getCampaign(areaId: string) {
		return new Promise<Campaign | undefined>(resolve => {
			axios
				.post(credentials.URL + '/admin/campaign/getCampaign', {
					adminCode: credentials.content.password,
					area: areaId
				})
				.then(res => {
					const campaignRes = cleanCampaignResponse(res);
					campaignRes.then(campaign => {
						if (campaign) {
							campaign.sortGroup.push({ name: 'default', id: '-1' });
							resolve(campaign);
						} else {
							resolve(undefined);
						}
					});
				});
		});
	}

	function updatePriority(el: React.ChangeEvent<HTMLSelectElement>) {
		if (Client && Campaign && Client.priority) {
			setEditButtonDisabled(false);
			const client = { ...Client };
			client!.priority!.find(e => e.campaign == Campaign._id)!.id = el.target.value;
			setClient(client);
			setEditButtonValue('mettre à jour');
		}
	}

	function updateName(el: React.ChangeEvent<HTMLInputElement>) {
		if (!Client) return;
		const client = { ...Client };
		client.name = el.target.value;
		setClient(client);
		setEditButtonDisabled(false);
		setEditButtonValue('mettre à jour');
	}

	function updateFirstname(el: React.ChangeEvent<HTMLInputElement>) {
		if (!Client) return;
		const client = { ...Client };
		client.firstname = el.target.value;
		setClient(client);
		setEditButtonDisabled(false);
		setEditButtonValue('mettre à jour');
	}

	function updatePhone(el: React.ChangeEvent<HTMLInputElement>) {
		if (!Client) return;
		const client = { ...Client };
		client.phone = el.target.value;
		setClient(client);
		setEditButtonDisabled(false);
		setEditButtonValue('mettre à jour');
	}

	function updateIntegration(el: React.ChangeEvent<HTMLInputElement>) {
		if (!Client) return;
		const client = { ...Client };
		client.integrationReason = el.target.value;
		setClient(client);
		setEditButtonDisabled(false);
		setEditButtonValue('mettre à jour');
	}

	function updateClient() {
		if (!Client) return;
		axios
			.post(credentials.URL + '/admin/client/createClient', {
				adminCode: credentials.content.password,
				area: credentials.content.areaId,
				phone: Client?.phone,
				name: Client?.name,
				firstName: Client?.firstname,
				priority: Client?.priority,
				integrationReason: Client.integrationReason,
				updateIfExist: true,
				updateKey: Client._id
			})
			.then(res => {
				if (res.data.OK) {
					setEditButtonDisabled(true);
					setEditButtonValue('mis à jour');
				} else {
					setEditButtonDisabled(false);
					setEditButtonValue('Erreur inconnue');
				}
			})
			.catch(err => {
				console.log(err.status);
				if (err.response.data.message == 'Wrong phone number') {
					setEditButtonDisabled(false);
					setEditButtonValue('Mauvais numéro de téléphone');
				} else if (err.status == 422) {
					setEditButtonDisabled(false);
					setEditButtonValue('duplication detectée');
				} else {
					console.error(err);
					setEditButtonDisabled(false);
					setEditButtonValue('Erreur inconnue');
				}
			});
	}
	return (
		<div className="GenericPage ClientPage">
			<h1>Informations d'un contact</h1>
			<span>
				Nom:
				<input
					type="text"
					className="inputField"
					value={Client ? Client.name : 'Récupération en cours...'}
					onChange={updateName}
				/>
				Prénom:
				<input
					type="text"
					className="inputField"
					value={Client ? Client.firstname : 'Récupération en cours...'}
					onChange={updateFirstname}
				/>
				Téléphone:
				<input
					type="text"
					className="Phone inputField"
					value={Client ? cleanNumber(Client.phone) : ''}
					onChange={updatePhone}
				/>
				Priorité:
				<select name="pets" id="priority" className="inputField" onChange={updatePriority}>
					{Campaign ? (
						Campaign.sortGroup.map(el => (
							<option
								value={el.id}
								selected={
									Campaign &&
									Client &&
									Client.priority &&
									el.id == Client?.priority.find(e => e.campaign == Campaign?._id)?.id
										? true
										: false
								}
							>
								{el.name}
							</option>
						))
					) : (
						<option value="none">aucune campagne en cours</option>
					)}
				</select>
				Source de donnée:
				<input
					type="text"
					className="inputField"
					value={Client ? Client.integrationReason : ''}
					onChange={updateIntegration}
				></input>
				<Button
					value={RemoveButtonValue}
					type={RemoveButtonDisabled ? 'ButtonDisabled' : 'RedButton'}
					onclick={remove}
				/>
				<Button
					value={EditButtonValue}
					type={EditButtonDisabled ? 'ButtonDisabled' : ''}
					onclick={updateClient}
				/>
			</span>
			<div>
				{Calls ? (
					<>
						<b>Appels:</b>
						<div className="ClientCalls">{Calls}</div>
					</>
				) : (
					<b>Aucun appel</b>
				)}
			</div>
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
