import axios from 'axios';
import { createContext, useContext, useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Button from '../../Components/Button';
import Status from '../../Components/Status';
import { cleanNumber } from '../../Utils/Cleaners';
import E404 from '../E404';
import ChangeAreaName from './Area/ChangeName';
import ChangeAreaPassword from './Area/ChangePassword';
import ChangePhone from './Area/ChangePhone';

const AdminPhoneContext = createContext<{
	adminPhone: Array<[string, string]>;
	service: string;
	enabled: boolean;
} | null>(null);

function AreaSettings({
	credentials,
	setCredentials
}: {
	credentials: Credentials;
	setCredentials: (credentials: Credentials) => void;
}) {
	const [smsStatus, setSmsStatus] = useState<{
		adminPhone: Array<[string /* phone */, string /* name */]>;
		service: string;
		enabled: boolean;
	} | null>(null);

	useEffect(() => {
		checkSmsStatus().then(status => {
			setSmsStatus(status);
		});
	}, []);

	function checkSmsStatus() {
		return new Promise<{
			adminPhone: Array<[string /* phone */, string /* name */]>;
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

	return (
		<AdminPhoneContext.Provider value={smsStatus}>
			<Routes>
				<Route path="/" element={<AreaSettingsHome credentials={credentials} />} />
				<Route
					path="/ChangePhone"
					element={
						smsStatus ? <ChangePhone credentials={credentials} PhonesCombo={smsStatus.adminPhone} /> : <></>
					}
				/>
				<Route
					path="/ChangePassword"
					element={<ChangeAreaPassword setCredentials={setCredentials} credentials={credentials} />}
				/>
				<Route
					path="/ChangeName"
					element={<ChangeAreaName setCredentials={setCredentials} credentials={credentials} />}
				/>
				<Route path="/*" element={<E404 />} />
			</Routes>
		</AdminPhoneContext.Provider>
	);
}

function AreaSettingsHome({ credentials }: { credentials: Credentials }) {
	const smsStatus = useContext(AdminPhoneContext);

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
				{smsStatus?.adminPhone && (
					<div>
						<strong>numéros des administrateurs:</strong>
						<ul>
							{smsStatus.adminPhone.map(([phone, name], idx) => (
								<li className="Phone" key={idx}>
									{cleanNumber(phone)} - {name}
								</li>
							))}
						</ul>
					</div>
				)}

				<Button
					value="mettre à jour les numeros"
					link={smsStatus?.service ? 'ChangePhone' : undefined}
					type={smsStatus?.service ? undefined : 'ButtonDisabled'}
				/>
				<Button
					value="tester ces numeros"
					onclick={smsStatus?.service ? undefined : SendSms}
					type={smsStatus?.service ? undefined : 'ButtonDisabled'}
				/>
			</div>
		</div>
	);
}

export default AreaSettings;
