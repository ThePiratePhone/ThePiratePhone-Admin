function cleanNumber(number: string) {
	const numberArray = number.split('');
	let newNumber = '';
	if (number.length % 2) {
		newNumber += numberArray.splice(0, 4).join('');
	} else {
		newNumber += numberArray.splice(0, 3).join('');
	}
	newNumber += ' ' + numberArray.splice(0, 1);
	for (let i = 0; i < numberArray.length; i = i + 2) {
		newNumber += ' ' + numberArray[i] + numberArray[i + 1];
	}

	if (newNumber.startsWith('+33 ')) {
		newNumber = newNumber.replace('+33 ', '0');
	}

	return newNumber;
}

function cleanCampaignResponse(response: any): Promise<Campaign | undefined> {
	return new Promise(resolve => {
		if (response.data.OK) {
			const campaign = {
				_id: response.data.data._id,
				name: response.data.data.name,
				areaName: '',
				calls: {
					max: response.data.data.nbMaxCallCampaign,
					timeBetween: response.data.data.timeBetweenCall
				},
				hours: {
					start: new Date(response.data.data.callHoursStart),
					end: new Date(response.data.data.callHoursEnd)
				},
				status: response.data.data.status,
				script: response.data.data.script,
				active: response.data.data.active,
				sortGroup: response.data.data.sortGroup
			};
			resolve(campaign);
		} else {
			resolve(undefined);
		}
	});
}

export { cleanNumber, cleanCampaignResponse };
