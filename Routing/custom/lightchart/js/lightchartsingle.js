main.directive('lightChartSingle', function () {
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

        templateUrl: '/custom/lightchart/html/lightchartsingle.html',
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
            let termContainer;
            function initializeCanvas(canvasID) {
                //context for plot main data
                $scope.stage = new createjs.Stage($scope.chartid);
                ctx = $scope.stage.canvas.getContext('2d');

                //context for axis for main data
                $scope.stage_background = new createjs.Stage($scope.backgroundid);
                ctx_back = $scope.stage_background.canvas.getContext('2d');

                //add wheel event
                let canvas = document.getElementById($scope.chartid);
                canvas.addEventListener("mousewheel", MouseWheelHandler, false);//IE
                canvas.addEventListener("DOMMouseScroll", MouseWheelHandler, false);//Firefox

                //$scope.stage_background.nextStage = $scope.stage;
                $scope.stage.nextStage = $scope.stage_background;
                setStageMouseEvent($scope.stage);
                setStageMouseEvent($scope.stage_background);
                $scope.stage.enableMouseOver(20);

                drawWhiteCanvas();
                drawAxis(zoom);
                calculatePlot();

                //Sub Contents
                //drawContents();
            }

            //#endregion
            let zoom = 1;
            function MouseWheelHandler(e) {
                updateZoom(e, $scope.stage,false);
                updateZoom(e, $scope.stage_background,true);
            }
            let ZOOM_MIN = 0.4;
            let ZOOM_MAX = 5;
            function updateZoom(e, stage,isAxis) {
                //wheelDelta -> IE
                //detail -> Firefox
                    if (Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail))) > 0) {
                        zoom = 1.1;
                    }
                    else {
                        zoom = 1 / 1.1;
                    }
                    //Global: original stage
                    //Local Zoomed stage
                    let local = stage.globalToLocal(stage.mouseX, stage.mouseY);
                    stage.regX = local.x;
                    stage.regY = local.y;
                    stage.x = stage.mouseX;
                    stage.y = stage.mouseY;
                    stage.scaleX *= zoom;
                    stage.scaleY *= zoom;

                    if (stage.scaleX > ZOOM_MIN && stage.scaleX < ZOOM_MAX) {
                        if (isAxis) {
                            drawAxis(zoom);
                        }
                        stage.update();
                    } else {
                        if (stage.scaleX <= ZOOM_MIN) {
                            stage.scaleX = ZOOM_MIN;
                            stage.scaleY = ZOOM_MIN;
                        }
                        else if (stage.scaleX >= ZOOM_MAX) {
                            stage.scaleX = ZOOM_MAX;
                            stage.scaleY = ZOOM_MAX;
                        }
                    }
            }

            var setStageMouseEvent = function (stage) {
                stage.addEventListener("stagemousedown", function (e) {
                    var offset = { x: stage.x - e.stageX, y: stage.y -e.stageY
                };
                stage.addEventListener("stagemousemove", function (ev) {
                    stage.x = ev.stageX + offset.x;
                    stage.y = ev.stageY + offset.y;
                    stage.update();
                });
                stage.addEventListener("stagemouseup", function (ev) {
                    stage.removeAllEventListeners("stagemousemove");
                });
            });
            }


                //#region transform coordination
                function convertScaleValue(originalPoints) {
                    var convertedPoints =[];
                    var maxX = _.max(originalPoints, function (n) {
                    return n.x;
                }).x;
                var maxY = _.max(originalPoints, function (n) {
                    return n.y;
                }).y;
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
                    var convertedPoints =[];
                    _.each(originalPoints, function (n) {
                        convertedPoints.push({
                            t: n.t,
                                x: chartSizeInfo.axisYPadding +n.x,
                                y: chartSizeInfo.canvasSizeY -chartSizeInfo.axisXPadding -n.y,
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
                    $scope.index = reverse ? currentIndex - appendCount : currentIndex +appendCount

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

                var px =[0, 0, 0, 0, 0, 1, 2, -1, - 2];
                var py =[0, 1, 2, -1, -2, 0, 0, 0, 0];
                //var px = [0, 0, 0, 0, 0, 1, 1,1, -1,-1,-1, 2,-2];
                //var py = [0, 1, 2, -1, -2, 0,1,-1, 0,1,-1,0,0];
                //#region draw all plots
                function drawAllPlots(points, xMax, xMin, yMax, yMin, currentIndex, appendCount) {
                    //plot data
                    _.each(points, function (n, i) {
                        if (currentIndex <= i && i < currentIndex +appendCount) {
                        //plot + or clear + on canvas.
                        for (var p = 0; p < px.length; p++) {
                            //do not draw if value is out of canvas size 
                            if ((n.x +px[p]) < chartSizeInfo.canvasSizeX) {
                                if (reverse) {
                                    clearImagePlot(stageImgData, ((n.x + px[p]) +(n.y +py[p]) * chartSizeInfo.canvasSizeX) * 4);
                                }
                                else {
                                    //setImagePlot(stageImgData, ((n.x + px[p]) + (n.y + py[p]) * chartSizeInfo.canvasSizeX) * 4);
                            }
                        }
                    }
                        if (i % 8 == 0) {
                            drawPlot(n, i);
                        }
                    }

                });
                    $scope.stage.update();
                    //$scope.stage_background.update();

                    //Animation
                    //circleShape.x = circleShape.x + 1;
                    //$scope.stage_sub.update();

                    //ctx.putImageData(stageImgData, 0, 0)

                    $scope.fps = createjs.Ticker.getMeasuredFPS();
                    $scope.tickTime = createjs.Ticker.getMeasuredTickTime();
                    $scope.$apply();
            }


                function setImagePlot(image, index) {
                    image.data[index +0]= 255;
                    image.data[index +1]= 0;
                    image.data[index +2]= 0;
                    image.data[index +3]= 255;
            }

            function clearImagePlot(image, index) {
                image.data[index +0]= 255;
                image.data[index +1]= 255;
                image.data[index +2]= 255;
                image.data[index +3]= 255;
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
                function drawAxis(zoomRatio) {
                    $scope.stage_background.removeAllChildren();
                    let g = new createjs.Graphics();

                    drawAxisX(g, zoomRatio);
                    drawAxisY(g, zoomRatio);

                    var s = new createjs.Shape(g);

                    s.draw(ctx_back);
                }

            function drawAxisX(g,zoomRatio) {
                let xBase = chartSizeInfo.canvasSizeY -chartSizeInfo.axisXPadding;
                let span = 60;
                let axisCount = xBase / span;
                let startX = 0;
                g.s("Gray").setStrokeDash([4, 2], 0).setStrokeStyle(1); //color dot thickness

                for (let i = -axisCount * 3; i < axisCount * 3; i++) {
                    g.mt(-chartSizeInfo.canvasSizeX * 3, xBase - i * span);
                    g.lt(chartSizeInfo.canvasSizeX * 4, xBase - i * span);
                }
                let lineShape = new createjs.Shape(g);
                $scope.stage_background.addChild(lineShape);
            }

            function drawAxisY(g, zoomRatio) {
                let base = chartSizeInfo.axisYPadding;
                let span = 60  / zoomRatio;
                let axisCount = chartSizeInfo.canvasSizeX / span;
                g.s("Gray").setStrokeDash([4, 2], 0).setStrokeStyle(1); //color dot thickness

                for (let i = -axisCount * 3; i < axisCount * 3; i++) {
                    g.mt(base + i * span, -chartSizeInfo.canvasSizeY * 3);
                    g.lt(base + i * span, chartSizeInfo.canvasSizeY * 4);
                }
                let lineShape = new createjs.Shape(g);
                $scope.stage_background.addChild(lineShape);
            }
            //#endregion

            //#region draw white canvas
            var drawWhiteCanvas = function () {
                stageImgData = ctx.createImageData(chartSizeInfo.canvasSizeX, chartSizeInfo.canvasSizeY);
                $scope.stage.removeAllChildren();
                $scope.stage.update();
            }
            
            //#endregion
            var circleShape;
            var rectangleShape;
            function drawPlot(p, i) {
                g = new createjs.Graphics();
                g.beginFill("Red").drawCircle(p.x, p.y, Number(2/zoom).toFixed(3));
                circleShape = new createjs.Shape(g);
                setElementEventListner(circleShape);
                $scope.stage.addChild(circleShape);
            }

            function setElementEventListner(element) {
                element.addEventListener("mouseover", function (e) {
                    //let i = e.target.parent.chartIndex;
                    //let item = $scope.collection[i];
                    //let itemDateInfo = {
                    //    startDate: item.start,
                    //    endDate: item.end
                    //}
                    //let itemLength = TimePosSynchronizerService.calculateItemLength(itemDateInfo, chartSizeInfo, termSizeInfo);

                    //if (e.target.name === LEFT_EDGE_NAME) {
                    //    e.target.graphics.f("Red").rc(itemLength.x, calculateYPosition(i) + 3, EDGE_WIDTH, tableSizeInfo.rowHeight - 7, 5, 0, 0, 5);
                    //}
                    //else if (e.target.name === CENTER_RECTANGLE_NAME) {
                    //    e.target.graphics.f("Red").dr(itemLength.x + EDGE_WIDTH, calculateYPosition(i) + 3, itemLength.w - EDGE_WIDTH * 2, tableSizeInfo.rowHeight - 7);
                    //}///
                    //else if (e.target.name === RIGHT_EDGE_NAME) {
                    //    e.target.graphics.f("Red").rc(itemLength.x + itemLength.w - EDGE_WIDTH, calculateYPosition(i) + 3, EDGE_WIDTH, tableSizeInfo.rowHeight - 7, 0, 5, 5, 0);
                    //}
                });
                element.addEventListener("mouseout", function (e) {
                    //Recovery
                    //let i = e.target.parent.chartIndex;
                    //let item = $scope.collection[i];
                    //let itemDateInfo = {
                    //    startDate: item.start,
                    //    endDate: item.end
                    //}
                    //let itemLength = TimePosSynchronizerService.calculateItemLength(itemDateInfo, chartSizeInfo, termSizeInfo);

                    //if (e.target.name === LEFT_EDGE_NAME) {
                    //    e.target.graphics.f("Pink").rc(itemLength.x, calculateYPosition(i) + 3, EDGE_WIDTH, tableSizeInfo.rowHeight - 7, 5, 0, 0, 5);
                    //}
                    //else if (e.target.name === CENTER_RECTANGLE_NAME) {
                    //    e.target.graphics.f("Pink").dr(itemLength.x + EDGE_WIDTH, calculateYPosition(i) + 3, itemLength.w - EDGE_WIDTH * 2, tableSizeInfo.rowHeight -7);
                    //}///
                    //else if (e.target.name === RIGHT_EDGE_NAME) {
                    //    e.target.graphics.f("Pink").rc(itemLength.x + itemLength.w - EDGE_WIDTH, calculateYPosition(i) + 3, EDGE_WIDTH, tableSizeInfo.rowHeight - 7, 0, 5, 5, 0);
                    //}
                });
            }
        }],
    };
});
