main.directive('inputFile', function () {
    return {
        restrict: 'EA',
        replace: false,
        scope: {
            fileread: '='
        },
        templateUrl: '/custom/lightchart/html/inputfile.html',
        controller: ['$scope', '$rootScope', '$timeout', function ($scope, $rootScope, $timeout) {
            $scope.callback = function (file) {
                $scope.file = file;
            }

            $scope.callback_Image = function (file) {
                $scope.image_file = file;
                $rootScope.$broadcast('setImage',$scope.image_file );
            }
        }],
        link: function (scope, element, attr, tableFilterCtrl) {
        },
    };
});