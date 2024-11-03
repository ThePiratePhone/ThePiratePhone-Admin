import axios from 'axios';
import Papa from 'papaparse';
import { useState } from 'react';

import Button from '../../Components/Button';

function ErrorsComp({ numberCount, errors }: { numberCount: number | null; errors: Array<ClientError> }) {
	if (numberCount == null) {
		return <></>;
	}

	if (errors.length == 0) {
		return (
			<h4>
				<span className="Phone">{numberCount}</span> contacts ajouté·es. Aucune erreur détéctée.
			</h4>
		);
	}

	return (
		<>
			<span>
				<h4>
					<span className="Phone">{numberCount} contacts ajouté·es.</span>{' '}
					<span className="Phone">{errors.length}</span>{' '}
					{errors.length == 1 ? 'erreur détéctée :' : 'erreurs détéctées :'}
				</h4>
			</span>
			<div className="ClientsErrors">
				<div className="ErrorsHeader">Nom</div>
				<div className="ErrorsHeader">Téléphone</div>
				{(() => {
					const errorsRender = new Array();
					errors.forEach((value, i) => {
						errorsRender.push(<div key={i}>{value.name}</div>);
						errorsRender.push(
							<div key={i + 'bis'} className="Phone">
								{value.phone}
							</div>
						);
					});
					return errorsRender;
				})()}
			</div>
		</>
	);
}

function AddClients({ credentials }: { credentials: Credentials }) {
	const [ButtonDisabled, setButtonDisabled] = useState(true);
	const [InputDisabled, setInputDisabled] = useState(false);
	const [Errors, setErrors] = useState<Array<ClientError>>(new Array());
	const [numberCount, setNumberCount] = useState<number | null>(null);
	const [ButtonValue, setButtonValue] = useState('Ajouter');

	async function send(array: Array<{ name: string; phone: string }>) {
		return new Promise<Array<ClientError> | undefined>(async resolve => {
			let errors = new Array<ClientError>();
			for (let i = 0; i < array.length; i += 500) {
				const newArray = new Array<[string, string]>();
				for (let j = 0; j < 500 && i + j < array.length; j++) {
					const client = array[i + j];
					newArray.push([client.name, client.phone]);
				}
				const res = await axios
					.post(credentials.URL + '/admin/client/createClients', {
						adminCode: credentials.content.password,
						area: credentials.content.areaId,
						data: newArray
					})
					.catch(err => {
						resolve(undefined);
						console.error(err);
					});
				if (res?.data?.OK) {
					res.data.errors = res.data.errors.map((values: Array<string>) => {
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
		setInputDisabled(true);
		setButtonValue('Vérification...');

		const file = ((document.getElementById('file') as HTMLInputElement).files as FileList)[0];
		file.text().then(val => {
			val = 'name,phone\r\n' + val;
			val = val.replaceAll('\n\n', '');
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
					setNumberCount(array.length - res.length);
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
			<h1>Importer un fichier de contact</h1>
			<p>
				<b>Seul le format CSV, délimité par des virgules, est supporté !</b>
				<br />
				Veillez à bien formater le fichier. La première colonne doit contenir le nom et la deuxième le numéro de
				téléphone.
			</p>
			<div>
				<input
					disabled={InputDisabled}
					className="inputField"
					type="file"
					id="file"
					accept=".csv"
					onChange={change}
				/>
				<Button onclick={click} value={ButtonValue} type={ButtonDisabled ? 'ButtonDisabled' : undefined} />
				<ErrorsComp numberCount={numberCount} errors={Errors} />
			</div>
		</div>
	);
}

export default AddClients;
