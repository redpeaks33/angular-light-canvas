main.directive('chartTimer', function () {
    return {
        restrict: 'EA',
        replace: true,
        scope: {
            plotdata: '='
        },
        templateUrl: '/custom/lightchart/html/charttimer.html',
        controller: ['$scope', '$rootScope', '$timeout', function ($scope, $rootScope, $timeout) {
            $scope.sample = 333;// Number($scope.plotdata.length);
            $timeout(function () {
                $scope.$apply();
            });
            //#region button Event
            $scope.start = function () {
                $rootScope.$broadcast('start');
            }
            $scope.reset = function () {
                $rootScope.$broadcast('reset');
            }
            $scope.stop = function () {
                $rootScope.$broadcast('stop');
            }
            $scope.stepforward = function () {
                $rootScope.$broadcast('stepforward');
            }
            $scope.stepback = function () {
                $rootScope.$broadcast('stepback');
            }
            //#endregion
  

            var slider = new Slider('#ex1', {
                formatter: function (value) {
                    return 'Current value: ' + value;
                }
            });

            var dragging = false;
            var value = { newValue: 0, oldValue: 0 }

            slider.on("slide", function (e) {
                //value.oldValue = e;
            });
            slider.on("slideStart", function (e) {
                //dragging = true;
                //value.oldValue = e;
            });
            slider.on("slideStop", function (e) {
                //value.newValue = e;
                //if (dragging) {
                //    $rootScope.$broadcast('setCurrentTimeToGraph', e.newValue, e.oldValue);
                //}
                //dragging = false;
            });
            slider.on("change", function (e) {
                //$rootScope.$broadcast('setCurrentTimeToGraph', e.newValue, e.oldValue);
                $rootScope.$broadcast('setCurrentTimeToGraph', e.newValue, 0);
            });

            $scope.$on('setCurrentTimeToSlider', function (e, value) {
                dragging = false;
                slider.setValue(value);
            })
        }],
        link: function (scope, element, attr, tableFilterCtrl) {
        },
    };
});
main
    .controller('TestCtrl', ['$scope', '$log', function ($scope, $log) {

        $scope.testOptions = {
            min: 5,
            max: 100,
            step: 5,
            precision: 2,
            orientation: 'horizontal',  // vertical
            handle: 'round', //'square', 'triangle' or 'custom'
            tooltip: 'show', //'hide','always'
            tooltipseparator: ':',
            tooltipsplit: false,
            enabled: true,
            naturalarrowkeys: false,
            range: false,
            ngDisabled: false,
            reversed: false
        };

        $scope.range = true;

        $scope.model = {
            first: 0,
            second: [],
            third: 0,
            fourth: 0,
            fifth: 0,
            sixth: 0,
            seventh: 0,
            eighth: 0,
            ninth: 0,
            tenth: 0
        };

        $scope.value = {
            first: $scope.testOptions.min + $scope.testOptions.step,
            second: [$scope.testOptions.min + $scope.testOptions.step, $scope.testOptions.max - $scope.testOptions.step],
            third: 0,
            fourth: 0,
            fifth: 0,
            sixth: 0,
            seventh: 0,
            eighth: 0,
            ninth: 0,
            tenth: 0
        };

        $scope.prefix = 'Current value: ';
        $scope.suffix = '%';

        $scope.formatterFn = function (value) {
            return $scope.prefix + value + $scope.suffix;
        };

        $scope.delegateEvent = null;
        $scope.slideDelegate = function (value, event) {
            if (angular.isObject(event)) {
                $log.log('Slide delegate value on ' + event.type + ': ' + value);
            }
            else {
                $log.log('Slide delegate value: ' + event);
            }
            $scope.delegateEvent = event;
        };
    }]
);