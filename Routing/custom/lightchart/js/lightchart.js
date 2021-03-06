﻿main.directive('lightChart', function () {
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
        templateUrl: '/custom/lightchart/html/lightchart.html',
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
            var ctx = {};
            var ctx_back = {};
            var ctx_sub = {};
            var ctx_back_sub = {};

            var points = [];
            var stageImgData;
            $scope.index = 0;

            initialize();

            function initialize() {
                //$timeout -> Execute after html tag canvas is loaded.
                $timeout(function () {
                    initializeCanvas();

                    //static
                    drawExecuteAllPlots();

                    //dynamic
                    createjs.Ticker.addEventListener("tick", handleTick);
                    createjs.Ticker.timingMode = createjs.Ticker.RAF;
                    //createjs.Ticker.setFPS(chartDrawInfo.fps);
                });
            }

            //#region initialize canvas
            function initializeCanvas(canvasID) {
                //context for plot main data
                $scope.stage = new createjs.Stage($scope.chartid);
                ctx = $scope.stage.canvas.getContext('2d');

                //context for axis for main data
                $scope.stage_background = new createjs.Stage($scope.backgroundid);
                ctx_back = $scope.stage_background.canvas.getContext('2d');

                ////context for plot main data
                //$scope.stage_sub = new createjs.Stage($scope.chartsubid);
                //ctx_sub = $scope.stage_sub.canvas.getContext('2d');

                ////context for axis for main data
                //$scope.stage_sub_background = new createjs.Stage($scope.backgroundsubid);
                //ctx_back_sub = $scope.stage_sub_background.canvas.getContext('2d');


                var canvas = document.getElementById($scope.chartid);
                canvas.addEventListener("mousewheel", MouseWheelHandler, false);
                canvas.addEventListener("DOMMouseScroll", MouseWheelHandler, false);

                //stage2.nextStage = stage1;
                $scope.stage_background.nextStage = $scope.stage;
                setZoomEvent($scope.stage);
                //setZoomEvent($scope.stage_background);
                //$scope.stage.nextStage = $scope.stage_background;
                //$scope.stage_backgroundnextStage = $scope.stage;


                drawWhiteCanvas();
                drawAxis();
                calculatePlot();

                //Sub Contents
                drawContents();
                //drawSubContents();
            }
            //#endregion
            function MouseWheelHandler(e) {
                let stage = $scope.stage;
                if (Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail))) > 0)
                    zoom = 1.1;
                else
                    zoom = 1 / 1.1;
                var local = stage.globalToLocal(stage.mouseX, stage.mouseY);
                stage.regX = local.x;
                stage.regY = local.y;
                stage.x = stage.mouseX;
                stage.y = stage.mouseY;
                stage.scaleX = stage.scaleY *= zoom;

                stage.update();
            }

            var setZoomEvent = function(stage)
            {
                stage.enableDOMEvents(true);
                    stage.addEventListener("stagemousedown", function (e) {
                        var offset = { x: stage.x - e.stageX, y: stage.y - e.stageY };
                        stage.addEventListener("stagemousemove", function (ev) {
                            stage.x = ev.stageX + offset.x;
                            stage.y = ev.stageY + offset.y;
                            stage.update();
                        });
                        stage.addEventListener("stagemouseup", function () {
                            stage.removeAllEventListeners("stagemousemove");
                        });
                    });

                //stage.enableDOMEvents(true);
                //    stage.addEventListener("stagemousedown", function (e) {
                //        var offset = { x: stage.x - e.stageX, y: stage.y - e.stageY };
                //        stage.addEventListener("stagemousemove", function (ev) {
                //            stage.x = ev.stageX + offset.x;
                //            stage.y = ev.stageY + offset.y;
                //            stage.update();
                //        });
                //        stage.addEventListener("stagemouseup", function () {
                //            stage.removeAllEventListeners("stagemousemove");
                //        });
                //    });
            }
            //#region transform coordination
            function convertScaleValue(originalPoints) {
                var convertedPoints = [];
                var maxX = _.max(originalPoints, function (n) { return n.x; }).x;
                var maxY = _.max(originalPoints, function (n) { return n.y; }).y;
                _.each(originalPoints, function (n) {
                    convertedPoints.push({
                        t: n.t,
                        x: ~~(n.x * (chartSizeInfo.canvasSizeX - chartSizeInfo.axisYPadding) / maxX),
                        y: ~~(n.y * (chartSizeInfo.canvasSizeY - chartSizeInfo.axisXPadding) / maxY),
                    })
                });
                return convertedPoints;
            }

            //canvas nominal (0,0) exists a most upper-left point.
            //transform nominal based on customized axis.
            function transformCoordination(originalPoints) {
                var convertedPoints = [];
                _.each(originalPoints, function (n) {
                    convertedPoints.push({
                        t: n.t,
                        x: chartSizeInfo.axisYPadding + n.x,
                        y: chartSizeInfo.canvasSizeY - chartSizeInfo.axisXPadding - n.y,
                    })
                });
                return convertedPoints;
            }
            var calculatePlot = function () {
                points = $scope.plotdata;
                points = convertScaleValue(points)
                points = transformCoordination(points);
            }
            //#endregion

            //#region draw chart
            var handleTick = function () {
                if (execute) {
                    drawExecute();
                }
            }

            function drawExecute() {
                drawAppendPlots(points, chartSizeInfo.xMax, chartSizeInfo.xMin, chartSizeInfo.yMax, chartSizeInfo.yMin, $scope.index, chartDrawInfo.appendCount);
            }

            function drawExecuteAllPlots() {
                $scope.index = 0;
                drawAppendPlots(points, chartSizeInfo.xMax, chartSizeInfo.xMin, chartSizeInfo.yMax, chartSizeInfo.yMin, $scope.index, chartSizeInfo.T);
            }

            function drawExecuteBySlider(newValue, oldValue) {
                drawWhiteCanvas();
                $scope.index = oldValue;
                drawAppendPlots(points, chartSizeInfo.xMax, chartSizeInfo.xMin, chartSizeInfo.yMax, chartSizeInfo.yMin, oldValue, newValue);
            }

            //#region draw append plots
            var drawAppendPlots = function (points, xMax, xMin, yMax, yMin, currentIndex, appendCount) {
                //step forward or step back
                $scope.index = reverse ? currentIndex - appendCount : currentIndex + appendCount

                if ($scope.index >= 0 && $scope.index <= chartSizeInfo.T) {
                    drawAllPlots(points, xMax, xMin, yMax, yMin, currentIndex, appendCount);
                }
                else {
                    $scope.index = 0;
                    drawWhiteCanvas();
                }

                //if (!changeslider) {
                $rootScope.$broadcast('setCurrentTimeToSlider', $scope.index);
                //}
            }
            //#endregion

            var px = [0, 0, 0, 0, 0, 1, 2, -1, -2];
            var py = [0, 1, 2, -1, -2, 0, 0, 0, 0];
            //var px = [0, 0, 0, 0, 0, 1, 1,1, -1,-1,-1, 2,-2];
            //var py = [0, 1, 2, -1, -2, 0,1,-1, 0,1,-1,0,0];
            //#region draw all plots
            function drawAllPlots(points, xMax, xMin, yMax, yMin, currentIndex, appendCount) {
                //plot data
                _.each(points, function (n, i) {
                    if (currentIndex <= i && i < currentIndex + appendCount) {
                        //plot + or clear + on canvas.
                        for (var p = 0; p < px.length; p++) {
                            //do not draw if value is out of canvas size 
                            if ((n.x + px[p]) < chartSizeInfo.canvasSizeX)
                            {
                                if (reverse) {
                                    clearImagePlot(stageImgData, ((n.x + px[p]) + (n.y + py[p]) * chartSizeInfo.canvasSizeX) * 4);
                                }
                                else {
                                    setImagePlot(stageImgData, ((n.x + px[p]) + (n.y + py[p]) * chartSizeInfo.canvasSizeX) * 4);
                                }

                            }

                        }

                    }

                });

                //Animation
                //circleShape.x = circleShape.x + 1;
                //$scope.stage_sub.update();

                ctx.putImageData(stageImgData, 0, 0)

                $scope.fps = createjs.Ticker.getMeasuredFPS();
                $scope.tickTime = createjs.Ticker.getMeasuredTickTime();
                $scope.$apply();
            }

           
            function setImagePlot(image, index) {
                image.data[index + 0] = 255;
                image.data[index + 1] = 0;
                image.data[index + 2] = 0;
                image.data[index + 3] = 255;
            }

            function clearImagePlot(image, index) {
                image.data[index + 0] = 255;
                image.data[index + 1] = 255;
                image.data[index + 2] = 255;
                image.data[index + 3] = 255;
            }
            //#endregion

            //#endregion

            //#region timer event
            var execute = false;
            var reverse = false;
            $scope.$on('start', function (e) {
                execute = true;
            });
            $scope.$on('reset', function (e) {
                $scope.index = 0;
                execute = false;
                drawWhiteCanvas();
            });

            $scope.$on('stop', function (e) {
                execute = false;
            });

            $scope.$on('stepforward', function (e) {
                execute = false;
                reverse = false;
                drawExecute();
            });

            $scope.$on('stepback', function (e) {
                execute = false;
                reverse = true;
                drawExecute();
            });
            //#region event
            var changeslider = false;
            $scope.$on('setCurrentTimeToGraph', function (e, newValue, oldValue) {
                changeslider = true;
                drawExecuteBySlider(newValue, oldValue);
            })
            //#endregion
            //#endregion
            //#endregion

            //#region draw axis
            function drawAxis() {
                let g = new createjs.Graphics();

                drawAxisX(g);
                drawAxisY(g);

                var s = new createjs.Shape(g);
                s.draw(ctx_back);
            }

            function drawAxisX(g) {
                let xBase = chartSizeInfo.canvasSizeY - chartSizeInfo.axisXPadding;
                let span = 60;
                let axisCount = xBase / span;
                let startX = 0;
                for (let i = 0; i < axisCount; i++) {
                    if (i == 0)
                    {
                        //base axis
                        g.s("Gray").setStrokeDash([1, 0], 0).setStrokeStyle(2);
                    }
                    else {
                        //sub axis
                        g.s("Gray").setStrokeDash([4, 2], 0).setStrokeStyle(1); //color dot thickness
                        startX = chartSizeInfo.axisXPadding;
                    }
                    //if ((startX * startX) + (xBase -  span) * (xBase - span) < 50 * 50)
                    {
                        g.mt(startX, xBase - i * span);
                        g.lt(chartSizeInfo.canvasSizeX, xBase - i * span);
                    }
                }
                g.s("DarkRed").drawCircle(400, 490, 50);

            }

            function drawAxisY(g) {
                let base = chartSizeInfo.axisYPadding;
                let span = 60;
                let axisCount = chartSizeInfo.canvasSizeX / span;
                let endP = 0;
                for (let i = 0; i < axisCount; i++) {
                    if (i == 0)
                    {
                        //base axis
                        g.s("Gray").setStrokeDash([1, 0], 0).setStrokeStyle(2);
                        endP = chartSizeInfo.canvasSizeY;
                    }
                    else {
                        //sub axis
                        g.s("Gray").setStrokeDash([4,2], 0).setStrokeStyle(1); //color dot thickness
                        endP = chartSizeInfo.canvasSizeY - chartSizeInfo.axisXPadding;
                    }
                    g.mt(base + i * span, 0);
                    g.lt(base + i * span, endP);
                }
            }
            //#endregion

            //#region draw white canvas
            var drawWhiteCanvas = function () {
                stageImgData = ctx.createImageData(chartSizeInfo.canvasSizeX, chartSizeInfo.canvasSizeY);
            }
            //#endregion
            var circleShape;
            var rectangleShape;
        
            function drawContents() {
                /////////////////////////////////////////////
                g = new createjs.Graphics();

                g.s("Green").setStrokeDash([8, 4], 0).setStrokeStyle(1); //color dot thickness
                g.drawCircle(chartSizeInfo.canvasSizeX / 2, chartSizeInfo.canvasSizeY / 2 + 300, 200);
                g.beginFill("Pink").drawCircle(40, 40, 30);

                circleShape = new createjs.Shape(g);
                $scope.stage.addChild(circleShape);

                g = new createjs.Graphics();
                ////////////////////////////////////////////////////////////////////////////////
                g.s("Red").setStrokeDash([8, 4], 0).setStrokeStyle(1); //color dot thickness
                g.beginFill("Yellow").drawRect(0, 0, 120, 120);
                g.beginFill("blue").drawRect(10, 10, 100, 100);

                diamondShape = new createjs.Shape(g);
                diamondShape.regX = diamondShape.regY = 60;
                diamondShape.rotation = 45;
                diamondShape.x = 100;
                diamondShape.y = 100;
                $scope.stage.addChild(diamondShape);
                $scope.stage.update();
            }

            function drawSubContents() {
                let g = new createjs.Graphics();

                g.s("Blue").setStrokeDash([4,2], 0).setStrokeStyle(1); //color dot thickness
                g.drawCircle(chartSizeInfo.canvasSizeX / 2, chartSizeInfo.canvasSizeY/2, 200);
               

                var s = new createjs.Shape(g);
                s.draw(ctx_sub);
                createCircleWithNotch(g)
                /////////////////////////////////////////////
                g = new createjs.Graphics();

                g.s("Green").setStrokeDash([8, 4], 0).setStrokeStyle(1); //color dot thickness
                g.drawCircle(chartSizeInfo.canvasSizeX / 2, chartSizeInfo.canvasSizeY / 2 + 300, 200);
                g.beginFill("Pink").drawCircle(40, 40,30);

                circleShape = new createjs.Shape(g);
                $scope.stage_sub.addChild(circleShape);

                g = new createjs.Graphics();
                ////////////////////////////////////////////////////////////////////////////////
                g.s("Red").setStrokeDash([8, 4], 0).setStrokeStyle(1); //color dot thickness
                g.beginFill("Yellow").drawRect(0, 0, 120, 120);
                g.beginFill("blue").drawRect(10, 10, 100, 100);

                diamondShape = new createjs.Shape(g);
                diamondShape.regX = diamondShape.regY = 60;
                diamondShape.rotation = 45;
                diamondShape.x = 100;
                diamondShape.y = 100;
                $scope.stage_sub.addChild(diamondShape);
                
            }

            function createCircleWithNotch(g) {
                g.s("Blue").setStrokeStyle(1); //color dot thickness
                let center = { x: chartSizeInfo.canvasSizeX / 2, y: chartSizeInfo.canvasSizeY / 2 }
                let angle = 3;
                let r = 180
                g.arc(center.x, center.y, r, (90 - angle) * Math.PI / 180, (90 + angle) * Math.PI / 180, true);

                let dX = r * Math.sin(angle * Math.PI / 180);
                let dY = r * Math.cos(angle * Math.PI / 180);
                g.mt(center.x - dX, center.y + dY);
                g.lt(center.x, center.y + r - 20);
                g.lt(center.x + dX, center.y + dY);
            }
        }],
    };
});