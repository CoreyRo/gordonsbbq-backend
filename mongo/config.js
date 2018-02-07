const fs = require('fs');
const path = require('path')
const mongoose = require('mongoose')

mongoose.Promise = global.Promise


const getMongoDB = function(cb){
		fs.readFile(path.join(__dirname, "../tmp/mongo"), 'utf8', (err, readData) =>{
			if (!readData){
				console.log("data err", err)
			}
			else{
				console.log('read', readData);
				if 	(process.env.NODE_ENV === "production") {
					mongoose.connect(
						readData.toString()
					);
				}
				else{
					mongoose.connect(
						readData.toString()
					);
				}
				return cb(readData)
			}
		})	
	}


module.exports = getMongoDB
