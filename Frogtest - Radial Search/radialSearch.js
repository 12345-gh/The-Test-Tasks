/*global console, setTimeout, clearTimeout*/
/*
Params example
{
    start: {
        ring: 1,
        sector: 5
    },
    finish: {
        ring: 6,
        sector: 10
    },
    trees: [
        {
            ring: 6,
            sector: 10
        }
    ]
}


*/

function RadialBreadthFirstToadSearch(params) {
    this.GREY = 'rgba(204, 204, 204, 0.6)';
    this.BLACK = 'rgba(100, 100, 100, 0.6)';
    this.startNode = params.start;
    this.finishNode = params.finish;
    this.trees = params.trees || [];
    this.stack = [];
    this.queue = [];
    this.nodesMap = {};
}

RadialBreadthFirstToadSearch.prototype.matches = function(node) {
    return this.equal(node, this.finishNode);
};

RadialBreadthFirstToadSearch.prototype.equal = function(firstNode, secondNode) {
    return (firstNode.ring === secondNode.ring) && (firstNode.sector === secondNode.sector);
};

RadialBreadthFirstToadSearch.prototype.isValidNode = function(node) {
    return this.isInBorders(node) && !this.isTree(node);
};

RadialBreadthFirstToadSearch.prototype.isTree = function(node) {
    for(var i = 0; i < this.trees.length; i++) {
        if (this.equal(node, this.trees[i])) {
            return true;
        }
    }
    return false;
};

RadialBreadthFirstToadSearch.prototype.isInBorders = function(node) {
    return node.ring > 0 && node.ring < 11 && node.sector > 0 && node.sector < 17;
};

RadialBreadthFirstToadSearch.prototype.getNextNodes = function(node) {
    var nextNodes = [];
    var notValidatedNodes = this.getNotValidatedNextNodes(node);
    for(var i = 0; i < notValidatedNodes.length; i++) {
        var nodeToCheck = notValidatedNodes[i];
        if (this.isValidNode(nodeToCheck)) {
            nextNodes.push(this.prepareNode(nodeToCheck));
        }
    }
    return nextNodes;
};


RadialBreadthFirstToadSearch.prototype.getNotValidatedNextNodes = function(node) {
    return [
        this.getStrightJumpNode(node),
        this.getStrightFromCenterJumpNode(node),
        this.getStrightToCenterJumpNode(node),
        this.getFromCenterJumpNode(node),
        this.getToCenterJumpNode(node)

    ];
};

RadialBreadthFirstToadSearch.prototype.prepareNode = function(node) {
    var cachedNode = this.getNodeFromCache(node.ring, node.sector);
    if(cachedNode) {
        return cachedNode;
    }
    this.putNodeToCache(node);
    return node;
};

RadialBreadthFirstToadSearch.prototype.createNode = function(parent, ring, sector) {
    return {
        ring: ring,
        sector: sector > 16 ? sector - 16 : sector
    };
};

RadialBreadthFirstToadSearch.prototype.getNodeFromCache = function(ring, sector) {
    var sectors = this.nodesMap[ring];
    if (sectors) {
        return sectors[sector];
    }
    return null;
};

RadialBreadthFirstToadSearch.prototype.putNodeToCache = function(node) {
    var sectors = this.nodesMap[node.ring];
    if (sectors) {
        sectors[node.sector] = node;
    } else {
        this.nodesMap[node.ring] = {};
        this.nodesMap[node.ring][node.sector] = node;
    }
};


RadialBreadthFirstToadSearch.prototype.getStrightJumpNode = function(node) {
    return this.createNode(node, node.ring, node.sector + 3);
};

RadialBreadthFirstToadSearch.prototype.getStrightToCenterJumpNode = function(node) {
    return this.createNode(node, node.ring - 1, node.sector + 2);
};

RadialBreadthFirstToadSearch.prototype.getStrightFromCenterJumpNode = function(node) {
    return this.createNode(node, node.ring + 1, node.sector + 2);
};

RadialBreadthFirstToadSearch.prototype.getToCenterJumpNode = function(node) {
    return this.createNode(node, node.ring - 2, node.sector + 1);
};

