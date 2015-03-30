gloomApp.controller('albumController', function($scope, $location, $routeParams, $rootScope) {
  $scope.albumId = $routeParams.albumId;
  $scope.album = null;

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
            {"data": "durationMillis", "render": function(data) { return $scope.moment.utc(parseInt(data)).format("m:ss");  }}
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

  // Get album if authed.
  if($scope.authed) {
    $scope.getAlbum();
  } else {
    // If page is refreshed wait for GMusic auth before trying to load the album.
    $scope.$on('login', function() {
      $scope.getAlbum();
    })
  }

});
