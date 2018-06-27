var filog = require('filter-log')
require('mocha')
var expect = require('chai').expect
var assert = require('chai').assert

let Sink = require('file-sink')
let Composite = require('../composite-file-list')

var log1 = filog('standard')
let time = new Date().getTime()
let msg = 'this is a test: ' + time

describe("basic tests", function() {
	
	it("a directory read", function(done) {
		let s = new Sink('./test-data-1')
		let c = new Composite([s, './test-data-2'])
		try {
			let promise = c.getFullFileInfo('')
			promise.then((data) => {
				if(data.children.length == 3) {
					done()
				}
				else {
					done(new Error('the directory did not contain the right number of files'))
				}
			})
			.catch((err) => {
				done(err)
			})
		}
		catch(error) {
			return done(error)
		}
	})
	
	it("a sub-directory read", function(done) {
		let s = new Sink('./test-data-1')
		let c = new Composite([s, './test-data-2'])
		try {
			let promise = c.getFullFileInfo('dir1')
			promise.then((data) => {
				if(data.children.length == 2) {
					done()
				}
				else {
					done(new Error('the directory did not contain the right number of files'))
				}
			})
			.catch((err) => {
				done(err)
			})
		}
		catch(error) {
			return done(error)
		}
	})
	
})