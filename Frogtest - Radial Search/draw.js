/*global document, clearTimeout, setTimeout, window*/
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
        this.drawText('S', data.start.ring, data.start.sector, 'blue');
        this.drawText('F', data.finish.ring, data.finish.sector, 'purple');
        for(var i = 0; i < data.trees.length; i++) {
            var tree = data.trees[i];
            this.drawText('T', tree.ring, tree.sector, 'green');
        }
    };

    this.drawPath = function(path) {
        for(var i = 1; i < path.length - 1; i++) {
            var step = path[i];
            this.drawText('*', step[0], step[1], 'red');
        }
    };
    
    this.colorSegment = function(ring, sector, color) {
        if (isReadyToDraw){
            color = color || 'rgba(204, 204, 204, 0.4)';

            ctx.beginPath();
            ctx.fillStyle = color;

            ctx.arc(centerX,centerY, (ring - 1) * ringWidth, sectorAngle * (sector - 1) -Math.PI/2, sectorAngle * sector - Math.PI/2, false);
            ctx.arc(centerX,centerY, ring * ringWidth, sectorAngle * sector - Math.PI/2, sectorAngle * (sector - 1) -Math.PI/2, true);

            ctx.fill();
        }
    };

    this.startListenMouseMoveOnCanvas = function() {
        this.canvasMouseMoveTimeout = null;
        if (isReadyToDraw && params.tooltipEl) {
            canvas.addEventListener('mousemove', this.handleMouseMoveOnCanvas.bind(this));
        }
    };
    
    this.handleMouseMoveOnCanvas = function(event) {
        event.preventDefault();
        event.stopPropagation();
        clearTimeout(this.canvasMouseMoveTimeout);
        if (Math.abs(event.movementX) > 3 || Math.abs(event.movementY) > 3) {
            params.tooltipEl.style.display = 'none';
        }
        var pointCanvasRelative = getRelativeCoordinates(event, canvas);
        var absoluteX = event.pageX - window.pageXOffset - window.scrollX;
        var absoluteY = event.pageY - window.pageXOffset - window.scrollY;
        this.canvasMouseMoveTimeout = setTimeout(this.showToolTipAt.bind(this, pointCanvasRelative.x, pointCanvasRelative.y, absoluteX, absoluteY), 100);
    };

    this.showToolTipAt = function(canvasX, canvasY, absoluteX, absoluteY) {
        if (isReadyToDraw) {
            var el = params.tooltipEl;
            var segment = this.getSegmentFromCoords(canvasX, canvasY);
            if (segment) {
                el.textContent = 'ring: ' + segment.ring + ' sector: ' + segment.sector;
                el.style.left = absoluteX + 'px';
                el.style.top = absoluteY + 'px';
                el.style.display = 'block';
            } else {
                el.style.display = 'none';
            }
        }
    };
    
    this.getSegmentFromCoords = function(canvasX, canvasY) {
        var x = canvasX - centerX;
        var y = centerY - canvasY;
        var pointRadius = Math.sqrt(x*x + y*y);
        if (pointRadius <= maxRadius && pointRadius !== 0) {
            var pointAngle = Math.acos(y/pointRadius);
            if (x < 0) {
                pointAngle = 2 * Math.PI - pointAngle;
            }

            return {
                ring: Math.ceil(pointRadius / ringWidth),
                sector: Math.ceil(pointAngle / sectorAngle)
            };
        }
    };

    function getRelativeCoordinates(event, referenceElement) {

        var pos = {};
        var offset = {};
        var ref = referenceElement.offsetParent;

        pos.x = !! event.touches ? event.touches[ 0 ].pageX : event.pageX;
        pos.y = !! event.touches ? event.touches[ 0 ].pageY : event.pageY;

        offset.left = referenceElement.offsetLeft;
        offset.top = referenceElement.offsetTop;

        while ( ref ) {
            offset.left += ref.offsetLeft;
            offset.top += ref.offsetTop;

            ref = ref.offsetParent;
        }

        return {
            x : pos.x - offset.left,
            y : pos.y - offset.top
        };
    }

     this.startListenMouseMoveOnCanvas();

}

