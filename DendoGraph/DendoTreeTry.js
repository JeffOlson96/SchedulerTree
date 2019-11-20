


treeJSON = d3.json("CS_DepartmentView_2187_JSON.json", function(error, treeData) {
    var headers = [];
    var dataDumb = [];
    
    var fullData = [];
    
	Object.keys(treeData).forEach( function(value, index) {
        var objtry = {
            name: "",
            data: null
        };
        //console.log("name: ", value);
        objtry.name = value;
        treeData[value].slice(0).forEach((obj) => {
            //console.log('data: ', obj);
            dataDumb.push(obj);
        });
        //console.log('data: ', dataDumb);
        objtry.data = dataDumb;
        fullData.push(objtry);
        dataDumb = [];
        
	});
    
    
    var length = Object.keys(treeData).length;
    //console.log(Object.keys(treeData).length);

    fullData.forEach((value) => {
        console.log(value);
    })
    
    
    

	var duration = 750;
    var totalNodes;

	var root;
	var viewerWidth = $(document).width();
    var viewerHeight = $(document).height();

    var tree = d3.layout.tree()
        .size([viewerHeight, viewerWidth]);

    var diagonal = d3.svg.diagonal()
        .projection(function(d) {
            return [d.y, d.x];
        });

    function zoom() {
        svgGroup.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    }
    /*
    function visit(parent, visitFn, childrenFn) {
        if (!parent) return;

        visitFn(parent);

        var children = childrenFn(parent);
        if (children) {
            var count = children.length;
            for (var i = 0; i < count; i++) {
                visit(children[i], visitFn, childrenFn);
            }
        }
    }

    // Call visit function to establish maxLabelLength
    visit(treeData, function(d, i) {
        totalNodes++;
        //console.log(Object.keys(d));

        //maxLabelLength = Math.max(Object.keys(d).length, maxLabelLength);
        console.log(d);
        //maxLabelLength = Math.max(d.name.length, maxLabelLength);

    }, function(d) {
        return null;
        //return d.children && d.children.length > 0 ? d.children : null;
    });

    */
    // define the zoomListener which calls the zoom function on the "zoom" event constrained within the scaleExtents
    var zoomListener = d3.behavior.zoom().scaleExtent([0.1, 3]).on("zoom", zoom);

    var baseSvg = d3.select("#tree-container").append("svg")
        .attr("width", viewerWidth)
        .attr("height", viewerHeight)
        .attr("class", "overlay");

    var svgGroup = baseSvg.append("g");
    function centerNode(source) {
        scale = zoomListener.scale();
        x = -source.y0;
        y = -source.x0;
        x = x * scale + viewerWidth / 2;
        y = y * scale + viewerHeight / 2;
        d3.select('g').transition()
            .duration(duration)
            .attr("transform", "translate(" + x + "," + y + ")scale(" + scale + ")");
        zoomListener.scale(scale);
        zoomListener.translate([x, y]);
    }

    // Define the root
    root = treeData;
    root.x0 = viewerHeight / 2;
    root.y0 = 0;

    centerNode(root);
});