RadialBreadthFirstToadSearch.prototype.getFromCenterJumpNode = function(node) {
    return this.createNode(node, node.ring + 2, node.sector + 1);
};

RadialBreadthFirstToadSearch.prototype.isFound = function(node) {
    if (node === null) {
        return false;
    }

    if (!node.visited) {
        node.visited = true;
        this.stack.push(node);
    }

    return this.matches(node);
};

RadialBreadthFirstToadSearch.prototype.search_ = function() {
    var root = this.startNode;

    if (this.isFound(root)) {
        this.success = true;
        this.successNode = root;
        return true;
    }

    while (this.stack.length !== 0) {
        var node = this.stack.pop();

        var nextNodes = this.getNextNodes(node);
        for(var i = 0; i < nextNodes.length; i++) {
            var nextNode = nextNodes[i];
            if (this.isFound(nextNode)) {
                this.success = true;
                this.successNode = nextNode;
                return true;
            }
        }
    }

    this.success = false;
    return false;
};

RadialBreadthFirstToadSearch.prototype.search = function() {
    var root = this.startNode;
    root.distance = 0;
    root.color = this.GREY;
    root.parent = null;
    this.queue.push(root);

    while (this.queue.length !== 0) {
        var node = this.queue.shift();

        var nextNodes = this.getNextNodes(node);
        for(var i = 0; i < nextNodes.length; i++) {
            var nextNode = nextNodes[i];
            if (!nextNode.color) {
                nextNode.color = this.GREY;
                nextNode.distance = node.distance + 1;
                nextNode.parent = node;
                this.queue.push(nextNode);
            }
            if (this.matches(nextNode)) {
                this.success = true;
                this.successNode = nextNode;
                this.finished();
                return true;
            }
        }
        node.color = this.BLACK;
    }

    this.success = false;
    this.finished();
    return false;
};

RadialBreadthFirstToadSearch.prototype.search_with_interval = function(delay) {
    delay = delay || 500;
    var root = this.startNode;
    root.distance = 0;
    root.color = this.GREY;
    root.parent = null;
    this.queue.push(root);
    this.stepPrinter(root);

    this.nextStepTimeout = setTimeout(this.search_step.bind(this, delay), delay);
};

RadialBreadthFirstToadSearch.prototype.cancelSearchWithInterval = function() {
    clearTimeout(this.nextStepTimeout);
};



RadialBreadthFirstToadSearch.prototype.search_step = function(delay) {
    if (this.queue.length !== 0) {
        var node = this.queue.shift();

        var nextNodes = this.getNextNodes(node);
        for(var i = 0; i < nextNodes.length; i++) {
            var nextNode = nextNodes[i];
            if (!nextNode.color) {
                nextNode.color = this.GREY;
                nextNode.distance = node.distance + 1;
                nextNode.parent = node;
                this.stepPrinter(nextNode);
                this.queue.push(nextNode);
            }
            if (this.matches(nextNode)) {
                this.success = true;
                this.successNode = nextNode;
                this.finished();
                return true;
            }
        }
        node.color = this.BLACK;
        this.stepPrinter(node);
        this.nextStepTimeout = setTimeout(this.search_step.bind(this, delay), delay);
    } else {
        this.finished();
        this.success = false;
        return false;
    }
};

RadialBreadthFirstToadSearch.prototype.stepPrinter = function() {};
RadialBreadthFirstToadSearch.prototype.finished = function() {};

RadialBreadthFirstToadSearch.prototype.getPath_ = function() {
    var path = [];
    var node = this.successNode;
    
    while(node.parents && node.parents.length > 0) {
        path.unshift([node.ring, node.sector]);
        if(node.parents.length > 1) {
            console.log(node.parents.length);
        }
        node = node.parents[0];
    }
    
    if (this.success) {
        path.unshift([this.startNode.ring, this.startNode.sector]);
    }
    return path;
};

RadialBreadthFirstToadSearch.prototype.getPath = function() {
    var path = [];
    var node = this.successNode;

    while(node && node.parent) {
        path.unshift([node.ring, node.sector]);
        node = node.parent;
    }
    
    if (this.success) {
        path.unshift([this.startNode.ring, this.startNode.sector]);
    }
    return path;
};






