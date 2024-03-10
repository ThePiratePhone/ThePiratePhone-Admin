import Button from '../../Components/Button';

function CampaignSettings() {
	return (
		<div className="Settings">
			<h1>Paramètres de la campagne</h1>
			<div>
				<Button link="ChangeKey" value="Changer la clé d'accès" />
			</div>
		</div>
	);
}

export default CampaignSettings;
