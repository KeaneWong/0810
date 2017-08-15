var Colors = {
	red:0xf25346,
	white:0xd8d0d1,
	brown:0x59332e,
	pink:0xF5986E,
	brownDark:0x23190f,
	blue:0x68c3c0,
};

	window.addEventListener('load',init,false);
	init();
	function init(){

		createScene();

		createLights();

		createSea();

	}

	var scene, camera, fieldOfView, aspectRatio, nearPlane, farPlane, HEIGHT, WIDTH, renderer, container;

	function createScene(){
		HEIGHT = window.innerHeight;
		WIDTH = window.innerWidth;

		scene = new THREE.Scene();

		aspectRatio = WIDTH/HEIGHT;
		fieldOfView = 60;
		nearPlane = 1;
		farPlane = 1000;
		camera = THREE.PerspectiveCamera(fieldOfView,aspectRatio,nearPlane,farPlane);
		camera.position.x= 0;
		camera.position.y = 200;
		camera.position.z = 100;


		renderer= new THREE.WebGLRenderer({ antialias: true});
		renderer.setSize(WIDTH, HEIGHT);
		renderer.shadowMap.enabled = true;
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
		var seaGeo = new THREE.PlaneGeometry(500,500,32,32);
		var material = new THREE.ShaderMaterial({
       uniforms: uniforms,
       side: THREE.DoubleSide, 
       wireframe: true,
       vertexShader: document.getElementById('vertexShader').textContent,
       fragmentShader: document.getElementById('fragment_shader').textContent
     });
		this.mesh = new THREE.Mesh(seaGeo,material);
		this.mesh.position.y = 100;
		this.mesh.rotation.x= -3.14/2.0;
		this.mesh.receiveShadow = true;

	}
	var sea;
	function createSea(){
		sea = new Sea();

		sea.mesh.position.y = 100;
		scene.add(sea.mesh);

	}

	function createLights(){
		hemisphereLight= new THREE.HemisphereLight(0xaaaaaa,0x0000000,.9);
		shadowLight = new THREE.DirectionalLight(0xffffff,.9);
		shadowLight.position.set(150,350,350);
		shadowLight.castShadow=true;
		shadowLight.shadow.camera.left=-400;
		shadowLight.shadow.camera.right=400;
		shadowLight.shadow.camera.top = 400;
		shadowLight.shadow.camera.bottom= -400;
		shadowLight.shadow.camera.near = 1;
		shadowLight.shadow.camera.far = 1000;

		shadowLight.shadow.mapSize.width = 1024;
		shadowLight.shadow.mapSize.height = 1024;

		scene.add(hemisphereLight);
		scene.add(shadowLight);
	}

	function animate(){
		renderer.render(scene,camera);
		window.requestAnimationFrame(animate);

	}
	


