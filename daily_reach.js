const puppeteer = require('puppeteer')
const url = "https://websiteseochecker.com/website-traffic-checker/";

const getDailyReach = async (sl, mediaName) => {
	try {
		const browser = await puppeteer.launch({
			headless: true,
			// executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
		})
		const page = await browser.newPage()
		console.log(sl + '. ' + mediaName);
		console.log('accessing...');
		await page.goto(url, { waitUntil: "domcontentloaded" })
		
		console.log('executing...');
		await page.type('[name=ckwebsite]', mediaName)

		await page.waitForNetworkIdle()
		
		await page.evaluate(() => {
			document.getElementById('bigbutton').click()
		})
		
		console.log('searching...');
		await page.waitForSelector('#tblresult')
		let data = await page.evaluate(() => {
			const output = document.querySelector('#tblresult > tbody > tr:nth-child(3)').innerHTML
			
			return output
		})
		
		console.log(data);
		if(data.includes('-')){
			data = data.trim().split('\n')[1].trim().split('-')[1].trim().split(' ')[0]
		} else {
			data = data.trim().split('\n')[1].trim().split(' ')[0].split('>')[1]
		}

		if(data.includes(',')){
			data = data.split(',').join('')
		}

		if(isNaN(data)){
			data = 0
		}

		console.log('output=', data);

		await browser.close()

		// return 'Checking'
		return parseInt(data)
	} catch (error) {
		console.log(error);
	}
}

// getReach(1, 'https://www.cumillardhoni.com')

(async function findReach(){
	const result_array = []
	// const medias = [
	// 	{ media_name: 'Prothomalo.com', media_link: 'http://www.prothomalo.com' },
	// 	{ media_name: 'Kishoralo.com', media_link: 'https://www.kishoralo.com' },
	// 	{ media_name: 'Dhakatribune.com', media_link: 'http://www.dhakatribune.com' }
	// ]
	const medias = [
		{ media_name: 'Prothomalo.com', media_link: 'http://www.prothomalo.com' },
		{ media_name: 'Kishoralo.com', media_link: 'https://www.kishoralo.com' },
		{ media_name: 'Dhakatribune.com', media_link: 'http://www.dhakatribune.com' },
		{ media_name: 'Banglanews24.com', media_link: 'http://www.banglanews24.com' },
		{ media_name: 'Bdnews24.com', media_link: 'https://bangla.bdnews24.com' },
		{ media_name: 'Banglatribune.com', media_link: 'http://www.banglatribune.com' },
		{ media_name: 'Samakal.com', media_link: 'http://samakal.com' },
		{ media_name: 'TheDailyStar.net', media_link: 'http://www.thedailystar.net' },
		{ media_name: 'Jugantor.com', media_link: 'https://www.jugantor.com' },
		{ media_name: 'Theindependentbd.com', media_link: 'http://m.theindependentbd.com' },
		{ media_name: 'Jamuna.tv', media_link: 'https://www.jamuna.tv' },
		{ media_name: 'Financialexpress.com.bd', media_link: 'https://www.thefinancialexpress.com.bd' },
		{ media_name: 'Daily-sun.com', media_link: 'http://www.daily-sun.com' },
		{ media_name: 'Kalerkantho.com', media_link: 'http://kalerkantho.com' },
		{ media_name: 'Businesspostbd.com', media_link: 'https://businesspostbd.com' },
		{ media_name: 'Jagonews24.com', media_link: 'https://www.jagonews24.com' },
		{ media_name: 'Somoynews.tv', media_link: 'http://somoynews.tv' },
		{ media_name: 'Bonikbarta.net', media_link: 'http://bonikbarta.net' },
		{ media_name: 'Risingbd.com', media_link: 'http://www.risingbd.com' },
		{ media_name: 'Unb.com.bd', media_link: 'http://www.unb.com.bd' },
		{ media_name: 'Newagebd.net', media_link: 'http://www.newagebd.net' },
		{ media_name: 'Inqilab.com', media_link: 'https://www.dailyinqilab.com' },
		{ media_name: 'Daily-bangladesh.com', media_link: 'https://m.daily-bangladesh.com' },
		{ media_name: 'Barta24.com', media_link: 'https://barta24.com' },
		{ media_name: 'Tbsnews.net', media_link: 'https://tbsnews.net' },
		{ media_name: 'Dhakatimes24.com', media_link: 'http://www.dhakatimes24.com' },
		{ media_name: 'Deltatimes24.com', media_link: 'http://deltatimes24.com' },
		{ media_name: 'Thedhakatimes.com', media_link: 'https://thedhakatimes.com' },
		{ media_name: 'Dailydhakatimes.com', media_link: 'https://dailydhakatimes.com' },
		{ media_name: 'Dhakatimes.news', media_link: 'https://www.dhakatimes.news' },
		{ media_name: 'Asianage.com', media_link: 'https://dailyasianage.com' },
		{ media_name: 'Jaijaidinbd.com', media_link: 'http://www.jaijaidinbd.com' },
		{ media_name: 'Nayadiganta.com', media_link: 'http://m.dailynayadiganta.com' },
		{ media_name: 'AmaderShomoy.com', media_link: 'http://www.dainikamadershomoy.com' },
		{ media_name: 'Chandpurtimes.com', media_link: 'https://chandpurtimes.com' },
		{ media_name: 'Protidinersangbad.com', media_link: 'http://www.protidinersangbad.com' },
		{ media_name: 'Observerbd.com', media_link: 'https://www.observerbd.com' },
		{ media_name: 'Noakhalisomachar.com', media_link: 'https://www.noakhalisomachar.com' },
		{ media_name: 'Nagarkantha.com', media_link: 'http://www.nagarkantha.com' },
		{ media_name: 'Cumillardhoni.com', media_link: 'https://www.cumillardhoni.com' },
		{ media_name: 'Newsbangla24.com', media_link: 'https://www.newsbangla24.com' },
		{ media_name: 'Othoratv.com', media_link: 'https://www.othoratv.com' },
		{ media_name: 'Somoyerjournal.com', media_link: 'https://somoyerjournal.com' },
		{ media_name: 'Dainikkhobor24.com', media_link: 'https://www.dainikkhobor24.com' },
		{ media_name: 'Cutelearner.com', media_link: 'https://bn.cutelearner.com' },
		{ media_name: 'Bdbazarpatrika.com', media_link: 'https://bdbazarpatrika.com' },
		{ media_name: 'Ittefaq.com.bd', media_link: 'http://www.ittefaq.com.bd' },
		{ media_name: 'bd-pratidin.com', media_link: 'http://www.bd-pratidin.com' },
		{ media_name: 'Corporatenews.com.bd', media_link: 'http://corporatenews.com.bd' },
		{ media_name: 'Techjano.com', media_link: 'https://www.techjano.com' }
	]

	for(let i = 0; i < medias.length; i++) {
		const reach = await getDailyReach(sl = i+1, each_media_link = medias[i].media_link)
		result_array.push({
			media: medias[i].media_name,
			reach: reach
		})
	}
	console.log(result_array);
})()