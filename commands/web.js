const Discord = require('discord.js')
const puppeteer = require('puppeteer');
exports.run = async (client, message, args, level) => {
	if (!args[0]) return message.reply('Please include a site.')
	let url = args.join(' ')
	if (url.includes('.') && !url.startsWith('http')) {
		url = 'https://' + url
	} else if (!url.includes('.')) {
		url = `https://duckduckgo.com/?q=${encodeURIComponent(url)}`
	}
	// if(url.toLowerCase().includes('ip')) return message.reply('There was an unexpected error viewing that page.')
	let fullPage = !!message.flags.includes('f')
	const browser = await puppeteer.launch({ /*executablePath: 'chromium-browser'*/ });
	try {
		message.react('524998745725861904').catch(e => e)
		const page = await browser.newPage();
		await page.setViewport({
			width: 852,
			height: 480,
		});
		await page.goto(url);
		let html = (await page.evaluate(() => document.body.innerHTML))
		if(html.includes('2604:3d09:2282:eb00') || html.replace(/\D/g, '').includes('246468')) throw 'Ip found'
		let title = await page.title() || url
		// if(title.toLowerCase().includes('ip')) throw 'Ip found'
		await message.channel.send(title, new Discord.MessageAttachment(await page.screenshot({ fullPage }), 'page.png'))

	} catch (e) {
		message.reply('There was an unexpected error viewing that page.')
		console.error('Error Loading Page: ' + url)
		console.error(e)
	} finally {
		message.react('524998745725861904').catch(e => e)
		await browser.close();
	}

};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: [],
	permLevel: "User",
	hidden: true
};

exports.help = {
	name: "web",
	category: "Miscelaneous",
	description: "Preview a webpage.",
	usage: "web [url]"
};
