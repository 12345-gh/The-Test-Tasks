/*global RadialBreadthFirstToadSearch, DataPrinter, document, alert*/
/*Demo*/
//var inputData = {
//    start: {
//        ring: 7,
//        sector: 11
//    },
//    finish: {
//        ring: 10,
//        sector: 9
//    },
//    trees: [
//        {
//            ring: 9,
//            sector: 14
//        },
//        {
//            ring: 8,
//            sector: 5
//        }
//    ]
//};
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

var getBool = function(elementId)  {
    return !!document.getElementById(elementId).checked;
};

var parseView = function() {
    var data = {
        start: {
            ring: getInt('startRing'),
            sector: getInt('startSector')
        },
        finish: {
            ring: getInt('finishRing'),
            sector: getInt('finishSector')
        },
        stepDelay: getInt('stepDelay'),
        visualizeSearch: getBool('visualizeSearch')
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
                sector: getIntAndCheck(+arr[1].trim(), 'trees textarea section part  for pair ' + line)
            });
        }
    }
    return data;
};

var dataPrinter = new DataPrinter({
    radius: 400,
    tooltipEl: document.getElementById('canvasToolTip')
});

var startBtn = document.getElementById('startSearch');
startBtn.onclick = function() {
    var model = parseView();

    dataPrinter.drawGrid();
    dataPrinter.drawInputData(model);
    
    var searcher = new RadialBreadthFirstToadSearch(model);
    searcher.stepPrinter = function(node) {
        dataPrinter.colorSegment(node.ring, node.sector, node.color);
    };
    searcher.finished = function() {
        var textEl = document.getElementById('searchResult');
        if (!searcher.success) {
            textEl.textContent = 'No Path Found';
        } else {
            var path = searcher.getPath();
            textEl.textContent = 'Path Found: ' + JSON.stringify(path);
            dataPrinter.drawPath(path);
        }
        
    };
    if(model.visualizeSearch) {
        searcher.search_with_interval(model.stepDelay);
    } else {
        searcher.search();
    }

};

var printFirstResults = function() {
    startBtn.click();
};
if (document.readyState === 'complete') {
    printFirstResults();
} else {
    document.addEventListener( 'DOMContentLoaded', printFirstResults, false );
}


