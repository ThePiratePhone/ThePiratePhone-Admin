import { createRef, useEffect, useState } from 'react';
import { ReactSortable } from 'react-sortablejs';

import Delete from '../../../Assets/Images/Delete.svg';
import Button from '../../../Components/Button';
import { cleanNumber } from '../../../Utils/Cleaners';
import axios from 'axios';

function Response({
	el,
	remove,
	update
}: {
	el: { id: number; phone: string; name: string };
	update: (name: string, phone: string) => void;
	remove: () => void;
}) {
	const refname = createRef<HTMLInputElement>();
	const refPhone = createRef<HTMLInputElement>();

	return (
		<div className="Response">
			<input
				className="inputField"
				ref={refname}
				defaultValue={el.name}
				onKeyUp={() => update(refname.current!.value, el.phone)}
			/>
			<input
				className="inputField"
				ref={refPhone}
				defaultValue={cleanNumber(el.phone)}
				onKeyUp={() => update(el.name, refPhone.current!.value)}
			/>
			<img src={Delete} alt="Delete" onClick={remove} />
		</div>
	);
}
function ChangePhone({
	PhonesCombo,
	credentials
}: {
	PhonesCombo: Array<[string /* phone */, string /* name */]>;
	credentials: Credentials;
}) {
	const adminPhone = PhonesCombo.length > 0 ? PhonesCombo[PhonesCombo.length - 1] : ['super admin', 'non renseigné'];
	const [admin, setadmin] = useState(adminPhone);
	const [PhonesName, setPhonesName] = useState(
		PhonesCombo.map(([phone, name], index) => ({ id: index, phone, name }))
	);

	const [ButtonDisabled, setButtonDisabled] = useState(false);
	const [ButtonValue, setButtonValue] = useState('Valider');

	const addResponse = () => {
		let id = 0;
		while (PhonesName.findIndex(val => val.id == id) != -1) id++;
		setPhonesName(PhonesName.concat({ name: 'Nouveau', phone: '+33000000000', id: id }));
	};

	function modify(status: Array<{ id: number; phone: string; name: string }>) {
		console.log(status);
		return new Promise<boolean>(resolve => {
			axios
				.post(credentials.URL + '/admin/area/setPhone', {
					adminCode: credentials.content.password,
					area: credentials.content.areaId,
					phone: status.map((el: { id: number; phone: string; name: string }) => {
						return [el.phone, el.name];
					})
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

	function updateResponses() {
		if (ButtonDisabled) return;
		setButtonDisabled(true);
		setButtonValue('Vérification...');

		modify(PhonesName).then(result => {
			if (result) {
				setButtonDisabled(false);
				setButtonValue('Valider');
				return;
			} else {
				setButtonDisabled(false);
				setButtonValue('Une erreur est survenue');
			}
		});
	}

	return (
		<div className="GenericPage">
			<h2>Changer le numéros des administrateurs</h2>
			<p>
				Dans cette section, vous pouvez modifier, ajouter ou supprimer les numéros de téléphone des
				administrateurs de cette région. Ces numéros seront utilisés pour envoyer des sms en cas de problème
				avec les campagnes en cours, notamment des problèmes avec des utilisateurs qui spammeraient le service,
				la fin des numéros de la campagne ou d’autres erreurs. Dans tous les cas, l'administrateur général
				recevra une copie de tous les messages. Sur cette instance, l'administrateur général est:{' '}
				<a href={`tel:${admin[0]}`} className="Phone">
					<u>{admin[0]}</u>
				</a>
			</p>
			<ReactSortable list={PhonesName} setList={setPhonesName} animation={150} className="ResponsesSettings">
				{PhonesName.map(({ id, phone, name }) => (
					<Response
						update={(updatedName: string, updatedPhone: string) => {
							const newPhones = PhonesName.map(el =>
								el.id === id ? { ...el, name: updatedName, phone: updatedPhone } : el
							);
							setPhonesName(newPhones);
						}}
						key={id}
						el={{ id, phone, name }}
						remove={() => {
							const newPhones = PhonesName.filter(el => el.id !== id);
							setPhonesName(newPhones);
							modify(newPhones);
						}}
					/>
				))}
			</ReactSortable>
			<div>
				<Button type={ButtonDisabled ? 'ButtonDisabled' : undefined} value="Ajouter" onclick={addResponse} />
				<Button
					type={ButtonDisabled ? 'ButtonDisabled' : undefined}
					value={ButtonValue}
					onclick={updateResponses}
				/>
			</div>
		</div>
	);
}
export default ChangePhone;
