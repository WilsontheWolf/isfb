module.exports = async (client, oldMember, newMember) => {
	if(!client.crystals.get(oldMember.id)) return
	const cooldowns = {
	  '708466256906551306': 'Bronze',
	  '708466312380284998': 'Silver',
	  '708466330998931487': 'Gold',
	  '708466350976270386': 'Diamond',
	  '708466350976270386': 'Crystal',
	  '708466395112800386': 'Dev'
	}
	let o = oldMember.roles.filter(r => cooldowns[r.id])
	let n = newMember.roles.filter(r => cooldowns[r.id])
	let updated = n.sweep(r => o.has(r.id))
	updated = updated.map(r => cooldowns[r.id])
  };
  