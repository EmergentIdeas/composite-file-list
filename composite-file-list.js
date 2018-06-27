const fs = require('fs')
const pathTools = require('path')
const filog = require('filter-log')
const commingle = require('commingle')
const Sink = require('file-sink')


class Composite {
	constructor(paths /* an array */) {
		this.paths = paths
		this.log = filog('composite-file-list')
	}
	
	getFullFileInfo(path, callback) {
		
		let p = new Promise((resolve, reject) => {
			let sinks = []
			try {
				for(let path of this.paths) {
					if(typeof path == 'string') {
						sinks.push(new Sink(path))
					}
					else if(path instanceof Sink) {
						sinks.push(path)
					}
				}
			}
			catch(e) {
				reject(e)
			}
			
			let finders = []
			let one = []

			for(let sink of sinks) {
				finders.push((one, two, next) => {
					sink.getFullFileInfo(path).then((data) => {
						if(data) {
							one.push(data)
						}
						next()
					})
					.catch((err) => {
						console.log(err)
						next()
					})
				})
			}
			
			commingle([finders])(one, {}, () => {
				
				let children = {}
				let firstDirectory
				for(let item of one) {
					if(item.directory) {
						if(!firstDirectory) {
							firstDirectory = item
						}
						for(let child of item.children) {
							children[child.name] = child
						}
					}
				}
				
				if(firstDirectory) {
					firstDirectory.children = Object.values(children)
					return resolve(firstDirectory)
				}
				
				return resolve(one[0])
			})
		})
		
		return p
	}
}

module.exports = Composite