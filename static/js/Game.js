/*
    class Game
*/

// TODO: mechanics to finish
// Its easy to hack now
function Game() {

    this.tabPosition = [[200, 250, -200], [200, 250, 600]];
    
    var plansza;
    var tabCamera = []
    var scene;
    var camera;
    var renderer;
    var geom;
    var material;
    // handle camera changing size
    var arrow = {
        left: false,
        right: false,
        up: false,
        down: false
    }
    var initPawns;
    var centerVect;
    var currentPawn;
    var selectMaterial;

    var szachownica;
    // this.pawns;
    var correct = 25;
    var playerColor;

    function initEngine() {
        scene = new THREE.Scene();

        this.camera = camera; // ZMIENNA GLOBALNA
        camera = new THREE.PerspectiveCamera(
            60,
            window.innerWidth / window.innerHeight, 
            0.1, 
            10000 
        );

        centerVect = new THREE.Vector3(200, 0, 200)

        camera.position.x = 200;
        camera.position.y = 250;
        camera.position.z = -200;
        camera.lookAt(centerVect);


        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setClearColor(0x000000);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = true
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        document.getElementById("main").appendChild(renderer.domElement);


    }
    initEngine()

    function initMaterials() {
        material = new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            side: THREE.DoubleSide,
            wireframe: true

        })


    }
    initMaterials();

    function initObjects() {
        geom = new THREE.PlaneBufferGeometry(400, 400, 8, 8);

        // var axis = new THREE.AxisHelper(2000); 
        // scene.add(axis);

        var boxGeometry = new THREE.BoxGeometry(50, 1, 50, 10, 20, 20);
        var cylinderGeometry = new THREE.CylinderGeometry(20, 20, 20)

        var whiteMaterial = new THREE.MeshPhongMaterial({
            color: 0xffffff, side: THREE.DoubleSide
        });
        var darkWhiteMaterial = new THREE.MeshPhongMaterial({
            color: 0xdddddd, side: THREE.DoubleSide
        });
        var blackMaterial = new THREE.MeshPhongMaterial({
            color: 0x111111, side: THREE.DoubleSide
        });
        var greyMaterial = new THREE.MeshPhongMaterial({
            color: 0xcccccc, side: THREE.DoubleSide
        });
        selectMaterial = new THREE.MeshPhongMaterial({
            color: 0x68838B, side: THREE.DoubleSide
        });

        var whiteFieldMesh = new THREE.Mesh(boxGeometry, darkWhiteMaterial)
        var blackFieldMesh = new THREE.Mesh(boxGeometry, blackMaterial)
        whiteFieldMesh.receiveShadow = true;
        blackFieldMesh.receiveShadow = true;
        
        // blackFieldMesh.castShadow = true;
        // whiteFieldMesh.castShadow = true;
        

        /* Generowanie szachownicy */
        szachownica = [

            [1, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 1, 0, 1]

        ];

        pawns = [

            [0, 2, 0, 2, 0, 2, 0, 2],
            [2, 0, 2, 0, 2, 0, 2, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0]

        ];



        // TODO - Delete magic numbers from generating

        function initPola() {
            for (var x1 = 0; x1 < 8; x1++) {
                //szachownica[x1] = [];
                for (var x2 = 0; x2 < 8; x2++) {
                    //szachownica[x1].push(0);


                    var whiteFieldClone = blackFieldMesh.clone();
                    var blackFieldClone = whiteFieldMesh.clone();

                    // | pomaga identyfikacji
                    whiteFieldClone.name = "white|" + x1 + x2
                    blackFieldClone.name = "black|" + x1 + x2


                    ///// POLA



                    if (szachownica[x1][x2] == 1) {
                        whiteFieldClone.position.set(x2 * 50 + 50 - correct, 0, x1 * 50 - correct + 50)
                        scene.add(whiteFieldClone)
                    } else {
                        blackFieldClone.position.set(x2 * 50 + 50 - correct, 0, x1 * 50 - correct + 50)
                        scene.add(blackFieldClone)
                    }
                }
            }
        }
        initPola();

        var whitePawn = new THREE.Mesh(cylinderGeometry, whiteMaterial)
        var blackPawn = new THREE.Mesh(cylinderGeometry, blackMaterial)

        whitePawn.castShadow = true;
        blackPawn.castShadow = true;
        // whitePawn.receiveShadow = true;
        // blackPawn.receiveShadow = true;


        ///// pawns
        initPawns = () => {

            // http://stackoverflow.com/questions/11678497/cant-remove-objects-using-three-js
            var obj, i;
            for (i = scene.children.length - 1; i >= 0; i--) {
                obj = scene.children[i];
                if(obj.geometry){ // light has no geometry, caused err
                    if (obj.geometry.type == "CylinderGeometry") {
                        scene.remove(obj)
                    }
                }
            }
            for (var x1 = 0; x1 < 8; x1++) {
                //szachownica[x1] = [];
                for (var x2 = 0; x2 < 8; x2++) {
                    //szachownica[x1].push(0);


                    var whiteClone = whitePawn.clone();
                    var blackClone = blackPawn.clone();

                    blackClone.name = "black|" + x1 + x2;
                    whiteClone.name = "white|" + x1 + x2;

                    if (pawns[x1][x2] !== 0) {
                        if (pawns[x1][x2] == 1) {
                            blackClone.position.set(x2 * 50 + 50 - correct, 10, x1 * 50 - correct + 50)
                            scene.add(blackClone)
                        } else {
                            whiteClone.position.set(x2 * 50 + 50 - correct, 10, x1 * 50 - correct + 50)
                            scene.add(whiteClone)
                        }
                    }
                }
            }
        }
        //console.log(szachownica.join("\n"))

        // light
        function addLight(){
            var directionalLight = new THREE.PointLight( 0xffffff, 2, 2400, Math.PI / 2);
            directionalLight.castShadow = true;
            scene.add( directionalLight );
            directionalLight.position.set(200,200,200)

            directionalLight.shadow.mapSize.width = 2048;  // default
            directionalLight.shadow.mapSize.height = 2048; // default

            var ambientLight = new THREE.AmbientLight( 0xffffff, 0.5, 1000, Math.PI / 2);
            ambientLight.position.set(200,400,200)
            scene.add(ambientLight);
            
        }
        addLight();
       

    }
    initObjects();


    function initEvents() {
        var pionClicked = false;
        var previousMaterial;

        // Raycaster
        function findRaycasted(event) {

            var raycaster = new THREE.Raycaster(); // obiekt symulujący "rzucanie" promieni
            var mouseVector = new THREE.Vector2() // wektor (x,y) wykorzystany będzie do określenie pozycji myszy na ekranie

            mouseVector.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouseVector.y = -(event.clientY / window.innerHeight) * 2 + 1;

            raycaster.setFromCamera(mouseVector, camera);

            var intersects = raycaster.intersectObjects(scene.children);

            if (intersects.length > 0) {
                return intersects[0].object;
            }

        }

        // Game mechanics focuses here
        var enemyLeft;
        var enemyRight;
        var xPion;
        var zPion;
        var color;
        var colorNum;
        var jumpConditionX;
        var jumpConditionZ;

        function selectMesh(obj) {

            if (obj) {
                if (obj.geometry.type === "CylinderGeometry") {
                    // Jezeli kliknal na swoj
                    if (obj.name.split("|")[0] == game.playerColor) {
                        previousMaterial = obj.material;
                        obj.material = selectMaterial;
                        // Podmieniam currentPawn na nowy pionek
                        currentPawn = obj;
                        pionClicked = true;

                        color = currentPawn.name.split("|")[0]
                        // colorNum;
                        // sprawdzam po kolorze jaka liczbe wstawic do tablicy 
                        if (color == "white") {
                            colorNum = 2;
                        }
                        if (color == "black") {
                            colorNum = 1;
                        }
                    } else {
                        ui.viewInfo("Use " + game.playerColor + " pawns")
                    }

                    xPion = Number(currentPawn.name.split("|")[1][0])
                    zPion = Number(currentPawn.name.split("|")[1][1])

                    var oneForward;
                    if (game.playerColor === "white") {
                        oneForward = xPion + 1;
                    }
                    if (game.playerColor === "black") {
                        oneForward = xPion - 1;
                    }

                    // boolean : if enemy to beat nearby
                    enemyLeft = pawns[oneForward][zPion - 1] != colorNum && pawns[oneForward][zPion - 1] != 0 && pawns[oneForward][zPion - 1] != undefined;
                    enemyRight = pawns[oneForward][zPion + 1] != colorNum && pawns[oneForward][zPion + 1] != 0 && pawns[oneForward][zPion + 1] != undefined;

                    if (enemyLeft || enemyRight) {
                        if (enemyLeft) {
                            // console.log("enemy left")
                            // dla czarnych
                            if(game.playerColor == "black"){
                                jumpConditionX = -2;
                                jumpConditionZ = -2;
                            }
                            if(game.playerColor == "white"){
                                jumpConditionX = 2;
                                jumpConditionZ = -2;
                            }
                        }
                        if (enemyRight) {
                            // console.log("enemy right")
                            if(game.playerColor == "black"){
                                jumpConditionX = -2;
                                jumpConditionZ = 2;
                            }
                            if(game.playerColor == "white"){
                                jumpConditionX = 2;
                                jumpConditionZ = 2;
                            }    
                        }
                    }

                    // console.log(obj.name)
                }
                if (obj.geometry.type === "BoxGeometry") {

                    if (pionClicked) {

                        if (obj.name.split("|")[0] === "black") {
                            currentPawn.material = previousMaterial;

                            var x = Number(obj.name.split("|")[1][0])
                            var z = Number(obj.name.split("|")[1][1])

                            // Both whites and blacks cant move backwards
                            // for blacks same as the board - the condition is reversed

                            if (enemyLeft || enemyRight) {

                                if (game.playerColor == "black") {
                                    if (x - xPion == jumpConditionX && z - zPion == jumpConditionZ) {

                                        // TODO: stepping on your own pawns
                                        // if (pawns[xPion - 2][zPion - 2] !== 0 || pawns[xPion - 2][zPion - 2] !== 0){
                                        //     console.log("you cant step on your own pawn")
                                        // }

                                        // delete beaten pion
                                        // deletes enemy on specific direction
                                        if (enemyLeft) {
                                            pawns[xPion - 1][zPion - 1] = 0;
                                        }

                                        if (enemyRight) {
                                            pawns[xPion - 1][zPion + 1] = 0;
                                        }

                                        // update board var and sync
                                        pawns[xPion][zPion] = 0;
                                        pawns[x][z] = colorNum;
                                        currentPawn.name = currentPawn.name.slice(0, 5) + "|" + x + z;
                                        net.sync(pawns)
                                        pionClicked = false;

                                        ui.viewInfo("Enemy pawn defated!")
                                        
                                    } else {
                                        ui.viewInfo("You must defeat enemy pawn!")
                                    }
                                }

                                if (game.playerColor == "white") {
                                   
                                    if (x - xPion == jumpConditionX && z - zPion == jumpConditionZ) {
                                        // delete beaten pion
                                        // deletes enemy on specific direction
                                        if (enemyLeft) {
                                            pawns[xPion + 1][zPion - 1] = 0;
                                        }

                                        if (enemyRight) {
                                            pawns[xPion + 1][zPion + 1] = 0;
                                        }

                                        pawns[xPion][zPion] = 0;
                                        pawns[x][z] = colorNum;
                                        currentPawn.name = currentPawn.name.slice(0, 5) + "|" + x + z;
                                        net.sync(pawns)
                                        pionClicked = false;
                                    } else {
                                        ui.viewInfo("You must defeat enemy pawn!")
                                    }
                                }

                            } else {
                                var condition;
                                if (game.playerColor === "white") {
                                    condition = x - xPion === 1;
                                }
                                if (game.playerColor === "black") {
                                    condition = xPion - x === 1;
                                }
                                // console.log(game.playerColor, condition)

                                if (condition) {

                                    pawns[xPion][zPion] = 0;
                                    pawns[x][z] = colorNum;

                                    currentPawn.name = currentPawn.name.slice(0, 5) + "|" + x + z;

                                    net.sync(pawns)

                                    pionClicked = false;

                                } else {
                                    ui.viewInfo("You can jump only one field forward")
                                }
                            }

                        } else {
                            ui.viewInfo("Select white field")
                        }
                    }
                }
            }

        }
        document.addEventListener("mousedown", function (event) { selectMesh(findRaycasted(event)) }, false);


        // Arrows
        document.addEventListener("keydown", (evt) => {
            //console.log(evt)
            switch (evt.which) {
                case 37: {// left
                    //console.log("left")
                    //moveLights(selectedLight, "left");
                    arrow.left = 1;

                    break;
                }
                case 38: { // up
                    arrow.up = 1;
                    break;
                }
                case 39: {// right
                    //moveLights(selectedLight, "right")
                    arrow.right = 1;
                    break;
                }
                case 40: {// down
                    arrow.down = 1;
                    break;
                }
                default: return; // exit this handler for other keys
            }
            evt.preventDefault(); // prevent the default action (scroll / move caret)
        })

        document.addEventListener("keyup", (evt) => {
            switch (evt.which) {
                case 37: {// left
                    arrow.left = 0;
                    break;
                }
                case 38: { // up
                    arrow.up = 0;
                    break;
                }
                case 39: {// right
                    arrow.right = 0;
                    break;
                }
                case 40: {// down
                    arrow.down = 0;
                    break;
                }
                default: return; // exit this handler for other keys
            }
        })
    }
    initEvents();


    (function animateScene() {

        if (arrow.up) {
            camera.position.y += 5;
        } else if (arrow.down) {
            camera.position.y -= 5;
        }
        if (arrow.left) {
            camera.position.x += 5;
        } else if (arrow.right) {
            camera.position.x -= 5;
        }
        camera.lookAt(centerVect)

        requestAnimationFrame(animateScene);
        renderer.render(scene, camera);
        //mesh.scale.set(1, 1, 1);

        camera.updateProjectionMatrix();

    }())




    this.initPawns = initPawns;
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    this.playerColor = playerColor;

    // Po cholere to
    this.setPawns = function (newpawns) {
        pawns = newpawns;
        console.log(pawns.join("\n"))
    }
}
