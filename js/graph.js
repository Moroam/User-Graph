/*
*   draw graph
*   @array      nodes => [{id: id_node, "label": "label_node", "group": id_group, value: size_node}]
*   @array      edges => [{"from": id_node_from, "to": id_node_to, value: width_edge}]
*   @idcanvas   idcanvas
*/
function Graph(nodes, edges, idcanvas, idconfig) {
    var container = document.getElementById(idcanvas);
    var conf = document.getElementById(idconfig);
    var data = {
            nodes: nodes,
            edges: edges
        };
    var undo = [];
    var options = {
            locale: 'ru',
            nodes: {
                shape: 'dot',
                //size: 16,
                value: 100,
                font: {
                    size: 32
                }
            },
            physics: {
                forceAtlas2Based: {
                    gravitationalConstant: -60,
                    centralGravity: 0.01,
                    springLength: 200,
                    springConstant: 0.25
                    },
                maxVelocity: 146,
                minVelocity: 1,
                solver: 'forceAtlas2Based',
                timestep: 0.35,
                stabilization: {iterations: 150}
            },
            "edges": {
                value: 1,
                "smooth": {
                    "type": "dynamic",
                    "forceDirection": "none",
                    "roundness": 0.2
                }
            },

            configure: {
              filter:function (option, path) {
                if (path.indexOf('physics') !== -1) {
                  return true;
                }
                if (path.indexOf('smooth') !== -1 || option === 'smooth') {
                  return true;
                }
                return false;
              },
              container: conf
            },
            manipulation: {
                enabled: false,
                addNode: false,
                addEdge: false,
                deleteEdge: false,
                deleteNode: function(elem, callback) {
                                //console.log('sel network:', network );
                                undo.push(getElem(elem));
                                callback(elem);
                            }
            }
        };

    var network = new vis.Network(container, data, options);
    network.disableEditMode();
    conf.style.display = 'none';

    function getNode(id){
        let n = network.body.data.nodes._data[id],
            p = network.getPositions(id);
        return {'id': n.id, 'label': n.label, 'value': n.value, 'group': n.group, 'x': p[id]['x'], 'y': p[id]['y']};
    }
    function getEdge(id){
        let e = network.body.data.edges._data[id]; 
        return {'from': e.from, 'to': e.to, 'value': e.value};
    }
    function getEdgesForNode(id){
        let ids = network.getConnectedEdges(id);
        let es = [];
        ids.forEach(el => es.push( getEdge(el) ) );
        return es;
    }
    function getElem(elem){
        let nodes = getNode(elem.nodes);
        let edges = getEdgesForNode(elem.nodes);
        return {nodes, edges};
    }

    this.stop = function(){
        network.setOptions({physics:false, manipulation:true});
    }
    this.start = function(){
        network.setOptions({physics:true, manipulation:false});
    }
    this.conf = function(fShow){
        if(fShow === undefined){
            conf.style.display = conf.style.display=='none' ? 'block' : 'none';    
        } else {
            conf.style.display = fShow ? 'block' : 'none';
        }
    }
    this.destroy = function(){
        network.destroy();
        conf.innerHTML = '';
        network = null;
    }
    this.setData = function(data){
        //setData({ vis DataSet/Array - NODES, vis DataSet/Array - EDGES})
        network.setData(data);
    }
    this.export = function(){
        network.setOptions({manipulation:false});
        //html2canvas(document.querySelector("#mynetwork")).then(canvas => {
        html2canvas(container).then(canvas => {
            Canvas2Image.saveAsPNG(canvas, 1200, 1200, 'image.png');
        });
    }

    this.undo = function(){
        if(undo.length == 0) return;
        let u = undo.pop();
        network.body.data.nodes.add(u.nodes);
        network.body.data.edges.add(u.edges);
    }

}