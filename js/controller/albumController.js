gloomApp.controller('albumController', function($scope, $location, $routeParams, $rootScope) {
  $scope.albumId = $routeParams.albumId;
  $scope.album = null;

  // Bq2uisbtqvsh5fninrac2kzgc5a

  $scope.getAlbum = function() {
    $scope.pm.getAlbum($scope.albumId, true, function(success, error) {
      if(success) {
        $scope.album = success;
        console.log(success);
        $scope.$apply();
        $('#albumtable').DataTable( {
          "sDom": 'rt',
          "paging": false,
          "data": success.tracks,
          "columns": [
            {"data": "trackNumber", "width": "5%"},
            {"data": "title"},
            {"data": "artist"},
            {"data": "album"},
          ]
        });

        $('#albumtable tbody tr').bind('click', function () {
          var table = $('#albumtable').dataTable();
          table.$('tr.selected').removeClass('selected');
          $(this).addClass('selected');
        });

        $('#albumtable tbody tr').bind('dblclick', function () {
          console.log("clicky");
          var data = $('#albumtable').dataTable();
          var track = data.fnGetData(this);
          $scope.playSong(track);
        });

      } else {
        console.log(error);
      }
    });
  };

  $scope.getAlbum();
});
