/*global RadialDepthFirstToadSearch, DataPrinter, document, alert*/
/*Demo*/
//var inputData = {
//    start: {
//        ring: 7,
//        segment: 11
//    },
//    finish: {
//        ring: 10,
//        segment: 9
//    },
//    trees: [
//        {
//            ring: 9,
//            segment: 14
//        },
//        {
//            ring: 8,
//            segment: 5
//        }
//    ]
//};
//
//var dataPrinter = new DataPrinter({
//    radius: 400
//});
//dataPrinter.drawGrid();
//dataPrinter.drawInputData(inputData);
//
var getInt = function(elementId)  {
    var value = +document.getElementById(elementId).value;
    return getIntAndCheck(value, 'Element with id ' + elementId);
};

var getIntAndCheck = function(value, errorText) {
    if(Number.isInteger(value)) {
        return value;
    }
    
    alert(errorText + ' must contain an integer number');
    throw new Error();
};

var parseData = function() {
    var data = {
        start: {
            ring: getInt('startRing'),
            segment: getInt('startSector')
        },
        finish: {
            ring: getInt('finishRing'),
            segment: getInt('finishSector')
        }
    };
    data.trees = parseTreeData();
    return data;
};

var parseTreeData = function() {
    var data = [];
    var lines = document.getElementById('trees').value.split('\n');
    for(var i = 0; i < lines.length; i ++) {
        var line = lines[i].trim();
        if (line.length > 0) {
            var arr = line.split(',');
            data.push({
                ring: getIntAndCheck(+arr[0].trim(), 'trees textarea ring part  for pair ' + line),
                segment: getIntAndCheck(+arr[1].trim(), 'trees textarea section part  for pair ' + line)
            });
        }
    }
    return data;
};

var startBtn = document.getElementById('startSearch');
startBtn.onclick = function() {
    var inputData = parseData();
    var dataPrinter = new DataPrinter({
        radius: 400
    });
    dataPrinter.drawGrid();
    dataPrinter.drawInputData(inputData);
    
    var searcher = new RadialDepthFirstToadSearch(inputData);
    searcher.search();

    var textEl = document.getElementById('searchResult');
    if (!searcher.success) {
        textEl.textContent = 'No Path Found';
    } else {
        var path = searcher.getPath();
        textEl.textContent = 'Path Found: ' + JSON.stringify(path);
        dataPrinter.drawPath(path);
    }
};


//var searcher = new RadialDepthFirstToadSearch(inputData);
//searcher.search();
//
//var textEl = document.getElementById('searchResult');
//if (!searcher.success) {
//    textEl.textContent = 'No Path Found';
//} else {
//    var path = searcher.getPath();
//    textEl.textContent = 'Path Found: ' + JSON.stringify(path);
//    dataPrinter.drawPath(path);
//}