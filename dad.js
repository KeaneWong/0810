var Colors = {
	red:0xf25346,
	white:0xd8d0d1,
	brown:0x59332e,
	pink:0xF5986E,
	brownDark:0x23190f,
	blue:0x68c3c0,
	seablue: 0x0077be
};
var startTime = new Date().getTime();
var imageOcean = new THREE.TextureLoader().load('ocean.jpg');
imageOcean.wrapS = THREE.RepeatWrapping;
imageOcean.wrapT = THREE.RepeatWrapping;

if(imageOcean == null){

	console.log("error in loading" );
}
var uniforms = {
	"u_heightMap":{ type: "t", value: imageOcean},
	"u_time" : {type: "f",value: 0.0},
	//delta:{value:0}
};

	window.addEventListener('load',init,false);
	// init();
	function init(){

		createScene();

		createLights();

		createSea();

		animate();
	}

	var scene, camera, fieldOfView, aspectRatio, nearPlane, farPlane, HEIGHT, WIDTH, renderer, container;


	function createScene(){
		console.log('here');
		HEIGHT = window.innerHeight;
		WIDTH = window.innerWidth;

		scene = new THREE.Scene();

		aspectRatio = WIDTH/HEIGHT;
		fieldOfView = 60;
		nearPlane = 1;
		farPlane = 1000;
		camera = new THREE.PerspectiveCamera(fieldOfView,aspectRatio,nearPlane,farPlane);
		camera.position.x= 0;
		camera.position.y = 150;
		camera.position.z = 500;

		renderer= new THREE.WebGLRenderer({ antialias: true});
		renderer.setSize(WIDTH, HEIGHT);
		renderer.shadowMap.enabled = true;
		renderer.setClearColor(Colors.blue,1);
		container = document.getElementById('world');
		container.appendChild(renderer.domElement);
		window.addEventListener('resize',handleWindowResize, false);
	}

	function handleWindowResize(){
	HEIGHT = window.innerHeight;
	WIDTH = window.innerWidth;
	renderer.setSize(WIDTH, HEIGHT);
	camera.aspect = WIDTH / HEIGHT;
	camera.updateProjectionMatrix();

	}

	Sea = function(){
		var seaGeo = new THREE.PlaneGeometry(1000,1000,32,32);
	//	var material = new THREE.MeshPhongMaterial({color:Colors.seablue, shininess: 30, transparent:true});
		var material = new THREE.ShaderMaterial({vertexShader: document.getElementById('vertexShader').textContent, 
												fragmentShader: document.getElementById('fragment_shader').textContent,
												side: THREE.DoubleSide,
												wireframe: true,
												uniforms: uniforms
												})
		this.mesh = new THREE.Mesh(seaGeo,material);
		this.mesh.position.y = 100;
		this.mesh.rotation.x= -3.14/2.0;
		this.mesh.receiveShadow = true;

	}
	Boat = function(){
		var boatGeo = new THREE.BoxGeometry(30,10,10);
		var boatMat = new THREE.MeshLambertMaterial({color: Colors.brown});
		var boatPart = new THREE.BoxGeometry(40,10,20);
		var boatPeice = new THREE.Mesh(boatPart, boatMat);
		boatPeice.position.y += 5;
		this.mesh = new THREE.Mesh(boatGeo,boatMat);
		this.mesh.add(boatPeice);
		var a = new THREE.Vector3 (0,130,300);
		var b = new THREE.Vector3 (0,150,300);
		var c = new THREE.Vector3 (20,130,300);
		var sailGeo = new THREE.Geometry();
		sailGeo.vertices.push(a);
		sailGeo.vertices.push(b);
		sailGeo.vertices.push(c);
		sailGeo.faces.push(new THREE.Face3(0,1,2));
		sailGeo.computeBoundingSphere();
		var sailMat = new THREE.MeshBasicMaterial({color:Colors.brown, side: THREE.DoubleSide});
		var sail = new THREE.Mesh(sailGeo,sailMat);

		this.mesh.add(sail);

		this.recieveShadow = true;
		this.mesh.position.y = 130;
		this.mesh.position.z = 300;
		sail.position.y = 150;
		sail.position.z = 300;
		console.log(sail.position);
		console.log(this.mesh.position);
		var person1 = new Person();
		person1.mesh.position.y+=13;
		person1.mesh.position.x-=7;
		this.mesh.add(person1.mesh);
		var person2 = new Person();
		person2.mesh.position.y+=13;
		//person2.mesh.position.x;
		this.mesh.add(person2.mesh);
		var person3 = new Person();
		person3.mesh.position.y+=13;
		person3.mesh.position.x+=7;
		this.mesh.add(person3.mesh);
		



	}

	Person = function(){
		var geom = new THREE.BoxGeometry(6,6,0.5);
		var mater = new THREE.MeshBasicMaterial({color:Colors.white});
		this.mesh = new THREE.Mesh(geom,mater);
		this.mesh.recieveShadow = true;
		var hairGeo = new THREE.BoxGeometry(6,2,.5);
		var hairMat = new THREE.MeshBasicMaterial({color: 0x000000});
		var hair = new THREE.Mesh(hairGeo,hairMat);
		this.mesh.add(hair);
		hair.position.y+=2;
		


	}
	
	var sea;
	function createSea(){
		sea = new Sea();
		boat = new Boat();
		
		sea.mesh.position.y = 100;
		scene.add(sea.mesh);
		scene.add(boat.mesh);
		

	}

	function createLights(){
		hemisphereLight= new THREE.HemisphereLight(0xffffff,0xffffff,1);
		hemisphereLight.color.setHSL(0.6,1,0.6);
		hemisphereLight.groundColor.setHSL(.095,1.0,0.75)
		shadowLight = new THREE.DirectionalLight(0xffffff,.9);
		shadowLight.position.set(150,350,350);
		shadowLight.castShadow=true;
		shadowLight.shadow.camera.left=-400;
		shadowLight.shadow.camera.right=400;
		shadowLight.shadow.camera.top = 400;
		shadowLight.shadow.camera.bottom= -400;
		shadowLight.shadow.camera.near = 1;
		shadowLight.shadow.camera.far = 1000;

		shadowLight.shadow.mapSize.width = 2048;
		shadowLight.shadow.mapSize.height = 2048;

		scene.add(hemisphereLight);
		scene.add(shadowLight);
	}
	var time;
	function animate(){
		time = new Date().getTime() - startTime;
		boat.mesh.position.y += Math.sin(time/1000)/15;
		sea.mesh.material.uniforms.u_time.value = time * 0.00250;
		//console.log(sea.mesh.material.uniforms.u_time);
		renderer.render(scene,camera);
		if(sea.mesh.material.uniforms.u_heightMap.value == null){

			//console.log("w");
			//heightmap is null. u_time is working
		}
		window.requestAnimationFrame(animate);

	}
	


