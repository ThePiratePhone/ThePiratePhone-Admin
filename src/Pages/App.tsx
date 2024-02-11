function App({ credentials, renderLogin }: { credentials: Credentials; renderLogin: () => void }) {
	return <div>{credentials.areaId}</div>;
}

export default App;
