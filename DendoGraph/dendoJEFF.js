/*Copyright (c) 2013-2016, Rob Schmuecker
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

* The name Rob Schmuecker may not be used to endorse or promote products
  derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL MICHAEL BOSTOCK BE LIABLE FOR ANY DIRECT,
INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.*/

var addList = [];


function drawTopMenu(svg_to_append_to){

  // d3.select("svg").remove();
    var NavMenu;
    if(svg_to_append_to == "body"){
        NavMenu = d3.select(svg_to_append_to).append("svg")
            .attr('class', 'memu-svg')
            .attr('width', 3000)
            .attr('height', 400);
    }
    else{
        NavMenu = svg_to_append_to.append("svg")
            .attr('class', 'memu-svg')
            .attr('width', 3000)
            .attr('height', 400);
    }


    var rows = 1;
    var columns = 3;
    // create a two dimensional array with "rows" rows and "columns" columns.
    const board = d3.range(rows).map(d => []).map((row, i) => {
        return d3.range(columns).map((col, j) => ({
            row: i,
            column: j,

        }))
    });

    const topMenu = NavMenu
        .selectAll('.topMenu')
        .data(board)
        .enter()
        .append('g')
        .attr('class', 'topMenu')
        .attr('transform', (d, i) => `translate(${100 * i + 10},0 )`);

    const allOptions = topMenu.selectAll('.menu-cell')
        .data(d => d)
        .enter()
        .append('g')
        .attr('class', d => `menu-cell-g-${d.column}`)
        .attr('transform', (d, i) => `translate(${(250 + 10)* i },0 )`);


    function zoom1() {
        allOptions.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    }

    var zoomListener1 = d3.behavior.zoom().scaleExtent([0.1, 3]).on("zoom", zoom1);


    allOptions.append('rect')
        .attr("rx", 6)
        .attr("ry", 6)
        .attr("width", 250)
        .attr("height", 50)
        .style("fill", "steelblue");



    var textElements = allOptions.append("text")
        .attr("y", 30)
        .attr("x", 125)
        .attr('fill','black')
        .style("font", "25px times")
        .text(function(d,i){
            if(i == 0){
                return "Draw Tree View";
            }
            if(i == 1){
                return "Draw Weekly View";
            }
            if(i == 2){
                return "Add a Class";
            }
        });
    textElements.style("text-anchor", "middle");

    // .attr('transform', (d, i) => `translate(${(100 + 50)* i },0 )`);

    allOptions.on("click", function (d) {
        console.log("CLICKED menu", d);
        if(d.column == 0){
            console.log("drawTree");
            drawTree();
        }
        if(d.column == 1){
            console.log("do something 2");
        }
        if(d.column == 2){
            console.log("do something 3");
            addClass(); //populate addList

            drawTree();
        }
    });



}






function getCatName (cat){

    var i = 0;
    var catname = "";
    while(cat[i] != ' '){
        catname = catname + cat[i];
        i++;
    }

    //console.log('catname', catname);
    return catname;
}


