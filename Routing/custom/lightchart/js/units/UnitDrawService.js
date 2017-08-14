main.service('UnitDrawService', function () {
    this.createUnits = function (threeDElement) {
        createB(threeDElement);
        createL(threeDElement);
        createW(threeDElement);
        createR(threeDElement);
        createLaser(threeDElement);
        createA(threeDElement);
        createF(threeDElement);
    }
    var createB = function (t) {
        var cubeGeo = new THREE.CubeGeometry(60, 80, 50); //x,y,z
        material = new THREE.MeshBasicMaterial({
            color: '#00FF00',
            wireframe: true
        });
        var cube = new THREE.Mesh(cubeGeo, material);
        cube.position.z = 15;
        t.scene.add(cube);

        var cubeGeo = new THREE.CubeGeometry(60, 20, 50); //x,y,z
        material = new THREE.MeshBasicMaterial({
            color: '#00FF00',
            wireframe: true
        });
        var cube = new THREE.Mesh(cubeGeo, material);
        cube.position.y = -50;
        cube.position.z = 15;
        t.scene.add(cube);

        var cubeGeo = new THREE.CubeGeometry(60, 20, 50); //x,y,z
        material = new THREE.MeshBasicMaterial({
            color: '#00FF00',
            wireframe: true
        });
        var cube = new THREE.Mesh(cubeGeo, material);
        cube.position.y = 40;
        cube.position.z = 15;
        t.scene.add(cube);
    }

    var createL = function (t) {
        var cylinder = new THREE.Mesh(
          new THREE.CylinderGeometry(8, 8, 20, 50),//top radius, bottom radius, height, radius segments
          new THREE.MeshBasicMaterial({color: '#00ff00' })
        );
        cylinder.rotation.x = Math.PI / 2;
        cylinder.position.y = 15;
        cylinder.position.z = 20;
        t.scene.add(cylinder);

        var cylinder = new THREE.Mesh(
            new THREE.CylinderGeometry(8, 2, 3, 50),//top radius, bottom radius, height, radius segments
            new THREE.MeshBasicMaterial({ color: '#00ff00', wireframe: true })
        );
        cylinder.rotation.x = Math.PI / 2;
        cylinder.position.y = 15;
        cylinder.position.z = 9;
        t.scene.add(cylinder);
    }

    var createW = function (t) {
        var cubeGeo = new THREE.CubeGeometry(30, 60, 2); //x,y,z
        material = new THREE.MeshBasicMaterial({
            color: '#0000FF',
        });
        var cube = new THREE.Mesh(cubeGeo, material);
        cube.position.z = 3;
        t.scene.add(cube)

        //chuck1
        var cubeGeo = new THREE.CubeGeometry(15, 15, 2); //x,y,z
        material = new THREE.MeshBasicMaterial({
            color: '#FF00FF',
        });
        var cube = new THREE.Mesh(cubeGeo, material);
        cube.position.y = 15;
        cube.position.z = 5;
        t.scene.add(cube)

        //chuck2
        var cubeGeo = new THREE.CubeGeometry(15, 15, 2); //x,y,z
        material = new THREE.MeshBasicMaterial({
            color: '#FF00FF',
        });
        var cube = new THREE.Mesh(cubeGeo, material);
        cube.position.y = -15;
        cube.position.z = 5;
        t.scene.add(cube)
    }


    var createR = function (t) {
        var cubeGeo = new THREE.CubeGeometry(15, 20, 2); //x,y,z
        material = new THREE.MeshBasicMaterial({
            color: '#00FFFF',
        });
        var cube = new THREE.Mesh(cubeGeo, material);
        cube.position.y = 15;
        cube.position.z = 32;
        t.scene.add(cube)
    }

    var createA = function (t) {
        var cubeGeo = new THREE.CubeGeometry(20, 20, 3); //x,y,z
        material = new THREE.MeshBasicMaterial({
            color: '#FFFF00',
        });
        var cube = new THREE.Mesh(cubeGeo, material);
        cube.position.y = -15;
        cube.position.z = 15;
        t.scene.add(cube)
    }

    var createLaser = function (t) {
        var cubeGeo = new THREE.CubeGeometry(5, 5, 50); //x,y,z
        material = new THREE.MeshBasicMaterial({
            color: '#FF0000',
        });
        var cube = new THREE.Mesh(cubeGeo, material);
        cube.position.y = 48;
        cube.position.z = 15;
        t.scene.add(cube)

        var cubeGeo = new THREE.CubeGeometry(5, 40, 2); //x,y,z
        material = new THREE.MeshBasicMaterial({
            color: '#FF0000',
        });
        var cube = new THREE.Mesh(cubeGeo, material);
        cube.position.y = 33;
        cube.position.z = 38;
        t.scene.add(cube);

        var cylinder = new THREE.Mesh(
            new THREE.CylinderGeometry(2, 1, 3, 50),//top radius, bottom radius, height, radius segments
            new THREE.MeshBasicMaterial({ color: '#FF0000', wireframe: true })
        );
        cylinder.rotation.x = Math.PI / 2;
        cylinder.position.y = 15;
        cylinder.position.z = 36;
        t.scene.add(cylinder);
    }
    
    var createF = function (t) {
        var cubeGeo = new THREE.PlaneGeometry(60, 110); //x,y,z
        material = new THREE.MeshBasicMaterial({
            color: '#FFFFFF',
            map: THREE.ImageUtils.loadTexture('/custom/resource/bear.png')
        });
        //material.map.needsUpdate = true; //ADDED
        var cube = new THREE.Mesh(cubeGeo, material)
        cube.rotation.y = Math.PI;
        cube.position.y = -5;
        cube.position.z = -10;
        t.scene.add(cube)
    }
});