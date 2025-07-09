import axios from 'axios';
import Button from '../../Components/Button';
import Status from '../../Components/Status';
import React, { useEffect, useState } from 'react';
import { cleanNumber } from '../../Utils/Cleaners';
import { Route, Routes } from 'react-router-dom';
import E404 from '../E404';
import ChangePhone from './Area/ChangePhone';
import ChangeAreaPassword from './Area/ChangePassword';
import ChangeAreaName from './Area/ChangeName';

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
	function AreaSettingsHome({ credentials }: { credentials: Credentials }) {
		function checkSmsStatus() {
			return new Promise<{
				adminPhone: Array<[string, string] /* phone, name */>;
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

		useEffect(() => {
			if (!smsStatus) {
				checkSmsStatus().then(status => {
					setSmsStatus(status);
				});
			}
		}, [smsStatus]);

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
							<Button value="mettre a jour les numeros" link="ChangePhone" />
						</div>
					)}
				</div>
			</div>
		);
	}
	const routes = [
		{
			path: '/',
			element: <AreaSettingsHome credentials={credentials} />
		},
		{
			path: '/ChangePhone',
			element: smsStatus ? <ChangePhone PhonesCombo={smsStatus.adminPhone} /> : <></>
		},

		{
			path: '/ChangePassword',
			element: <ChangeAreaPassword setCredentials={setCredentials} credentials={credentials} />
		},
		{
			path: '/ChangeName',
			element: <ChangeAreaName setCredentials={setCredentials} credentials={credentials} />
		},
		{
			path: '/*',
			element: <E404 />
		}
	];

	return (
		<Routes>
			{routes.map((element, i) => {
				return <Route path={element.path} element={element.element} key={i} />;
			})}
		</Routes>
	);
}

export default AreaSettings;
