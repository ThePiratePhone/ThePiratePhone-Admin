import axios from 'axios';
import { useEffect, useState } from 'react';
import { Route, Routes, useParams } from 'react-router-dom';

import E404 from '../../E404';
import CampaignSettings from '../CampaignSettings';
import ChangeCallCount from './ChangeCallCount';
import ChangeCallTime from './ChangeCallTime';
import ChangeHours from './ChangeHours';
import ChangeCampaignName from './ChangeName';
import ChangeCampaignPassword from './ChangePassword';
import ChangeResponses from './ChangeResponses';
import ChangeScript from './ChangeScript';
import SetActive from './SetActive';
import ChangePrioritys from './ChangePriority';
import { cleanCampaignResponse } from '../../../Utils/Cleaners';

function CampaignMain({
	setCampaign,
	credentials,
	campaign
}: {
	setCampaign: (campaign: Campaign) => void;
	credentials: Credentials;
	campaign: Campaign;
}) {
	const routes = [
		{
			path: '/',
			element: <CampaignSettings campaign={campaign} />
		},
		{
			path: '/ChangeCallCount',
			element: <ChangeCallCount setCampaign={setCampaign} credentials={credentials} campaign={campaign} />
		},
		{
			path: '/ChangeCallTime',
			element: <ChangeCallTime setCampaign={setCampaign} credentials={credentials} campaign={campaign} />
		},
		{
			path: '/ChangeKey',
			element: <ChangeCampaignPassword campaign={campaign} credentials={credentials} />
		},
		{
			path: '/ChangeHours',
			element: <ChangeHours setCampaign={setCampaign} credentials={credentials} campaign={campaign} />
		},
		{
			path: '/ChangeName',
			element: <ChangeCampaignName setCampaign={setCampaign} credentials={credentials} campaign={campaign} />
		},
		{
			path: '/ChangeScript',
			element: <ChangeScript setCampaign={setCampaign} credentials={credentials} campaign={campaign} />
		},
		{
			path: '/ChangeResponses',
			element: <ChangeResponses setCampaign={setCampaign} credentials={credentials} campaign={campaign} />
		},
		{
			path: '/ChangePriority',
			element: <ChangePrioritys setCampaign={setCampaign} credentials={credentials} campaign={campaign} />
		},
		{
			path: '/SetActive',
			element: <SetActive credentials={credentials} campaign={campaign} setCampaign={setCampaign} />
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

function Campaign({
	setCampaign,
	credentials
}: {
	setCampaign: (campaign: Campaign) => void;
	credentials: Credentials;
}) {
	const CAMPAIGNID = useParams().campaignId as string;

	const [Page, setPage] = useState(
		<div className="ExplorePage">
			<h1>Gérer une campagne</h1>
			<div>
				<h4>Récupération en cours...</h4>
			</div>
		</div>
	);

	function getCampaign() {
		return new Promise<Campaign | undefined>(resolve => {
			axios
				.post(credentials.URL + '/admin/campaign/getCampaign', {
					adminCode: credentials.content.password,
					area: credentials.content.areaId,
					CampaignId: CAMPAIGNID
				})
				.then(res => resolve(cleanCampaignResponse(res)));
		});
	}

	useEffect(() => {
		getCampaign().then(res => {
			if (res) {
				setPage(<CampaignMain credentials={credentials} setCampaign={setCampaign} campaign={res} />);
			}
		});
	}, []);

	return Page;
}

export default Campaign;
