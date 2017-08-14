var main = angular.module("app", [
    'ui.router',
    'angularFileInput',
    'threejs'
]);

main.controller('MyController', ['$scope', '$state','$timeout', function ($scope,$state, $timeout) {
    $scope.initialize = function()
    {
        initializeData(0, 0);
        //initializeDataRandom(0, 0);
        $scope.length = $scope.dataPoints.length;
        //$state.go('chart2');
        //$state.go('chart4');
        //$state.go('chartImage');
        $state.go('chart3D');

    };

    $scope.tabClicked = function(type)
    {
        $state.go(type);

        //Stop Animation on Canvas 
        //Because memory is used even if canvas is not displayed.
        $scope.$broadcast('stop');
        //Load CurrentTime
        
       
    }
    $scope.file = {};
    //#region initialize data

    $scope.dataPoints = [];
    var initializeData = function (dX,dY) {
        var limit = 32786    //increase number of dataPoints by increasing this
        $scope.dataPoints = [];
        for (var i = 0; i < limit; i++)
        {
            $scope.dataPoints.push({
                t: 0.002 * i,
                x: i % 10000 - dY,
                //y: i * 0.00001  - dY,
                y: Math.floor((Math.random() * 10000) + 1) - dY,
            });
        }
    }
    var initializeDataRandom = function (dX, dY) {
        var limit = 32786;    //increase number of dataPoints by increasing this
        $scope.dataPoints = [];
        for (var i = 0; i < limit; i++) {
            $scope.dataPoints.push({
                t: 0.002 * i,
                x: Math.floor((Math.random() * 250) + 1),
                y: Math.floor((Math.random() * 150) + 1),
            });
        }
    }
 
    //#endregion

}]);
