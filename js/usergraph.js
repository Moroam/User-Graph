$(function() {
// NODES LIST
  function cntCheckedNodes(){
    $('#node_list span').text($('#node_list tr').find('input:checked').length)
  }

  function hideEdges(){
    var n = [];
    $('#node_list tr input:not(:checked)').each( function(){
      n.push(+$(this).attr('nodeid'))
    });
    edges.forEach(function(el){
      e = $('#edge_list input[edgeid="' + el.id + '"]');
      if(n.includes(+el.from) || n.includes(+el.to) ){
        e.prop('checked', false);
        e.closest('tr').hide();
      }else{
        e.prop('checked', true);
        e.closest('tr').show().removeClass('grey');
      }
    });
  }

  $('#minValueNodes').change(function(){
    let val = $(this).val();
    $('#node_list tr').each(function(index){
      if(index==0 || $(this).css('font-weight') == 'bold') return true;
      if(+$(this).find('td:last').text() >= val){
        $(this).find('input').prop( 'checked', true );
        $(this).removeClass('grey');
      } else {
        $(this).find('input').prop('checked', false);
        $(this).addClass('grey');
      }
    });
    hideEdges();
    cntCheckedNodes();
    $('#minValueEdges').val(1);
    cntCheckedEdges();
  });

  $('#nodesCheck').change(function(){
    if($(this).prop('checked')){
      $('#node_list').find('input:checked').closest('tr').show();
      $('#node_list').find('input:not(:checked)').closest('tr').hide();
    } else {
      $('#node_list tr').show();
    }
  });

  $('#node_list tr input[type="checkbox"]').change(function(){
    $(this).closest('tr').toggleClass( 'grey' );
    hideEdges();
    cntCheckedNodes();
    cntCheckedEdges();
  });

  // EDGES LIST
  function cntCheckedEdges(){
    $('#edge_list span').text($('#edge_list tr').find('input:checked').length)
  }

  $('#minValueEdges').change(function(){
    let val = $(this).val();
    $('#edge_list tr').each(function(index){
      if(index==0 || $(this).css('font-weight') == 'bold') return true;
      if(+$(this).find('td:last').text() >= val){
        $(this).find('input').prop( 'checked', true );
        $(this).removeClass('grey');
      } else {
        $(this).find('input').prop('checked', false);
        $(this).addClass('grey');
      }
    });
    cntCheckedEdges();
  });

  $('#edgesCheck').change(function(){
    if($(this).prop('checked')){
      $('#edge_list').find('input:checked').closest('tr').show();
      $('#edge_list').find('input:not(:checked)').closest('tr').hide();
    } else {
      $('#edge_list tr').show();
    }
    hideEdges();
    cntCheckedEdges();
  });

  $('#edge_list input[type="checkbox"]').change(function(){
    $(this).closest('tr').toggleClass( 'grey' );
    cntCheckedEdges();
  });

  $('#import').click( () => $('#import_xls').toggle() );
  $('#node'  ).click( () => $('#node_list' ).toggle() );
  $('#edge'  ).click( () => $('#edge_list' ).toggle() );
});