function drawTree() {
    d3.select("svg").remove();

// Get JSON data
    treeJSON = d3.json("CS_Courses_2197_Schd_Dept_Stu_Views.json", function (error, treeData) {


        // Calculate total nodes, max label length
        var totalNodes = 0;
        var maxLabelLength = 0;
        // variables for drag/drop
        var selectedNode = null;
        var draggingNode = null;
        // panning variables
        var panSpeed = 200;
        var panBoundary = 20; // Within 20px from edges will pan when dragging.
        // Misc. variables
        var i = 0;
        var duration = 750;
        var root;

        var subHeaders = ['ACT', 'DIS', 'SUP', 'LAB', 'LEC', 'SEM'];
        var dataDumb = [];

        var fullData = [];
        // formatted the same way as flare.json
        var fullObj = {
            name: "",
            children: null
        };
        var headers = [];

        var nameList = [];
        var nameCheck;
        /*
        Object.keys(treeData).forEach(function (value, index) {
            if (index == 0) {
                nameCheck = getCatName(value);
                nameList.push(nameCheck);
                //console.log("catname: ", nameCheck);
            } else {
                if (nameCheck != getCatName(value)) {//new name
                    nameList.push(getCatName(value));
                    nameCheck = getCatName(value);
                }

            }

        });


        Object.keys(treeData).forEach(function (value, index) {


            var objtry = {
                name: "",
                children: null
            };

            objtry.name = value;


            treeData[value].slice(0).forEach((obj) => {//goes through one section
                dataDumb.push(obj);
            });


            //console.log('data: ', dataDumb);
            objtry.children = dataDumb;
            fullData.push(objtry);
            dataDumb = [];

        });


        var length = Object.keys(treeData).length;
        var subData = [];
        var iter = 0;
        var childL = [];


        for (var i = 0; i < fullData.length; i++) {
            var objtry = {
                name: nameList[iter],
                children: null
            };


            var whilecount = 0;

            while (nameList[iter] == getCatName(fullData[i].name)) {
                //console.log("nameList[iter]: ", nameList[iter]);
                //console.log("getCatName(fullData[i].name): ", getCatName(fullData[i].name));
                //console.log("i: ", i);
                childL.push(fullData[i]);
                i++;
                whilecount++;

            }
            //console.log("nameList[iter]: ", nameList[iter]);
            //console.log("getCatName(fullData[i].name): ", getCatName(fullData[i].name));
            iter++;
            objtry.children = childL;
            subData.push(objtry);
            childL = [];

            if (i != fullData.length - 1) {
                i--;
            } else {
                objtry = {
                    name: nameList[iter],
                    children: null
                };

                while (i < fullData.length && nameList[iter] == getCatName(fullData[i].name)) {
                    childL.push(fullData[i]);
                    i++;
                }
                iter++;
                objtry.children = childL;
                subData.push(objtry);
                childL = [];
            }

        }

        console.log("Addlist: ", addList);
        for(var i = 0; i < addList.length; i++){
            subData.push(addList[i]);
            console.log("subData",subData);
        }

        fullObj.children = subData;

        fullObj.children.forEach((value) => {
            //console.log(value);
            if(value.children != null){
                value.children.forEach((obj) => {
                    //console.log(obj);
                    if(obj.children != null){
                        obj.children.forEach((d) => {
                            //console.log(d);
                            d.name = d.course_title;
                            let actName1 = Object.keys(d)[0];
                            let actName2 = Object.keys(d)[1];
                            if (subHeaders.includes(`${actName1}`)) {
                                let classNum = d.combinded_class_number;
                                d.children = Array(d[`${actName1}`]);
                                if (subHeaders.includes(`${actName2}`)) {
                                    //console.log("actname", d[`${actName1}`]);
                                    d.children.push(d[`${actName2}`]);
                                }
                            }
                        });
                    }
                });
            }
        });
        */
        fullObj.name = 'schedulerView';    
        Object.keys(treeData['schedulerView']).forEach((value) => {            
            headers.push(value);
        });
        
        headers.forEach((value) => {
            var objtmp = {
                name: "",
                children: null
            };
            //console.log(treeData['schedulerView'][`${value}`]);
            objtmp.name = value;
            //objtmp.children = treeData['schedulerView'][`${value}`];
            var dataTemp = [];
            
            Object.keys(treeData['schedulerView'][`${value}`]).forEach((keys) => {
                var dataTemp2 = [];
                var objNu = {
                    name: "",
                    children: null
                };
                if (keys != "isMultiComponent") {
                    objNu.name = keys;
                    treeData['schedulerView'][`${value}`][`${keys}`].forEach((obj) => {
                        dataTemp2.push(obj);
                    })
                    //dataTemp2.sort();
                    objNu.children = dataTemp2;
                    dataTemp.push(objNu);
                }

            });
            objtmp.children = dataTemp; 
            dataDumb.push(objtmp);
        });
        dataDumb.sort(function(a,b) {
            var aName = a.name.substring(3,6);
            var bName = b.name.substring(3,6);
            //console.log(aName, " : ", bName);
            if(aName < bName) {
                return -1;
            }
            else if (aName > bName) {
                return 1;
            }
            else {
                return 0;
            }
        });
        fullObj.children = dataDumb;
        //console.log(fullObj);
        var length = Object.keys(treeData).length;
        fullObj.children.forEach((value) => {
            //console.log(value);
            if(value.children != null){
                value.children.forEach((obj) => {
                    //console.log(obj);
                    if(obj.children != null){
                        obj.children.forEach((d) => {
                            //console.log(d.components);                    
                            d.name = d.course_title;
                            if (d.components.length === 1) {
                                let actName1 = d.components[0];
                                d.children = Array(d[`${actName1}`]);
                            }
                            else if (d.components.length === 2) {
                                let actName1 = d.components[0];
                                let actName2 = d.components[1];
                                d.children = Array(d[`${actName1}`]);
                                d.children.push(d[`${actName2}`]);                            
                            }
                        });
                    }
                });
            }
        });
        
        //var str = JSON.stringify(fullObj);
        //console.log("FULL", str);

        // size of the diagram
        var viewerWidth = $(document).width();
        var viewerHeight = $(document).height();

        var tree = d3.layout.tree()
            .size([viewerHeight, viewerWidth]);

        // define a d3 diagonal projection for use by the node paths later on.
        var diagonal = d3.svg.diagonal()
            .projection(function (d) {
                return [d.y, d.x];
            });

        // A recursive helper function for performing some setup by walking through all nodes

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
        visit(fullObj, function(d) {
            totalNodes++;
            //console.log(Object.keys(d));

            //maxLabelLength = Math.max(Object.keys(d).length, maxLabelLength);
            //console.log(d);
            if (d.name) {
                maxLabelLength = Math.max(d.name.length, maxLabelLength);
            }
            else if (d.course_title) {
                //console.log( d);
                maxLabelLength = Math.max(d.course_title.length, maxLabelLength);
            }

            else if (d.instructors) {
                //console.log(d.instructors[0].instructor_lName);
                let fullName = d.instructors[0].instructor_fName + " " + d.instructors[0].instructor_lName;
                maxLabelLength = Math.max(fullName.length, maxLabelLength);
            }


        }, function(d) {
            return d.children && d.children.length > 0 ? d.children : null;
        });


        // sort the tree according to the node names

        function sortTree() {
            tree.sort(function (a, b) {
                return b.name.toLowerCase() < a.name.toLowerCase() ? 1 : -1;
            });
        }

        // Sort the tree initially incase the JSON isn't in a sorted order.
        //sortTree();

        // TODO: Pan function, can be better implemented.

        function pan(domNode, direction) {
            var speed = panSpeed;
            if (panTimer) {
                clearTimeout(panTimer);
                translateCoords = d3.transform(svgGroup.attr("transform"));
                if (direction == 'left' || direction == 'right') {
                    translateX = direction == 'left' ? translateCoords.translate[0] + speed : translateCoords.translate[0] - speed;
                    translateY = translateCoords.translate[1];
                } else if (direction == 'up' || direction == 'down') {
                    translateX = translateCoords.translate[0];
                    translateY = direction == 'up' ? translateCoords.translate[1] + speed : translateCoords.translate[1] - speed;
                }
                scaleX = translateCoords.scale[0];
                scaleY = translateCoords.scale[1];
                scale = zoomListener.scale();
                svgGroup.transition().attr("transform", "translate(" + translateX + "," + translateY + ")scale(" + scale + ")");
                d3.select(domNode).select('g.node').attr("transform", "translate(" + translateX + "," + translateY + ")");
                zoomListener.scale(zoomListener.scale());
                zoomListener.translate([translateX, translateY]);
                panTimer = setTimeout(function () {
                    pan(domNode, speed, direction);
                }, 50);
            }
        }

        // Define the zoom function for the zoomable tree

        function zoom() {
            svgGroup.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
        }


        // define the zoomListener which calls the zoom function on the "zoom" event constrained within the scaleExtents
        var zoomListener = d3.behavior.zoom().scaleExtent([0.1, 3]).on("zoom", zoom);

        function initiateDrag(d, domNode) {
            draggingNode = d;
            d3.select(domNode).select('.ghostCircle').attr('pointer-events', 'none');
            d3.selectAll('.ghostCircle').attr('class', 'ghostCircle show');
            d3.select(domNode).attr('class', 'node activeDrag');

            svgGroup.selectAll("g.node").sort(function (a, b) { // select the parent and sort the path's
                if (a.id != draggingNode.id) return 1; // a is not the hovered element, send "a" to the back
                else return -1; // a is the hovered element, bring "a" to the front
            });
            // if nodes has children, remove the links and nodes
            if (nodes.length > 1) {
                // remove link paths
                links = tree.links(nodes);
                nodePaths = svgGroup.selectAll("path.link")
                    .data(links, function (d) {
                        return d.target.id;
                    }).remove();
                // remove child nodes
                nodesExit = svgGroup.selectAll("g.node")
                    .data(nodes, function (d) {
                        return d.id;
                    }).filter(function (d, i) {
                        if (d.id == draggingNode.id) {
                            return false;
                        }
                        return true;
                    }).remove();
            }

            // remove parent link
            parentLink = tree.links(tree.nodes(draggingNode.parent));
            svgGroup.selectAll('path.link').filter(function (d, i) {
                if (d.target.id == draggingNode.id) {
                    return true;
                }
                return false;
            }).remove();

            dragStarted = null;
        }

        // define the baseSvg, attaching a class for styling and the zoomListener
        var baseSvg = d3.select("#tree-container").append("svg")
            .attr("width", viewerWidth)
            .attr("height", viewerHeight)
            .attr("class", "overlay")
            .call(zoomListener);


        // Define the drag listeners for drag/drop behaviour of nodes.
        dragListener = d3.behavior.drag()
            .on("dragstart", function (d) {
                if (d == root) {
                    return;
                }
                dragStarted = true;
                nodes = tree.nodes(d);
                d3.event.sourceEvent.stopPropagation();
                // it's important that we suppress the mouseover event on the node being dragged. Otherwise it will absorb the mouseover event and the underlying node will not detect it d3.select(this).attr('pointer-events', 'none');
            })
            .on("drag", function (d) {
                if (d == root) {
                    return;
                }
                if (dragStarted) {
                    domNode = this;
                    initiateDrag(d, domNode);
                }

                // get coords of mouseEvent relative to svg container to allow for panning
                relCoords = d3.mouse($('svg').get(0));
                if (relCoords[0] < panBoundary) {
                    panTimer = true;
                    pan(this, 'left');
                } else if (relCoords[0] > ($('svg').width() - panBoundary)) {

                    panTimer = true;
                    pan(this, 'right');
                } else if (relCoords[1] < panBoundary) {
                    panTimer = true;
                    pan(this, 'up');
                } else if (relCoords[1] > ($('svg').height() - panBoundary)) {
                    panTimer = true;
                    pan(this, 'down');
                } else {
                    try {
                        clearTimeout(panTimer);
                    } catch (e) {

                    }
                }
                // this is how node is dragged, using d3.event.dy
                d.x0 += d3.event.dy;
                d.y0 += d3.event.dx;
                var node = d3.select(this);
                node.attr("transform", "translate(" + d.y0 + "," + d.x0 + ")");
                updateTempConnector();
            }).on("dragend", function (d) {
                if (d == root) {
                    return;
                }
                domNode = this;
                if (selectedNode) {
                    // now remove the element from the parent, and insert it into the new elements children
                    var index = draggingNode.parent.children.indexOf(draggingNode);
                    if (index > -1) {
                        draggingNode.parent.children.splice(index, 1);
                    }
                    if (typeof selectedNode.children !== 'undefined' || typeof selectedNode._children !== 'undefined') {
                        if (typeof selectedNode.children !== 'undefined') {
                            selectedNode.children.push(draggingNode);
                        } else {
                            selectedNode._children.push(draggingNode);
                        }
                    } else {
                        selectedNode.children = [];
                        selectedNode.children.push(draggingNode);
                    }
                    // Make sure that the node being added to is expanded so user can see added node is correctly moved
                    expand(selectedNode);
                    //sortTree();
                    endDrag();
                } else {
                    endDrag();
                }
            });

        function endDrag() {
            selectedNode = null;
            d3.selectAll('.ghostCircle').attr('class', 'ghostCircle');
            d3.select(domNode).attr('class', 'node');
            // now restore the mouseover event or we won't be able to drag a 2nd time
            d3.select(domNode).select('.ghostCircle').attr('pointer-events', '');
            updateTempConnector();
            if (draggingNode !== null) {
                update(root);
                centerNode(draggingNode);
                draggingNode = null;
            }
        }

        // Helper functions for collapsing and expanding nodes.

        function collapse(d) {
            if (d.children) {
                d._children = d.children;
                d._children.forEach(collapse);
                d.children = null;
            }
        }

        function expand(d) {
            if (d._children) {
                d.children = d._children;
                d.children.forEach(expand);
                d._children = null;
            }
        }

        var overCircle = function (d) {
            selectedNode = d;
            updateTempConnector();
        };
        var outCircle = function (d) {
            selectedNode = null;
            updateTempConnector();
        };

        // Function to update the temporary connector indicating dragging affiliation
        var updateTempConnector = function () {
            var data = [];
            if (draggingNode !== null && selectedNode !== null) {
                // have to flip the source coordinates since we did this for the existing connectors on the original tree
                data = [{
                    source: {
                        x: selectedNode.y0,
                        y: selectedNode.x0
                    },
                    target: {
                        x: draggingNode.y0,
                        y: draggingNode.x0
                    }
                }];
            }
            var link = svgGroup.selectAll(".templink").data(data);

            link.enter().append("path")
                .attr("class", "templink")
                .attr("d", d3.svg.diagonal())
                .attr('pointer-events', 'none');

            link.attr("d", d3.svg.diagonal());

            link.exit().remove();
        };

        // Function to center node when clicked/dropped so node doesn't get lost when collapsing/moving with large amount of children.

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

        // Toggle children function

        function toggleChildren(d) {
            if (d.children) {
                d._children = d.children;
                d.children = null;
            } else if (d._children) {
                d.children = d._children;
                d._children = null;
            }
            return d;
        }


        // context menu should have different functionality at different levels
        // pop up for displaying node information, terminal node shows section, instructor, meeting pattern, caps
        // 

        // Toggle children on click.

        function click(d) {
            if (d3.event.defaultPrevented) return; // click suppressed
            console.log(d);
            if (d._children) {
                d3.select(this).style('fill', 'red');
            }
            else if (d.children) {
                d3.select(this).style('fill', 'black');
            }
            d = toggleChildren(d);
            update(d);
            centerNode(d);
        }

        function update(source) {
            // Compute the new height, function counts total children of root node and sets tree height accordingly.
            // This prevents the layout looking squashed when new nodes are made visible or looking sparse when nodes are removed
            // This makes the layout more consistent.
            var levelWidth = [1];
            var childCount = function (level, n) {

                if (n.children && n.children.length > 0) {
                    if (levelWidth.length <= level + 1) levelWidth.push(0);

                    levelWidth[level + 1] += n.children.length;
                    n.children.forEach(function (d) {
                        childCount(level + 1, d);
                    });
                }
            };
            childCount(0, root);
            var newHeight = d3.max(levelWidth) * 25; // 25 pixels per line
            tree = tree.size([newHeight, viewerWidth]);

            // Compute the new tree layout.
            var nodes = tree.nodes(root).reverse(),
                links = tree.links(nodes);

            // Set widths between levels based on maxLabelLength.
            nodes.forEach(function (d) {
                d.y = (d.depth * (maxLabelLength * 10)); //maxLabelLength * 10px
                // alternatively to keep a fixed scale one can set a fixed depth per level
                // Normalize for fixed-depth by commenting out below line
                // d.y = (d.depth * 500); //500px per level.
            });

            // Update the nodesâ€¦
            node = svgGroup.selectAll("g.node")
                .data(nodes, function (d) {
                    return d.id || (d.id = ++i);
                });

            // Enter any new nodes at the parent's previous position.
            var nodeEnter = node.enter().append("g")
                .call(dragListener)
                .attr("class", "node")
                .attr("transform", function (d) {
                    return "translate(" + source.y0 + "," + source.x0 + ")";
                })
                .on('click', click);

            nodeEnter.append("circle")
                .attr('class', 'nodeCircle')
                .attr("r", 0)
                .style("fill", function (d) {
                    return d._children ? "lightsteelblue" : "#fff";
                });

            nodeEnter.append("text")
                .attr("x", function(d) {
                    return d.children || d._children ? -10 : 10;
                })
                .attr("dy", ".35em")
                .attr('class', 'nodeText')
                .attr("text-anchor", function(d) {
                    return d.children || d._children ? "end" : "start";
                })
                .text(function(d) {
                    if (d.name) {
                        return d.name;
                    }
                    else if (d.course_title) {
                        return d.course_title
                    }

                    else if (d.instructors) {
                        //console.log(d.instructors[0].instructor_lName);
                        let fullName = d.instructors[0].instructor_fName + " " + d.instructors[0].instructor_lName;
                        return fullName;
                    }
                    else if (d.component) {
                        return d.component + " : " + d.instructors[0].instructor_lName
                    }

                })
                .style("fill-opacity", 0);

            // phantom node to give us mouseover in a radius around it
            nodeEnter.append("circle")
                .attr('class', 'ghostCircle')
                .attr("r", 30)
                .attr("opacity", 0.2) // change this to zero to hide the target area
                .style("fill", "red")
                .attr('pointer-events', 'mouseover')
                .on("mouseover", function (node) {
                    overCircle(node);
                })
                .on("mouseout", function (node) {
                    outCircle(node);
                });

            //var menu = contextMenu(baseSvg).items('first item', 'second option', 'whatever, man');


            node.on("contextmenu", function (d, i) {
                d3.event.preventDefault();
                console.log("RIGHT NODE CLICK: ", d);
                console.log("d.name: ", d.parentNode);
                console.log(this);

                // menu(d3.mouse(this)[0], d3.mouse(this)[1]);

            });


            // Update the text to reflect whether node has children or not.
            node.select('text')
                .attr("x", function(d) {
                    return d.children || d._children ? -10 : 10;
                })
                .attr("text-anchor", function(d) {
                    return d.children || d._children ? "end" : "start";
                })
                .text(function(d) {
                    if (d.name) {
                        return d.name;
                    }
                    else if (d.course_title) {
                        return d.course_title
                    }

                    else if (d.instructors) {
                        //console.log(d.instructors[0].instructor_lName);
                        let fullName = d.instructors[0].instructor_fName + " " + d.instructors[0].instructor_lName + ": " + d.class_number + " : " + d.component;
                        return fullName;
                    }
                    else if (d.component) {
                        return d.component + " : " + d.instructors[0].instructor_lName
                    }

                });

            // Change the circle fill depending on whether it has children and is collapsed
            node.select("circle.nodeCircle")
                .attr("r", 4.5)
                .style("fill", function (d) {
                    return d._children ? "lightsteelblue" : "#fff";
                });

            // Transition nodes to their new position.
            var nodeUpdate = node.transition()
                .duration(duration)
                .attr("transform", function (d) {
                    return "translate(" + d.y + "," + d.x + ")";
                });

            // Fade the text in
            nodeUpdate.select("text")
                .style("fill-opacity", 1);

            // Transition exiting nodes to the parent's new position.
            var nodeExit = node.exit().transition()
                .duration(duration)
                .attr("transform", function (d) {
                    return "translate(" + source.y + "," + source.x + ")";
                })
                .remove();

            nodeExit.select("circle")
                .attr("r", 0);

            nodeExit.select("text")
                .style("fill-opacity", 0);

            // Update the linksâ€¦
            var link = svgGroup.selectAll("path.link")
                .data(links, function (d) {
                    return d.target.id;
                });

            // Enter any new links at the parent's previous position.
            link.enter().insert("path", "g")
                .attr("class", "link")
                .attr("d", function (d) {
                    var o = {
                        x: source.x0,
                        y: source.y0
                    };
                    return diagonal({
                        source: o,
                        target: o
                    });
                });

            // Transition links to their new position.
            link.transition()
                .duration(duration)
                .attr("d", diagonal);

            // Transition exiting nodes to the parent's new position.
            link.exit().transition()
                .duration(duration)
                .attr("d", function (d) {
                    var o = {
                        x: source.x,
                        y: source.y
                    };
                    return diagonal({
                        source: o,
                        target: o
                    });
                })
                .remove();

            // Stash the old positions for transition.
            nodes.forEach(function (d) {
                d.x0 = d.x;
                d.y0 = d.y;
            });
        }

        // Append a group which holds all nodes and which the zoom Listener can act upon.
        var svgGroup = baseSvg.append("g");

        // Define the root
        root = fullObj;
        root.x0 = viewerHeight / 2;
        root.y0 = 0;

        // Layout the tree initially and center on the root node.
        update(root);
        //centerNode(root);




        
        function expandAll(){
            expand(root);
            update(root);
        }
        //function collapseAll(){
    
        
        root.children.forEach((value) => {
            //console.log(value);
            if(value.children != null){

                    //collapse;
                    collapse(value);
                    update(value);

            };
        });        
        centerNode(root);        
        drawTopMenu(baseSvg);

    });
}


