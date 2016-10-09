/*global console*/
/*
Params example
{
    start: {
        ring: 1,
        segment: 5
    },
    finish: {
        ring: 6,
        segment: 10
    },
    trees: [
        {
            ring: 6,
            segment: 10
        }
    ]
}


*/

function RadialDepthFirstToadSearch(params) {
    this.startNode = params.start;
    this.finishNode = params.finish;
    this.trees = params.trees || [];
    this.stack = [];
    this.nodesMap = {};
}

RadialDepthFirstToadSearch.prototype.matches = function(node) {
    return this.equal(node, this.finishNode);
};

RadialDepthFirstToadSearch.prototype.equal = function(firstNode, secondNode) {
    return (firstNode.ring === secondNode.ring) && (firstNode.segment === secondNode.segment);
};

RadialDepthFirstToadSearch.prototype.isValidNode = function(node) {
    return this.isInBorders(node) && !this.isTree(node);
};

RadialDepthFirstToadSearch.prototype.isTree = function(node) {
    for(var i = 0; i < this.trees.length; i++) {
        if (this.equal(node, this.trees[i])) {
            return true;
        }
    }
    return false;
};

RadialDepthFirstToadSearch.prototype.isInBorders = function(node) {
    return node.ring > 0 && node.ring < 11 && node.segment > 0 && node.segment < 17;
};

RadialDepthFirstToadSearch.prototype.getNextNodes = function(node) {
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


RadialDepthFirstToadSearch.prototype.getNotValidatedNextNodes = function(node) {
    return [
        this.getStrightJumpNode(node),
        this.getStrightToCenterJumpNode(node),
        this.getStrightFromCenterJumpNode(node),
        this.getToCenterJumpNode(node),
        this.getFromCenterJumpNode(node),
    ];
};

RadialDepthFirstToadSearch.prototype.prepareNode = function(node) {
    var cachedNode = this.getNodeFromCache(node.ring, node.segment);
    if(cachedNode) {
        if (!cachedNode.parents) {
            cachedNode.parents = [];
        }
        if(!cachedNode.parents.indexOf(node.parents[0])) {
            cachedNode.parents.push(node.parents[0]);
        }
        return cachedNode;
    }
    this.putNodeToCache(node);
    return node;
};

RadialDepthFirstToadSearch.prototype.createNode = function(parent, ring, segment) {
    return {
        ring: ring,
        segment: segment > 16 ? segment - 16 : segment,
        parents: [parent]
    };
};

RadialDepthFirstToadSearch.prototype.getNodeFromCache = function(ring, segment) {
    var segments = this.nodesMap[ring];
    if (segments) {
        return segments[segment];
    }
    return null;
};

RadialDepthFirstToadSearch.prototype.putNodeToCache = function(node) {
    var segments = this.nodesMap[node.ring];
    if (segments) {
        segments[node.segment] = node;
    } else {
        this.nodesMap[node.ring] = {};
        this.nodesMap[node.ring][node.segment] = node;
    }
};


RadialDepthFirstToadSearch.prototype.getStrightJumpNode = function(node) {
    return this.createNode(node, node.ring, node.segment + 3);
};

RadialDepthFirstToadSearch.prototype.getStrightToCenterJumpNode = function(node) {
    return this.createNode(node, node.ring - 1, node.segment + 2);
};

RadialDepthFirstToadSearch.prototype.getStrightFromCenterJumpNode = function(node) {
    return this.createNode(node, node.ring + 1, node.segment + 2);
};

RadialDepthFirstToadSearch.prototype.getToCenterJumpNode = function(node) {
    return this.createNode(node, node.ring - 2, node.segment + 1);
};

RadialDepthFirstToadSearch.prototype.getFromCenterJumpNode = function(node) {
    return this.createNode(node, node.ring + 2, node.segment + 1);
};

RadialDepthFirstToadSearch.prototype.isFound = function(node) {
    if (node === null) {
        return false;
    }

    if (!node.visited) {
        node.visited = true;
        this.stack.push(node);
    }

    return this.matches(node);
};

RadialDepthFirstToadSearch.prototype.search = function() {
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

RadialDepthFirstToadSearch.prototype.getPath = function() {
    var path = [];
    var node = this.successNode;
    
    while(node.parents && node.parents.length > 0) {
        path.unshift([node.ring, node.segment]);
        if(node.parents.length > 1) {
            console.log(node.parents.length);
        }
        node = node.parents[0];
    }
    
    if (this.success) {
        path.unshift([this.startNode.ring, this.startNode.segment]);
    }
    return path;
};








