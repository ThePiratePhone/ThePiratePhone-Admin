function getCredentials() {
	const credentials = JSON.parse(window.localStorage.getItem('credentials') as string) as Credentials;

	if (!credentials?.areaName || !credentials?.content?.areaId || !credentials?.content?.password) {
		window.localStorage.clear();
		return undefined;
	}

	return credentials;
}

function setCredentials(credentials: Credentials) {
	window.localStorage.setItem('credentials', JSON.stringify(credentials));
}

function clearCredentials() {
	window.localStorage.removeItem('credentials');
}

export { clearCredentials, getCredentials, setCredentials };
