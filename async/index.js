/**
 * @author: dengwenfeng
 * @since: 2015-06-16
 */


/**
 * sequence
 */

function setSequenceProcess (funcs, lastCb){
	return function(err, data){
		funcs[0](funcs.length == 1 ? lastCb : setSequenceProcess(funcs.slice(1), lastCb), data)
	}
}

function sequence(funcs){
	return function(cb){
		funcs[0](setSequenceProcess(funcs.slice(1), cb))
	}
}

/*
function _sequenceResultDemo(funcs){
	return function(cb){
		funcs[0](function(err, data){
			funcs[1](function(err, data){
				funcs[2](cb, data)
			}, data)
		})
	}
}
*/

/**
 * parallel
 */
 
 function parallel(funcs){
	var funcsCount = funcs.length, completeCount = 0, dataArr = new Array(funcsCount)
	
	return function(cb){
		funcs.forEach(function(func, index){
			func(function(err, data){
				completeCount ++
				dataArr[index] = data
				if(funcsCount == completeCount){
					cb(null, dataArr)
				}
			})
		})
	}
 }

 /**
 * race
 */
 
 function race(funcs){
	var called = false
	return function(cb){
		funcs.forEach(function(func){
			func(function(err, data){
				if(!called){
					called = true
					cb(null, data)
				}
			})
		})
	}
 }
 
module.exports = {
	sequence: sequence,
	parallel: parallel,
	race: race
}