import axios from 'axios';
import { createRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ReactSortable } from 'react-sortablejs';

import Delete from '../../../Assets/Images/Delete.svg';
import Button from '../../../Components/Button';

function Priority({
	el,
	remove,
	update
}: {
	el: { name: string; id: string };
	update: (name: string) => void;
	remove: () => void;
}) {
	const ref = createRef<HTMLInputElement>();

	return (
		<div className="Priority">
			<input className="inputField" ref={ref} defaultValue={el.name} onKeyUp={() => update(ref.current!.value)} />
			<img src={Delete} alt="Delete" onClick={remove} />
		</div>
	);
}

function ChangePrioritys({
	credentials,
	campaign,
	setCampaign
}: {
	credentials: Credentials;
	campaign: Campaign;
	setCampaign: (campaign: Campaign) => void;
}) {
	const [ButtonDisabled, setButtonDisabled] = useState(false);
	const [ButtonValue, setButtonValue] = useState('Valider');
	const [Prioritys, setPrioritys] = useState<Array<{ name: string; id: string }>>(campaign.sortGroup);
	const navigate = useNavigate();

	function modify(status: Array<PriorityStatus>) {
		return new Promise<boolean>(resolve => {
			axios
				.post(credentials.URL + '/admin/campaign/setPriority', {
					adminCode: credentials.content.password,
					area: credentials.content.areaId,
					priority: status,
					CampaignId: campaign._id
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

	function updatePrioritys() {
		if (ButtonDisabled) return;
		setButtonDisabled(true);
		setButtonValue('Vérification...');

		modify(Prioritys).then(result => {
			if (result) {
				campaign.sortGroup = Prioritys;
				setCampaign(campaign);
				navigate('/Settings/Campaigns/' + campaign._id);
				return;
			} else {
				setButtonDisabled(false);
				setButtonValue('Une erreur est survenue');
			}
		});
	}

	const addPriority = () => {
		setPrioritys(Prioritys.concat({ name: 'Nouveau', id: Date.now().toString(36) }));
	};

	const removePriority = (id: string) => {
		setPrioritys(Prioritys.filter(el => el.id != id));
	};

	const updatePriority = (name: string, id: string) => {
		setPrioritys(old => {
			const priorityIndex = old.findIndex(el => el.id == id);
			const priority = old.at(priorityIndex)!;
			priority.name = name;
			old[priorityIndex] = priority;
			return old;
		});
	};

	return (
		<div className="GenericPage">
			<h1>Changer les groupes de priorités de la campagne</h1>
			<div>
				<ReactSortable list={Prioritys} setList={setPrioritys} animation={150} className="PrioritysSettings">
					{Prioritys.map(el => {
						return (
							<Priority
								update={(name: string) => updatePriority(name, el.id)}
								key={el.id}
								el={el}
								remove={() => removePriority(el.id)}
							/>
						);
					})}
				</ReactSortable>
				<Button type={ButtonDisabled ? 'ButtonDisabled' : undefined} value="Ajouter" onclick={addPriority} />
				<Button
					type={ButtonDisabled ? 'ButtonDisabled' : undefined}
					value={ButtonValue}
					onclick={updatePrioritys}
				/>
			</div>
		</div>
	);
}

export default ChangePrioritys;
