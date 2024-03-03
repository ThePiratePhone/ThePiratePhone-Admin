import axios from 'axios';
import Papa from 'papaparse';
import { useState } from 'react';

import Button from '../Components/Button';

const URL = 'https://cs.mpqa.fr:7000/api/admin';

function ErrorsComp({ errors }: { errors: Array<{ name: string; phone: string; error: string }> | null }) {
	if (errors == null) {
		return <></>;
	}

	if (errors.length == 0) {
		return <h4>Aucune erreur détéctée</h4>;
	}

	return (
		<>
			<h4>{errors.length == 1 ? '1 erreur détéctée' : errors.length + ' erreurs détéctées'}</h4>
			<div className="ClientsErrors">
				<div className="ErrorsHeader">Nom</div>
				<div className="ErrorsHeader">Téléphone</div>
				{(() => {
					const render = new Array();
					errors.forEach((value, i) => {
						render.push(<div key={i}>{value.name}</div>);
						render.push(
							<div key={i + 'bis'} className="Phone">
								{value.phone}
							</div>
						);
					});
					return render;
				})()}
			</div>
		</>
	);
}

function AddClients({ credentials }: { credentials: Credentials }) {
	const [ButtonDisabled, setButtonDisabled] = useState(true);
	const [Working, setWorking] = useState(false);
	const [Errors, setErrors] = useState<Array<{ name: string; phone: string; error: string }> | null>(null);
	const [ButtonValue, setButtonValue] = useState('Ajouter');

	async function send(array: Array<{ name: string; phone: string }>) {
		return new Promise<any>(async resolve => {
			let errors = new Array<[{ name: string; phone: string; error: string }]>();
			for (let i = 0; i < array.length; i += 500) {
				const newArray = new Array<[string, string]>();
				for (let j = 0; j < 500 && i + j < array.length; j++) {
					const client = array[i + j];
					newArray.push([client.name, client.phone]);
				}
				const res = await axios
					.post(URL + '/createClients', {
						adminCode: credentials.onlineCredentials.password,
						area: credentials.onlineCredentials.areaId,
						data: newArray
					})
					.catch(err => {
						resolve(undefined);
						console.error(err);
					});
				if (res?.data?.OK) {
					res.data.errors = res.data.errors.map((values: any) => {
						return { name: values[0], phone: values[1], error: values[2] };
					});
					errors = errors.concat(res.data.errors);
				}
			}
			resolve(errors);
		});
	}

	function click() {
		if (ButtonDisabled) return;
		setButtonDisabled(true);
		setWorking(true);
		setButtonValue('Vérification...');

		const file = (document.getElementById('file') as HTMLInputElement).files as FileList;
		file[0].text().then(val => {
			val = 'name,phone\r\n' + val;
			val = val.replaceAll('\r\n\r\n', '\r\n');
			if (val.endsWith('\r\n')) {
				val = val.substring(0, val.length - 2);
			}
			const parser = Papa.parse(val, { header: true, delimiter: ',' });
			const array = parser.data as Array<{ name: string; phone: string }>;
			send(array).then(res => {
				if (!res) {
					setButtonValue('Une erreur est survenue');
				} else {
					setButtonValue('Confirmé !');
					setErrors(res);
				}
			});
		});
	}

	function change() {
		if (((document.getElementById('file') as HTMLInputElement).files as FileList).length == 0) {
			setButtonDisabled(true);
		} else {
			setButtonDisabled(false);
		}
	}

	return (
		<div className="GenericPage">
			<h1>Importer un fichier de clients</h1>
			<p>
				<b>Seul le format csv est supporté !</b>
				<br />
				Veillez à bien formater le fichier. La première colonne doit contenir le nom et la deuxième le numéro de
				téléphone.
			</p>
			<div>
				<input
					disabled={Working}
					className="inputField"
					type="file"
					id="file"
					accept=".csv"
					onChange={change}
				/>
				<Button onclick={click} value={ButtonValue} type={ButtonDisabled ? 'ButtonDisabled' : undefined} />
				<ErrorsComp errors={Errors} />
			</div>
		</div>
	);
}

export default AddClients;