function contextMenu(baseSvg) {
    var height,
        width,
        margin = 0.1, // fraction of width
        items = [],
        rescale = false,
        style = {
            'rect': {
                'mouseout': {
                    'fill': 'rgb(244,244,244)',
                    'stroke': 'white',
                    'stroke-width': '1px'
                },
                'mouseover': {
                    'fill': 'rgb(200,200,200)'
                }
            },
            'text': {
                'fill': 'steelblue',
                'font-size': '13'
            }
        };

    function menu(x, y) {
        d3.select('.context-menu').remove();
        scaleItems();

        console.log("x: ", x, " y: ", y);
        console.log("items: ", items);

        // Draw the menu
        //d3.select('baseSvg')
        var menuSVG = baseSvg.append("svg")
            .append('g').attr('class', 'context-menu')
            .selectAll('tmp')
            .data(items).enter()
            .append('g').attr('class', 'menu-entry')
            .style({'cursor': 'pointer'})
            .on('mouseover', function(){
                d3.select(this).select('rect').style(style.rect.mouseover) })
            .on('mouseout', function(){
                d3.select(this).select('rect').style(style.rect.mouseout) });

        d3.selectAll('.menu-entry')
            .append('rect')
            .attr('x', x)
            .attr('y', y)
            .attr('width', 350)
            .attr('height', 450)
            .append('g').attr('class', 'menu-rect')
            .style(style.rect.mouseout);

        d3.selectAll('.menu-entry')
            .append('text')
            //.text(function(d){ return d; })
            .text("hello there")
            .attr('x', x)
            .attr('y', function(d, i){ return y + (i * height); })
            .attr('dy', height - margin / 2)
            .attr('dx', margin)
            .style(style.text);

        // Other interactions
        d3.select('body')
            .on('click', function() {
                d3.select('.context-menu').remove();
            });

    }

    menu.items = function(e) {
        if (!arguments.length) return items;
        for (i in arguments) items.push(arguments[i]);
        rescale = true;
        return menu;
    }

    // Automatically set width, height, and margin;
    function scaleItems() {
        if (rescale) {
            d3.select('svg').selectAll('tmp')
                .data(items).enter()
                .append('text')
                .text(function(d){ return d; })
                .style(style.text)
                .attr('x', -1000)
                .attr('y', -1000)
                .attr('class', 'tmp');
            var z = d3.selectAll('.tmp')[0]
                .map(function(x){ return x.getBBox(); });
            width = d3.max(z.map(function(x){ return x.width; }));
            margin = margin * width;
            width =  width + 2 * margin;
            height = d3.max(z.map(function(x){ return x.height + margin / 2; }));

            // cleanup
            d3.selectAll('.tmp').remove();
            rescale = false;
        }
    }

    return menu;
}


function addClass(){
    console.log('adding a node');

    var jayson = {
        name: null,
        children: null
    };

    jayson.name = "CS-500";
    jayson.children = null;

    addList.push(jayson);

}



//TO DO:
/*
1. on right click of node, have expand all and collapse all options
2. fix up the menu
3. figure out the form for adding classes
4. delete classes



 */
