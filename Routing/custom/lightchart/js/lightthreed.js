
main.directive('lightThreed', function () {
    return {
        restrict: 'EA',
        //replace:false,
        controller: ['$scope', '$rootScope', '$timeout', '$element', 'UnitDrawService', function ($scope, $rootScope, $timeout, $element, UnitDrawService) {

            $scope.ThreeD = { x: 0, y: 0, z: 0 };
            initialize();
    
            function initialize()
            {
                $timeout(function (n) {
                    initialize_config();
                    initialize_scene();
                    initialize_model();
                    animate();
                })
    
            }

            function initialize_config() {
                // Scene variables
                $scope.theeDElement = {
                    //width: $element[0].offsetWidth,
                    //height: $element[0].offsetHeight,
                    width: 1000,
                    height: 800,
                    container: angular.element('<div>')[0],
                    renderer: new THREE.WebGLRenderer(),
                    scene: new THREE.Scene(),
                    camera: null,
                    controls: null,
                    backgroundColor: '#FF0000'
                };
            }

            function initialize_scene()
            {
                
                //Container
                $scope.theeDElement.container = angular.element('<div>')[0];
                $element[0].appendChild($scope.theeDElement.container);
                $scope.theeDElement.container.addEventListener('mousedown', mousedownPosition, false);
                $scope.theeDElement.container.addEventListener('mousemove', mousemovePosition, false);
                $scope.theeDElement.container.addEventListener('resize', containerResize, false);
                //$scope.theeDElement.container.addEventListener('mouseout', mouseoutPosition, false);

                //Camera
                $scope.theeDElement.camera = new THREE.PerspectiveCamera(90, $scope.theeDElement.width / $scope.theeDElement.height, 1, 1000);
                $scope.theeDElement.camera.up.set(0, 0, 1);//Z axis up
                $scope.theeDElement.camera.position.x = 40;
                $scope.theeDElement.camera.position.y = -40;
                $scope.theeDElement.camera.position.z = 30;

                $scope.ThreeD.x = $scope.theeDElement.camera.position.x;
                $scope.ThreeD.y = $scope.theeDElement.camera.position.y;
                $scope.ThreeD.z = $scope.theeDElement.camera.position.z;

                //Mouse Operation for camera
                $scope.theeDElement.controls = new THREE.OrbitControls($scope.theeDElement.camera);

                //Grid
                var grid = new THREE.GridHelper(200, 50);
                grid.geometry.rotateX(Math.PI / 2);// XY Grid. default is XZ.
                $scope.theeDElement.scene.add(grid);

                //Axis
                var axis = new THREE.AxisHelper(100);
                axis.position.set(0, 0, 0);
                $scope.theeDElement.scene.add(axis);

                //Renderer
                $scope.theeDElement.renderer.setSize($scope.theeDElement.width, $scope.theeDElement.height);
                $scope.theeDElement.renderer.setClearColor($scope.backgroundColor);
                $scope.theeDElement.container.appendChild($scope.theeDElement.renderer.domElement);
            }

            function render() {
                $scope.$apply();
                $scope.theeDElement.controls.update();
                $scope.theeDElement.camera.lookAt($scope.theeDElement.scene.position);

                // Traverse the scene, rotate the Mesh object(s)
                $scope.theeDElement.scene.traverse(function (element) {
                    $scope.theeDElement.renderer.render($scope.theeDElement.scene, $scope.theeDElement.camera);
                });

            };
            
            function animate() {
                requestAnimationFrame(animate);
                render();
            };

            function initialize_model() {
                UnitDrawService.createUnits($scope.theeDElement);
                //for (var i = 0; i < 5; i++)
                //{
                //    //Size
                //    geometry = new THREE.BoxGeometry(1/2, 1/2, 1/2);
                //    material = new THREE.MeshBasicMaterial({
                //        color: '#FF0000'
                //    });

                //    object = new THREE.Mesh(geometry, material);
                //    object.name = i + "imnida";
                //    //Position
                //    object.position.x = i;
                //    object.position.y = i;
                //    object.position.z = i;

                //    $scope.theeDElement.scene.add(object);
                //}
            }
            $scope.point = {};


            function getIntersectsFromEvent(e) {
                var rect = e.target.getBoundingClientRect();

                var x = e.clientX - rect.left;
                var y = e.clientY - rect.top;
                $scope.point = { x: x.toFixed(2), y: y.toFixed(2) };

                var mouse = new THREE.Vector2();
                let container = $scope.theeDElement.container;
                mouse.x = (x / rect.width) * 2 - 1;
                mouse.y = -(y / rect.height) * 2 + 1;
                //mouse.x = (x / window.innerWidth) * 2 - 1;
                //mouse.y = -(y / window.innerHeight) * 2 + 1;

                $scope.mousepoint = { x: mouse.x, y: mouse.y };
                $scope.$apply();
                // Raycasterインスタンス作成
                var raycaster = new THREE.Raycaster();
                // 取得したX、Y座標でrayの位置を更新
                // cameraは作成済みのThree.jsのカメラ
                raycaster.setFromCamera(mouse, $scope.theeDElement.camera);
                // オブジェクトの取得
                // sceneは作成済みのThree.jsのシーン
                var intersects = raycaster.intersectObjects($scope.theeDElement.scene.children);
                return intersects;
            }

            function containerResize(e) {
                let width = $scope.theeDElement.container.width();
                let height = $scope.theeDElement.container.height();
                $scope.theeDElement.camera.aspect = width / height;
                $scope.theeDElement.camera.updateProjectionMatrix();
                $scope.theeDElement.renderer.render(scene, camera);
            }

            function mousemovePosition(e) {
                let intersects = getIntersectsFromEvent(e); 
                if (intersects.length > 0) {
                    _.each(intersects, function (n) {
                        if (n.object.name != '') {
                            var color = new THREE.Color('skyblue');
                            n.object.material.color = color;
                        }
                    })
                }
            }

            function mousedownPosition(e) {
                let intersects = getIntersectsFromEvent(e);
                if (intersects.length > 0) {
                    _.each(intersects, function (n) {
                        if (n.object.name != '') {
                            alert(n.object.name);
                            var color = new THREE.Color('skyblue');
                            n.object.material.color = color;
                        }
                    })
                }
            }

            function mouseoutPosition(e) {
                let intersects = getIntersectsFromEvent(e);
                if (intersects.length > 0) {
                    _.each(intersects, function (n) {
                        if (n.object.name != '') {
                            alert(n.object.name);
                            var color = new THREE.Color('red');
                            n.object.material.color = color;
                        }
                    })
                }
            }


        }],
        link: function (scope, element, attrs) {
       
        }
    };

});