main.directive('dygraphOptions', function () {
    return {
        restrict: 'EA',
        replace: true,
        scope: {
        },
        templateUrl: '/custom/lightchart/html/dygraphoptions.html',
        controller: ['$scope', '$rootScope', '$timeout', function ($scope, $rootScope, $timeout) {

            $scope.setZoomOptions = function (type) {
                $rootScope.$broadcast('zoomType',type);
            }
        }],
    };
});