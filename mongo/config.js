const fs = require('fs')
const path = require('path')
const mongoose = require('mongoose')

mongoose.Promise = global.Promise

const getMongoDB = function(res,cb){
	fs.readFile(path.join(__dirname, "../tmp/mongotmp.txt"), 'utf8', (err, readData) =>{
		if (!readData){
			console.log("FILESYSTEM READ ERROR: ", err)
			return res.render('config', { 
				title: 'Node fs error', 
				errors: [{
					msg: `Node filesystem Error No. ${err.errno}, Error code: ${err.code}`
				}] 
			})
		}
		else{
			console.log('FILESYSTEM READ SUCCESS!')

			//read tempfile and split to an array then use the values to configure the connection
			let mongoConfigData = readData.split(',')

			//if using Auth URI, uses this
			if(mongoConfigData.length === 1){
				if 	(process.env.NODE_ENV === "production") {
					mongoose.connect(mongoConfigData[0].toString().trim(), {
						user: mongoConfigData[1].toString().trim(),
						pass: mongoConfigData[2].toString()
					})
				}
				else{
					// local URI 
					"mongodb://127.0.0.1/gordons-bbq"
				}
			}

			//if using user/pass auth, uses this
			else if(mongoConfigData.length === 3){
				if 	(process.env.NODE_ENV === "production") {
					mongoose.connect(
						mongoConfigData[0].toString().trim()
					)
				}
				else{
					// 	"mongodb://127.0.0.1/gordons-bbq"
				}
			}
			else{
				//error handling for corrupted entries
				return res.render('config', {
					title: 'Data Error!',
					errors: [{
						msg: 'Oops! Something went wrong with the data you entered. Please refresh the page and try again.'
					}]
				})
			}
			//callback to finish the function
			return cb(readData.split(','))
		}
	})	
}

module.exports = getMongoDB
