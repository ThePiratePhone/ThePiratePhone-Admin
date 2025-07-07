function Status({ status, text }: { status: 'success' | 'danger' | 'muted'; text: string }) {
	return (
		<div className="status">
			<div className={`circle ${status}`}></div>
			<span>{text}</span>
		</div>
	);
}

export default Status;
