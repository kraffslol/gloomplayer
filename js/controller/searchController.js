gloomApp.controller('searchController', function($scope, $location, $routeParams) {
  $scope.searchString = $routeParams.searchString;
  $scope.tracks = null;
  $scope.artists = null;
  $scope.albums = null;

  $scope.pm.search($scope.searchString, 5, function(data) {
    // Type 2 = ARtist, Type = 1 Track, Type 3 = Album
    $scope.tracks = data.entries.filter(function (el){
      return el.type == 1
    });
    $scope.artists = data.entries.filter(function (el){
      return el.type == 2
    });
    $scope.albums = data.entries.filter(function (el){
      return el.type == 3
    });
    console.log($scope.tracks);
    $scope.$apply();
  })
});
