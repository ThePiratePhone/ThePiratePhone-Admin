import axios from 'axios';
import { createRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ReactSortable } from 'react-sortablejs';

import Delete from '../../../Assets/Images/Delete.svg';
import Button from '../../../Components/Button';

function Response({
	el,
	remove,
	update
}: {
	el: { name: string; id: number };
	update: (name: string) => void;
	remove: () => void;
}) {
	const ref = createRef<HTMLInputElement>();

	return (
		<div className="Response">
			<input className="inputField" ref={ref} defaultValue={el.name} onKeyUp={() => update(ref.current!.value)} />
			<img src={Delete} alt="Delete" onClick={remove} />
		</div>
	);
}

function ChangeResponses({
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
	const [Responses, setResponses] = useState<Array<{ name: string; toRecall: boolean; id: number }>>(
		campaign.status.map((val, i) => {
			return { ...val, id: i };
		})
	);
	const navigate = useNavigate();

	function modify(status: Array<CallStatus>) {
		return new Promise<boolean>(resolve => {
			axios
				.post(credentials.URL + '/admin/campaign/setSatisfaction', {
					adminCode: credentials.content.password,
					area: credentials.content.areaId,
					satisfactions: status,
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

	function updateResponses() {
		if (ButtonDisabled) return;
		setButtonDisabled(true);
		setButtonValue('Vérification...');

		modify(Responses).then(result => {
			if (result) {
				campaign.status = Responses;
				setCampaign(campaign);
				navigate('/Settings/Campaigns/' + campaign._id);
				return;
			} else {
				setButtonDisabled(false);
				setButtonValue('Une erreur est survenue');
			}
		});
	}

	const addResponse = () => {
		let id = 0;
		while (Responses.findIndex(val => val.id == id) != -1) id++;
		setResponses(Responses.concat({ name: 'Nouveau', toRecall: false, id: id }));
	};

	const removeResponse = (id: number) => {
		setResponses(Responses.filter(el => el.id != id));
	};

	const updateResponse = (name: string, id: number) => {
		setResponses(old => {
			const responseIndex = old.findIndex(el => el.id == id);
			const response = old.at(responseIndex)!;
			response.name = name;
			old[responseIndex] = response;
			return old;
		});
	};

	return (
		<div className="GenericPage">
			<h1>Changer les réponses de la campagne</h1>
			<div>
				<ReactSortable list={Responses} setList={setResponses} animation={150} className="ResponsesSettings">
					{Responses.map(el => {
						if (el.name == '[hide] validate by API') return <></>;
						return (
							<Response
								update={(name: string) => updateResponse(name, el.id)}
								key={el.id}
								el={el}
								remove={() => removeResponse(el.id)}
							/>
						);
					})}
				</ReactSortable>
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

export default ChangeResponses;
