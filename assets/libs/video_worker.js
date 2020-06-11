importScripts('./ffmpeg-worker-all-full.js');

function print(text) {
    postMessage({
        'type' : 'stdout',
        'data' : text
    });
}

function printErr(text) {
    postMessage({
        'type' : 'stderr',
        'data' : text
    });
}

self.addEventListener('message', function(event) {
    var message = event.data;
    if (message.type === "command") {
        postMessage({
            'type' : 'start',
        });
                      
        var Module = {
            print: print,
            printErr: printErr,
            files: message.files || [],
            arguments: message.arguments || []
        };
                      
        postMessage({
            'type' : 'stdout',
            'data' : 'Received command: ' + Module.arguments.join(" ")
        });
        //debugger;
        var time = Date.now();
		Module['returnCallback'] = function(result) {
		  var totalTime = Date.now() - time;
		  postMessage({
			'type' : 'stdout',
			'data' : 'Finished processing (took ' + totalTime + 'ms)'
		  });
		  if ( result.length > 0 ) 
		  {
			postMessage({
			'type' : 'onExit',
			'outputFile' : result[0].data,
			'outFileName' : result[0].name,
			'time' : totalTime
			});
		  }
		  else
		  {
		  	postMessage({
				'type' : 'done',
				'data' : result
			});
		  }
		}
		var result = ffmpeg_run(Module);
    }
}, false);

// ffmpeg loaded
postMessage({
    'type' : 'ready'
});
