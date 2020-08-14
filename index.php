<!DOCTYPE html>
<head>
    <title>Custom relationship Graph</title>

	<link href="css/vis-network.min.css" rel="stylesheet" type="text/css" />
  <link href="css/style.css" rel="stylesheet" type="text/css" />

	<script type="text/javascript" src="js/graph.js"></script>
	<script type="text/javascript" src="js/canvas2image.js"></script>
	<script type="text/javascript" src="js/html2canvas.min.js"></script>
	<script type="text/javascript" src="js/vis.min.js"></script>
	<script type="text/javascript" src="js/jquery.min.js"></script>

</head>

<?php
require '../vendor/autoload.php';
require_once 'xlsread.class.php';

error_reporting(E_ALL);
ini_set('display_errors', 1);

### ИМПОРТ списка ###
$xlsarray=$_POST['NODE'] ?? [];
if ($_SERVER['REQUEST_METHOD']=="POST" && !empty($_POST['btnimport']) && $_FILES['inputfile']['name']<>''){
  $xlsarray = XLSRead::xls_to_array($_FILES['inputfile'], 'C');

  function is_empty_val($var){return $var['A']!='' && $var['B']!='';}
  $xlsarray = array_filter($xlsarray, 'is_empty_val');
} ### IMPORT

$print_list = $sNodes = $sEdges = '';
$Nodes = $Edges = "''";
$cntNodes = $cntEdges = 0;
if (count($xlsarray)>0){
  $NODE = [];
  $id = $cnt = 1;
  foreach ($xlsarray as $key){
  	if(array_key_exists($key['A'], $NODE))
  		$NODE[$key['A']] = ['id' => $NODE[$key['A']]['id'], 'cnt' => $cnt++, 'group' => 1];
  	else
  		$NODE[$key['A']] = ['id' => $id++, 'cnt' => $cnt=1, 'group' => 1];

  	if(array_key_exists($key['B'], $NODE))
  		$NODE[$key['B']] = ['id' => $NODE[$key['B']]['id'], 'cnt' => $cnt++, 'group' => $NODE[$key['B']]['group']];
  	else
  		$NODE[$key['B']] = ['id' => $id++, 'cnt' => $cnt=1, 'group' => 0];
  }

  # NODES
  $sNodes = "<table><tr><th>...</th><th align='center'>NODES</th><th align='center'>EDGES</th></tr>".PHP_EOL;
  $Nodes = "";
  foreach ($NODE as $key => $value){
  	$group = $value['group'];
    $Nodes .= "{'id': $value[id], 'label': '$key', 'value': $value[cnt], 'group': $group},";
    if($group==1) $key = "<b>$key</b>";
	$sNodes.= "<tr><td align='center'><input type='checkbox' checked='true' nodeid='$value[id]' /></td><td>$key</td><td>$value[cnt]</td></tr>".PHP_EOL;
  }
  $Nodes = "[$Nodes]";
  $sNodes.= '</table>' . PHP_EOL;
  $cntNodes = $id;

  $print_list='<table><tr><th>id</th><th>NODE_A</th><th>NODE_B</th><th>conn</th></tr>';
  $nom = 1;
  $sEdges = "<table><tr><th>...</th><th align='center'>NODE_A</th><th align='center'>NODE_B</th><th align='center'>Соед-ия</th></tr>".PHP_EOL;
  $Edges = "";
  foreach ($xlsarray as $key){
    $from = $NODE[$key['A']]['id'];
    $to = $NODE[$key['B']]['id'];
    $value = (int)$key['C'];
    if( $value==0 ) $value = 1;
    $print_list .="<tr><td>$nom</td><td>$key[A]</td><td>$key[B]</td><td>$value</td></tr>";
    $Edges .= "{'id': $nom, 'from': $from, 'to': $to, 'value': $value},";
    $sEdges.= "<tr><td align='center'><input type='checkbox' checked='true' edgeid='$nom' /></td><td>";
    $sEdges.= $NODE[$key['A']]['group']==1 ? "<b>$key[A]</b>" : $key['A'];
    $sEdges.= "</td><td>";
    $sEdges.= $NODE[$key['B']]['group']==1 ? "<b>$key[B]</b>" : $key['B'];
    $sEdges.= "</td><td>$value</td></tr>".PHP_EOL;
    $nom++;
  }
  $print_list .="</table>";
  $sEdges .= '</table>' . PHP_EOL;
  $Edges = "[$Edges]";
  $cntEdges = $nom;
}

?>

<div style="margin: 3px;">
  <button id='import' >Source data</button>
  <button id='node'   >Nodes</button>
  <button id='edge'   >Edges</button>
  <button id='draw'   >Redraw</button>
  <button id='stop'   >Manual editing</button>
  <button id='start'  >Auto-stabilization</button>
  <button id='export' >Export</button>
  <button id='conf'   >Config</button>
  <button id='undo' style='color: darkred'>UNDO</button>
</div>

<div id='import_xls'>
	<form method='post' enctype='multipart/form-data'>
		<div id='list'  style='height:55px;'>
	 		<label style='width: auto; font-weight: bold' for='inputfile' >Importing relationships</label><br>
	 		<input type='file' name='inputfile'>
		</div>

		<div class='center'>
		  <input type='submit' style='color:#AA00AA;margin-left: 70px;' name='btnimport' value='Load'/>
		</div>
      The table should have 2-3 columns:<br>
      A - object name<br>
      B - name of the releted object<br>
      <i>C - number of relationships (optional)</i>
	</form>

	<?=$print_list?>
</div>

<div id='node_list'>
  Nodes count: <input type="number" min="2" step="1" id="minValueNodes" value="2" /><br>
  <label><input type="checkbox" id="nodesCheck"> Only the selected</label><br>
  <?=$sNodes?>
  Total nodes: <b><?=$cntNodes?></b><br>
  Selected: <b><span><?=$cntNodes?></span></b>
</div>

<div id='edge_list'>
  Edges count: <input type="number" min="1" step="1" id="minValueEdges" value="1" /><br>
  <label><input type="checkbox" id="edgesCheck"> Только выбранные</label><br>
  <?=$sEdges?>
  Notal edges: <b><?=$cntEdges?></b><br>
  Selected: <b><span><?=$cntEdges?></span></b>
</div>
<div id="mynetwork"></div>
<div id="config"></div>

<script type="text/javascript" src="js/usergraph.js"></script>
<script type="text/javascript">
$(function() {
  // GRAPH
  var nodes=<?=$Nodes?>;
  var edges=<?=$Edges?>;

  var gr = new Graph(nodes, edges, 'mynetwork', 'config');

  var checkNode = id => $('#node_list input[nodeid="' + id + '"]').prop('checked');
  var checkEdge = id => $('#edge_list input[edgeid="' + id + '"]').prop('checked');

  var selNodes = () => nodes.filter(el => checkNode(el.id));
  var selEdges = () => edges.filter(el => checkEdge(el.id)
    //&& checkNode(edges[el.id].fromId) && checkNode(edges[el.id].toId)
  );

  $('#draw').click(function(){
    gr.destroy();
    gr = null;
    gr = new Graph(selNodes(), selEdges(), 'mynetwork', 'config');
  });

  $('#start' ).click( () => gr.start() );
  $('#stop'  ).click( () => gr.stop()  );
  $('#conf'  ).click( () => gr.conf()  );
  $('#export').click( () => gr.export());
  $('#undo'  ).click( () => gr.undo()  );

});
</script>

