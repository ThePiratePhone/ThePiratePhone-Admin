import Button from '../../Components/Button';

function CampaignSettings({ campaign }: { campaign: Campaign }) {
	return (
		<div className="Settings">
			<h1>{campaign.name}</h1>
			<div>
				<Button link="ChangeName" value="Changer le nom" />
				<Button link="ChangeScript" value="Changer le script" />
				<Button link="ChangeKey" value="Changer la clé d'accès" />
				<Button link="ChangeHours" value="Changer les horaires d'appel" />
				<Button link="ChangeCallCount" value="Changer le nombre d'appel" />
				<Button link="ChangeResponses" value="Changer les réponses" />
				<Button link="ChangePriority" value="Changer les priorités" />
				<Button link="ChangeCallTime" value="Changer le temps entre les appels" />
				{campaign.active ? <></> : <Button link="SetActive" value="Activer la campagne" type="RedButton" />}
			</div>
		</div>
	);
}

export default CampaignSettings;
