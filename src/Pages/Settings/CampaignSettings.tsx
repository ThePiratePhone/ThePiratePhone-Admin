import Button from '../../Components/Button';

function CampaignSettings() {
	return (
		<div className="Settings">
			<h1>Paramètres de la campagne</h1>
			<div>
				<Button link="ChangeCallCount" value="Changer le nombre d'appel max" />
				<Button link="ChangeCallTime" value="Changer le temps entre les appels" />
				<Button link="ChangeKey" value="Changer la clé d'accès" />
				<Button link="ChangeHours" value="Changer les horaires d'appel" />
				<Button link="ChangeName" value="Changer le nom" />
			</div>
		</div>
	);
}

export default CampaignSettings;
