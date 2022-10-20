/**
 * For searching daily reach from a site by web scrapping
 * 
 * @created_by Ahmed Sadman
 * @created_at 02-06-2022
 * @modified_at 18-10-2022
 */

// required puppeteer for headless browsing & scrapping
const puppeteer = require('puppeteer')
// required for accessing file system
const fs = require("fs")
// required for getting directory locations
const path = require("path")

// site url for scrapping
const url = "https://websiteseochecker.com/website-traffic-checker/";

/**
 * gets the monthly reach of newspapers
 * 
 * @param {serial for printing purpose} sl 
 * @param {each media link for scrapping} each_media_link 
 * 
 * @returns {integer reach value for that single media link}
 */
const getMonthlyReach = async (sl, each_media_link) => {
	try {
		// launch headless browsing
		const browser = await puppeteer.launch()
		const page = await browser.newPage()
		console.log(sl + '. ' + each_media_link);
		console.log('accessing...');
		await page.goto(url, { waitUntil: "domcontentloaded" })
		
		await page.waitForNetworkIdle() // page wait for page to be ready

		console.log('executing...');
		await page.type('[name=ckwebsite]', each_media_link) // typing on search box on site

		
		await page.evaluate(() => {
			document.getElementById('bigbutton').click() // search button click
		})
		
		console.log('searching...');
		await page.waitForSelector('#tblresult') // wait for the result to be shown
		let data = await page.evaluate(() => {
			// getting the monthly reach tr node as html string
			// (deapt nodes are not accessible)
			const output = document.querySelector('#tblresult > tbody > tr:nth-child(2)').innerHTML
			
			return output
		})
		
		console.log(data);
		// checks if any range value found
		// ex: 60 - 700 visitors
		// trims the highest reach value
		if(data.includes('-')){
			data = data.trim().split('\n')[1].trim().split('-')[1].trim().split(' ')[0]
		} else {
			// trims the tr value from td
			data = data.trim().split('\n')[1].trim().split(' ')[0].split('>')[1]
		}

		// removes the numeric comma value for converting string to integer later
		if(data.includes(',')){
			data = data.split(',').join('')
		}

		// if the td table is empty, then data will be 0
		if(isNaN(data)){
			data = 0
		}

		console.log('output=', data);
		
		// returning the reach value into integer
		const daily_reach = Math.round(parseInt(data) / 30)
		console.log('Daily Reach=', daily_reach);

		await browser.close()
		return daily_reach
		
	} catch (error) {
		console.log(error);
		return 'API Error!'
	}
}

/**
 * find the reach value endpoint
 * 
 * @param {media json urls} medias 
 * @returns {json array result}
 */


// JSON Format for api call
// {
// 	media_urls: [
// 		{
// 			media_name: 'Prothom Alo',
// 			media_link: 'http://prothomalo.com'
// 		}
// 	]
// }

async function fetchReach(req, res, next){
	next()

	const medias = req.body.media_urls

	const starting_time = new Date()

	// output format
	const result_obj = {
		result: [],
		unsolved: [],
		total_media: 0,
		total_solved: 0,
		total_unsolved: 0,
		started_at: '',
		updated_at: ''
	}

	// calling the fucntion to execute the reach value
	for(let i = 0; i < medias.length; i++) {
		const reach = await getMonthlyReach(sl = i+1, each_media_link = medias[i].media_link)

		// if any td is blank the reach will be 0 and pushed as unsolved
		if(reach === 0){
			result_obj.unsolved.push({
				media_name: medias[i].media_name,
				media_link: medias[i].media_link,
				reach: reach
			})
		} else {
			// otherwise the reach will be pushed as result
			result_obj.result.push({
				media_name: medias[i].media_name,
				media_link: medias[i].media_link,
				reach: reach
			})
		}

		fs.writeFile('./output/fetched_reach.json', JSON.stringify(result_obj, null, 2), (err) => {
			if(err) console.log(err);
		})
	}

	// for updating unsolved array
	let new_result_array = result_obj.unsolved
	
	// second attempt to get unsolved reach
	if(result_obj.unsolved.length > 0){
		for(let i = 0; i < result_obj.unsolved.length; i++) {
			const reach = await getMonthlyReach(sl = i+1, each_media_link = result_obj.unsolved[i].media_link)
			
			// if reach found then pushes into the result output
			if(reach !== 0){
				result_obj.result.push({
					media_name: result_obj.unsolved[i].media_name,
					media_link: result_obj.unsolved[i].media_link,
					reach: reach
				})

				// removing the found reach from unsolved array 
				new_result_array = new_result_array.filter((each) => each.media_name !== result_obj.unsolved[i].media_name)
			}
		}
	}
	// updating the unsolved array
	result_obj.unsolved = new_result_array

	//saving the locally unsolved result
	fs.writeFile('./output/unsolve_reach.json', JSON.stringify(result_obj.unsolved, null, 2), (err) => {
		if(err) console.log(err);
	})

	result_obj.total_media = medias.length // total number of media links
	result_obj.total_solved = result_obj.result.length // total number of reaches from media links
	result_obj.total_unsolved = result_obj.unsolved.length // total number of unresolved media links
	
	// fetching date
	const end_time = new Date()
	result_obj.started_at = starting_time.toLocaleString() // started_at datetime string
	result_obj.updated_at = end_time.toLocaleString() // updated_at datetime string

	console.log(result_obj);

	fs.writeFile('./output/result.json', JSON.stringify(result_obj, null, 2), (err) => {
		if(err) console.log(err);
	})

	console.log('✅ Search Completed !');

	return result_obj;
}

const fetchReachFromOutput = () => {
	const outputFile = path.join(__dirname, "output", "result.json")
	
	const exists = fs.existsSync(outputFile)

	if (exists) {
		try {
			const data = fs.readFileSync(outputFile)

			if (data) {
				const output = JSON.parse(data)
				// console.log('✅', output);

				return { output, flag: "SUCCESS", message: "Fetch Completed" }
			} else {
				console.log('📌 Something went wrong while parsing');
				return { message: "Something went wrong while parsing", flag: "FAIL" }
			}
		} catch (error) {
			console.log("📌 Error while file reading");
			return { message: "Something went wrong while file reading", flag: "FAIL" }
		}
	} else {
		console.log('📌 File Not Found');
		return { message: "File Not Found", flag: "FAIL" }
	}
}

const validateReqJSON = (req, res, next) => {
    const { media_urls } = req.body;

    const errors = ["", null, undefined]

    // checking for 'media_urls' key in api call
    if (!errors.includes(media_urls)) {
        // checking for blank values
        const media_names = media_urls.filter(
            (media) => media.media_name === ""
        );
        const media_links = media_urls.filter(
            (media) => media.media_link === ""
        );

        // blank will give an error message
        if (media_names.length === 0 && media_links.length === 0) {
            next();
        } else {
            console.log("📌 Invalid JSON! Check 'media_name' or 'media_link'!");
            return res
                .status(400)
                .json({
                    message:
                        "Invalid JSON! Check 'media_name' or 'media_link'!",
                });
        }
    } else {
        console.log("📌 Invalid JSON! No 'media_urls' key found!");
        return res
            .status(400)
            .json({ message: "Invalid JSON! No 'media_urls' key found!" });
    }
};

module.exports = { fetchReach, fetchReachFromOutput, validateReqJSON }