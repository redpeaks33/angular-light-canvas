﻿main.directive('lightDygraph', function () {
    return {
        restrict: 'EA',
        replace: true,
        scope: {
            title: '@',
            chartid: '@',
            plotdata: '=',
        },
        templateUrl: '/custom/lightchart/html/lightdygraph.html',
        controller: ['$scope', '$rootScope', '$timeout', function ($scope, $rootScope, $timeout) {
            $scope.graph = [];

            initialize();

            function initialize() {
                $scope.graph.data = convertPlotdata();

                $scope.graph = {
                    data: convertPlotdata(),
                    options: {
                        width:350,//chart width
                        height: 400,//chart height
                        labels: [ "x", "yValue" ],
                        title: '',//draw a title of graph over it.
                        ylabel: 'yName',//draw a label of y axis.
                        labelsSeparateLines: true,//whether separating lines 
                        legend: 'always',//show legend. 'always':always,'follow':follow mouse moveing.'onmouseover':only on mouse over,'never':off.
                        drawPoints: true,//whether draw circle of each plot points.
                        drawAxisAtZero: true,//if ??
                        strokeWidth: 1.0,//The width of plot line.
                        stackedGraph: false,//whether paint between x axis and plot line.
                        //pointSize:2,
                        color: 'red',
                        series: {
                            'yValue': {
                                pointSize:2
                            }
                        },
                        highlightSeriesOpts: {
                            strokeWidth: 1,
                            strokeBorderWidth: 1,
                            highlightCircleSize: 5,//circle size when high lighting on mouse over.
                        }
                    },
                    legend: {
                    //    series: {
                    //        A: {
                    //            label: "Series A"
                    //        }
                    //    }
                    }
                };
            //    var base_time = Date.parse("2008/07/01");
            //    var num = 24 * 0.25 * 365;
            //    for (var i = 0; i < num; i++) {
            //        $scope.graph.data.push([new Date(base_time + i * 3600 * 1000),
            //                    i + 50 * (i % 60),        // line
            //                    i * (num - i) * 4.0 / num  // parabola
            //        ]);
            //    }
            }
            function convertPlotdata() {
                let list = [];
                _.each($scope.plotdata, function (n, i) {
                    if (i < 10) {
                        list.push([n.x,n.y]);
                    }
                });
                return list;
            }


        }],
    };
});