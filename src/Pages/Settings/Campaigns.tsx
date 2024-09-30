import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function CampaignsList({ campaigns }: { campaigns: Array<Campaign> | null | undefined }) {
	if (campaigns == null) return <h4>Récupération en cours...</h4>;
	if (campaigns == undefined) return <h4>Une erreur est survenue.</h4>;
	if (campaigns.length == 0) return <div>Aucune campagne</div>;

	return (
		<div className="ExploreList">
			{campaigns.map((value, i) => {
				return (
					<Link to={value._id} key={i} className={value.active ? 'Active' : ''}>
						<div>{value.name}</div>
					</Link>
				);
			})}
		</div>
	);
}

function CampaignsSettings({ credentials }: { credentials: Credentials }) {
	const [Campaigns, setCampaigns] = useState<Array<Campaign> | null>(null);

	function getCampaigns() {
		return new Promise<Array<Campaign> | undefined>(resolve => {
			axios
				.post(credentials.URL + '/admin/campaign/listCampaign', {
					area: credentials.content.areaId,
					adminCode: credentials.content.password
				})
				.then(res => {
					if (res.data.OK) {
						resolve(res.data.data.campaign);
					} else {
						resolve(undefined);
					}
				})
				.catch(err => {
					console.error(err);
					resolve(undefined);
				});
		});
	}

	useEffect(() => {
		getCampaigns().then(res => {
			if (res) {
				setCampaigns(res);
			}
		});
	}, []);

	return (
		<div className="ExplorePage">
			<h1>Gérer les campagnes</h1>
			<div>
				<CampaignsList campaigns={Campaigns} />
			</div>
		</div>
	);
}

export default CampaignsSettings;
