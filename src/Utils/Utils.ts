function mobileCheck() {
	const toMatch = [/Android/i, /webOS/i, /iPhone/i, /iPad/i, /iPod/i, /BlackBerry/i, /Windows Phone/i];

	return toMatch.some(toMatchItem => {
		return navigator.userAgent.match(toMatchItem);
	});
}

function getCallDuration(absDuration: number) {
	const duration = new Date(1970, 0, 1, 0, Math.floor(absDuration / 60_000), Math.floor(absDuration / 1000));

	if (duration.toLocaleTimeString() == 'Invalid Date') return 'Inconnue';

	return duration.getHours() + duration.getMinutes() + duration.getSeconds() != 0
		? duration.toLocaleTimeString()
		: 'Inconnue';
}

function clearAccents(value: string) {
	return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function startWithVowel(value: string) {
	return ['a', 'e', 'i', 'o', 'u', 'y'].includes(clearAccents(value[0].toLowerCase()));
}

export { getCallDuration, mobileCheck, startWithVowel };
