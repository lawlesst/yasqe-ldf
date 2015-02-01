var startFragment = "http://fragments.dbpedia.org/2014/en";
//var startFragment = "http://ldf-vivo.herokuapp.com/orgref";
// Add log lines to the log element
var logger = new ldf.Logger();
logger._print = function (items) { $('#status').toggle(); };

YASQE.defaults.sparql.showQueryButton = true;
YASQE.defaults.sparql.callbacks.success =  function(data){console.log("success", data);};
YASQE.defaults.createShareLink = false;
YASQE.executeQuery = function(yasqe, callbackOrConfig) {
    if (yasqe.getQueryType() != 'SELECT') {
      alert("Only SELECT queries supported at this time.");
      return
    }
    var $status = $('#status');
    //clear previous results
    $('.results-box').empty();
    $status.html("Query running..")
    query = yasqe.getValue();
    var fragmentsClient = new ldf.FragmentsClient(startFragment, {'logger': logger});
    results = new ldf.SparqlIterator(query, { fragmentsClient: fragmentsClient});
    results.on('data', function(chunk) {
        //console.log(JSON.stringify(chunk));
        formatRow(chunk);
    });
    results.on('end', function() {
      $status.text("Query finished.");
      $status.show();
    });
};

//finally, initialize YASQE
var yasqe = YASQE(document.getElementById("yasqe"));

//add results row
function formatRow(row) {
  console.log(row);
  var $area = $('.results-box');
  Object.keys(row).forEach(function(key) {
    var val = row[key];
    if (val.lastIndexOf("http", 0) == 0) {
        val = "<a href=\"" + val + "\" target=\"_blank\">" + val + "<a/>";
    }
    $area.append(key).append(": ").append(val).append('\n');
  });
  $area.append("\n");
}