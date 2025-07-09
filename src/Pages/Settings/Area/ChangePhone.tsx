function ChangePhone({ PhonesCombo }: { PhonesCombo: Array<[string /* phone */, string /* name */]> }) {
	return (
		<div>
			<h2>Change Phone</h2>
			<select>
				{PhonesCombo.map(([phone, name]) => (
					<option key={phone} value={phone}>
						{name}
					</option>
				))}
			</select>
		</div>
	);
}
export default ChangePhone;
