main.directive('lightImage', function () {
    return {
        restrict: 'EA',
        replace: true,
        scope: {
            title: '@',
            chartid: '@',
            chartsubid: '@',
            backgroundid: '@',
            backgroundsubid: '@',
            width: '=',
            height: '=',
            dx: '=',
            dy: '=',
            plotdata: '=',
            plotdatasub: '='
        },
        templateUrl: '/custom/lightchart/html/lightimage.html',
        controller: ['$scope', '$rootScope', '$timeout', function ($scope, $rootScope, $timeout) {
            var chartSizeInfo = {
                //canvasSizeX: $scope.width,
                //canvasSizeY: $scope.height,
                //axisXPadding: $scope.dx,
                //axisYPadding: $scope.dy,
                //xMax: $scope.width,
                //xMin: 0,
                //yMax: $scope.height,
                //yMin: 0,
                //T: $scope.plotdata.length
            };
            var chartDrawInfo = {
                fps: 2,
                appendCount: 1024 //128,256,512,1024,2048 //slow - fast
            }
            initialize();

            function initialize() {
                //$timeout -> Execute after html tag canvas is loaded.
                $timeout(function () {
                
                });
            }
            
            $scope.imagedata;
            $scope.$on('setImage', function (e, filedata) {
                let header = 'data:' + filedata.mimetype + ";" + filedata.encoding + ',';
                $scope.imagedata = header + filedata.content;
            });

  
        }],
    };
});