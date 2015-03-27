gloomApp.controller('albumController', function($scope, $location, $routeParams, $rootScope) {
  $scope.albumId = $routeParams.albumId;
  $scope.album = null;

  // Bq2uisbtqvsh5fninrac2kzgc5a

  $scope.getAlbum = function() {
    $scope.pm.getAlbum($scope.albumId, true, function(success, error) {
      if(success) {
        $scope.album = success;
        $scope.$apply();
      } else {
        console.log(error);
      }
    });
  };

  $scope.getAlbum();
});
