main.config(['$stateProvider', function ($stateProvider) {
    $stateProvider
      .state('chart2', {
          url: '/chart2',
          templateUrl: '/custom/html/chart2.html'
      })
      .state('chart4', {
          url: 'chart4',
          templateUrl: '/custom/html/chart4.html'
      })
      .state('chart8', {
          url: 'chart8',
          templateUrl: '/custom/html/chart8.html'
      })
      .state('chartImage', {
          url: '/chartImage',
          templateUrl: '/custom/html/chartImage.html'
      })
      .state('chart3D', {
          url: '/chart3D',
          templateUrl: '/custom/html/chart3D.html'
      })
}]);