main.directive('lightDygraph', function () {
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
        templateUrl: '/custom/lightchart/html/lightdygraph.html',
        controller: ['$scope', '$rootScope', '$timeout', function ($scope, $rootScope, $timeout) {
            var chartSizeInfo = {
                canvasSizeX: $scope.width,
                canvasSizeY: $scope.height,
                axisXPadding: $scope.dx,
                axisYPadding: $scope.dy,
                xMax: $scope.width,
                xMin: 0,
                yMax: $scope.height,
                yMin: 0,
                T: $scope.plotdata.length
            };
            var chartDrawInfo = {
                fps: 2,
                appendCount: 1024 //128,256,512,1024,2048 //slow - fast
            }

            $scope.index = 0;

            initialize();

            function initialize() {
                $scope.graph = {
                    data: [
                    ],
                    options: {
                        labels: ["x", "A", "B"]
                    },
                    legend: {
                        series: {
                            A: {
                                label: "Series A"
                            },
                            B: {
                                label: "Series B",
                                format: 3
                            }
                        }
                    }
                };

                var base_time = Date.parse("2008/07/01");
                var num = 24 * 0.25 * 365;
                for (var i = 0; i < num; i++) {
                    $scope.graph.data.push([new Date(base_time + i * 3600 * 1000),
                                i + 50 * (i % 60),        // line
                                i * (num - i) * 4.0 / num  // parabola
                    ]);
                }
            }

        }],
    };
});