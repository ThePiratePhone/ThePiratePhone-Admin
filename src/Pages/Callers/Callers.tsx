import axios from 'axios';
import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import Button from '../../Components/Button';
import E404 from '../E404';
import CreateCaller from './CreateCaller';
import Search from './Explore';

function CallersHome({ callerCount }: { callerCount: number | null }) {
	return (
		<div className="Settings">
			<h1>Membres</h1>
			<div>
				<div>
					Nombre de membre: <span className="Phone">{callerCount == null ? '...' : callerCount}</span>
				</div>
			</div>
			<div>
				<Button value="Créer un·e membre" link="Create" />
				<Button value="Gérer les membres" link="Explore" />
			</div>
		</div>
	);
}

function getCallerCount(credentials: Credentials) {
	return new Promise<number | null>(resolve => {
		axios
			.post(credentials.URL + '/admin/listCaller', {
				adminCode: credentials.content.password,
				area: credentials.content.areaId
			})
			.then(res => {
				if (res.data.OK) {
					resolve(res.data.data.numberOfCallers);
				} else {
					resolve(null);
				}
			})
			.catch(err => {
				console.error(err);
				resolve(null);
			});
	});
}

function Callers({ credentials }: { credentials: Credentials }) {
	const [CallerCount, setCallerCount] = useState<number | null>(null);
	const location = useLocation();

	const routes = [
		{
			path: '/',
			element: <CallersHome callerCount={CallerCount} />
		},
		{
			path: '/Create',
			element: <CreateCaller credentials={credentials} />
		},
		{
			path: '/Explore/*',
			element: <Search credentials={credentials} />
		},
		{
			path: '/*',
			element: <E404 />
		}
	];

	useEffect(() => {
		getCallerCount(credentials).then(value => {
			if (value != null) {
				setCallerCount(value);
			}
		});
	}, [location.pathname]);

	return (
		<Routes>
			{routes.map((element, i) => {
				return <Route path={element.path} element={element.element} key={i} />;
			})}
		</Routes>
	);
}

export default Callers;
