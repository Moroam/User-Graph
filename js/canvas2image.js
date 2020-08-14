/**
 * save canvas to image file
 */

var Canvas2Image = function () {

	function scaleCanvas (canvas, width, height) {
		var w = canvas.width,
			h = canvas.height;
		if (width == undefined) {
			width = w;
		}
		if (height == undefined) {
			height = h;
		}

		var retCanvas = document.createElement('canvas');
		var retCtx = retCanvas.getContext('2d');
		retCanvas.width = width;
		retCanvas.height = height;
		retCtx.drawImage(canvas, 0, 0, w, h, 0, 0, width, height);
		return retCanvas;
	}


    // Function to download data to a file
    function download(data, filename, type) {
        var file = new Blob([data], {type: type});
        if (window.navigator.msSaveOrOpenBlob) // IE10+
            window.navigator.msSaveOrOpenBlob(file, filename);
        else { // Others
            var a = document.createElement("a"),
            url = URL.createObjectURL(file);
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            setTimeout(function() {
              document.body.removeChild(a);
              window.URL.revokeObjectURL(url);  
            }, 0); 
        }
    }

	var saveAsImage = function (canvas, width, height, name, type) {
		canvas = scaleCanvas(canvas, width, height);
		canvas.toBlob(function(blob) {
		    download(blob, name, type);
	    });
	};

	var saveAsImageP = function (canvas, proc, name, type) {
		var width = canvas.width * proc / 100,
			height = canvas.height * proc / 100;
		canvas = scaleCanvasProc(canvas, width, height);
		canvas.toBlob(function(blob) {
		    download(blob, name, type);
	    });
	};

	var saveImage = function (canvas, name, type) {
		canvas.toBlob(function(blob) {
		    download(blob, name, type);
	    });
	};


	return {
		saveAsImage: saveAsImage,
		saveAsImageP: saveAsImageP,
		saveImage: saveImage,
		saveAsPNG: function (canvas, width, height, name) {
			return saveAsImage(canvas, width, height, name, 'png');
		},
		saveAsJPEG: function (canvas, width, height, name) {
			return saveAsImage(canvas, width, height, name, 'jpeg');
		},
		saveAsGIF: function (canvas, width, height, name) {
			return saveAsImage(canvas, width, height, name, 'gif');
		},
		saveAsBMP: function (canvas, width, height, name) {
			return saveAsImage(canvas, width, height, name, 'bmp');
		}
	};

}();
