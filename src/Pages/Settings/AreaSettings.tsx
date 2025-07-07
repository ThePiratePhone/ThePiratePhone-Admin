import axios from 'axios';
import Button from '../../Components/Button';
import Status from '../../Components/Status';
import { useEffect, useState } from 'react';
import { cleanNumber } from '../../Utils/Cleaners';

function AreaSettings({ credentials }: { credentials: Credentials }) {
	function checkSmsStatus() {
		return new Promise<{
			adminPhone: Array<string>;
			service: string;
			enabled: boolean;
		}>(resolve => {
			axios
				.post(credentials.URL + '/admin/area/smsStatus', {
					adminCode: credentials.content.password,
					area: credentials.content.areaId
				})
				.then(result => {
					const data = result.data.data;
					resolve({
						adminPhone: data.adminPhone,
						service: data.service,
						enabled: data.enabled
					});
				})
				.catch(err => {
					console.error(err);
				});
		});
	}

	function SendSms() {
		return new Promise<void>(resolve => {
			axios
				.post(credentials.URL + '/admin/area/sendSms', {
					adminCode: credentials.content.password,
					area: credentials.content.areaId,
					phone: smsStatus?.adminPhone || [],
					message: 'Ceci est un test de sms de tpp. si vous ne reconnaissez pas ce message repondez STOP'
				})
				.then(() => {
					resolve();
				})
				.catch(err => {
					console.error(err);
				});
		});
	}

	const [smsStatus, setSmsStatus] = useState<{
		adminPhone: Array<string>;
		service: string;
		enabled: boolean;
	} | null>(null);

	useEffect(() => {
		checkSmsStatus().then(status => {
			setSmsStatus(status);
		});
	}, []);

	return (
		<div className="Settings">
			<h1>Paramètres de l'organisation</h1>
			<div>
				<Button link="ChangeName" value="Changer le nom" />
				<Button link="ChangePassword" value="Changer le mot de passe d'administration" />
			</div>
			<h1>État du service de sms</h1>
			<div>
				<div className="smsStatus">
					<Status
						status={smsStatus?.enabled ? 'success' : 'muted'}
						text={smsStatus?.enabled ? 'Actif' : 'Inactif'}
					/>
					{smsStatus?.service && (
						<div>
							{smsStatus?.service === 'sms-tools' ? (
								<>
									sur le service{' '}
									<a href="https://github.com/sms-tools/sms-tools">
										<u>sms-tools</u>
									</a>
								</>
							) : smsStatus?.service === 'sms-gateway' ? (
								<>
									sur le service{' '}
									<a href="https://github.com/capcom6/android-sms-gateway">
										<u>sms-gateway</u>
									</a>
								</>
							) : (
								<>sur un service inconnu</>
							)}
						</div>
					)}
				</div>
				{smsStatus && (
					<div>
						<strong>numéros des administrateurs:</strong>
						<ul>
							{smsStatus.adminPhone.map(([phone, name], idx) => (
								<li className="Phone" key={idx}>
									{cleanNumber(phone)} - {name}
								</li>
							))}
						</ul>
						<Button value="tester ces numeros" onclick={SendSms} />
					</div>
				)}
			</div>
		</div>
	);
}

export default AreaSettings;
