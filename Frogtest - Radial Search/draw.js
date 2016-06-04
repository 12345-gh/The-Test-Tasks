/*global document*/
function DataPrinter(params) {
    params = params || {};
    var maxRadius = params.radius || 200;
    var ringCount = params.ringCount || 10;
    var ringWidth = maxRadius / ringCount;
    var fontSize = ringWidth / 2;
    var sectorCount = params.sectorCount || 16;
    var sectorAngle = Math.PI*2/sectorCount;

    var isReadyToDraw = false;
    var canvas = document.getElementById('canvas');
    var ctx = null;
    if (canvas && canvas.getContext) {
        ctx = canvas.getContext('2d');
        isReadyToDraw = true;
    }

    var centerX = Math.floor(canvas.width / 2);
    var centerY = Math.floor(canvas.height / 2);

    this.drawGrid = function() {
        if (isReadyToDraw){
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.beginPath();
            for(var j = 0; j < ringCount; j ++) {
                ctx.arc(centerX, centerY, j * ringWidth,0, Math.PI*2,true);
            }
            ctx.closePath();
            ctx.stroke();
            for(var i = 0; i <= sectorCount; i++) {
                ctx.beginPath();
                ctx.moveTo(centerX,centerY);
                ctx.arc(centerX,centerY, maxRadius, 0, sectorAngle * i,false);
                ctx.closePath();
                ctx.stroke();
                if (i > 0) {
                    this.drawText(i, ringCount + 1, i, 'black');
                }
            }
        }
    };


    this.drawText = function(text, ring, sector, color) {
        if (isReadyToDraw){
            color = color || 'red';
            ctx.textBaseline = 'middle';
            ctx.textAlign='center';
            ctx.font = fontSize + 'px serif';

            var angle = -Math.PI/ sectorCount + sectorAngle * sector;
            var offset = maxRadius / ringCount * ring - ringWidth / 2;

            var x = centerX + offset * Math.sin(angle);
            var y = centerY - offset * Math.cos(angle);
            ctx.fillStyle = color;
            ctx.fillText('' + text, x, y);
        }
    };
    
    this.drawInputData = function(data) {
        this.drawText('S', data.start.ring, data.start.segment, 'blue');
        this.drawText('F', data.finish.ring, data.finish.segment, 'purple');
        for(var i = 0; i < data.trees.length; i++) {
            var tree = data.trees[i];
            this.drawText('T', tree.ring, tree.segment, 'green');
        }
    };

    this.drawPath = function(path) {
        for(var i = 1; i < path.length - 1; i++) {
            var step = path[i];
            this.drawText('*', step[0], step[1], 'red');
        }
    };
}

