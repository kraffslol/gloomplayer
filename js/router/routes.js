gloomApp.config(function ($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'tmpl/home.html',
      /*controller: 'gloomController'*/
    })
    .when(('/album/:albumId'), {
      templateUrl: 'tmpl/album.html',
      controller: 'albumController'
    })
    .when(('/sr/:searchString'),{
      templateUrl: 'tmpl/search.html',
      controller: 'searchController'
    })
    .otherwise({
      redirectTo: '/'
    });
});
