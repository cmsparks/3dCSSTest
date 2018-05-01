let scene;
let sceneCss;
let camera;
let clock;
let GLRenderer, CSSRenderer;

init();
animate();
function init() {
	scene = new THREE.Scene();
	sceneCss = new THREE.Scene();
	clock = new THREE.Clock();

	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 10000 );
	camera.position.set(5,5,5)
	controls = new THREE.FirstPersonControls( camera );
	controls.movementSpeed = 500;
	controls.lookSpeed = .3;
	controls.lookVertical = true;

	initMeshGeometry();

	//init3dDOM();

	CSSRenderer = new THREE.CSS3DRenderer();
	CSSRenderer.setSize(window.innerWidth, window.innerHeight)
	CSSRenderer.domElement.style.position = 'absolute';
	CSSRenderer.domElement.style.top = 0;
	document.body.appendChild(CSSRenderer.domElement);

	GLRenderer = new THREE.WebGLRenderer();
	GLRenderer.setClearColor(0xffffffff, 1);
	GLRenderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( GLRenderer.domElement );
	window.addEventListener( 'resize', onWindowResize, false );

}

function initMeshGeometry() {

	let geometry = new THREE.BoxBufferGeometry( 1, 1, 1, 10, 10, 10);
	let material = new THREE.MeshPhongMaterial( {color: 0xff00ff} );
	cube = new THREE.Mesh( geometry, material );
	cube.scale.set(10,10,10);
	scene.add( cube );
	let snowmat;
	let loader = new THREE.TextureLoader();
	loader.load(
		// resource URL
		'assets/terrain_tile_build/snow_terrain.png',

		// onLoad callback
		function ( texture ) {
			// in this example we create the material when the texture is loaded
			snowmat = new THREE.MeshPhongMaterial( {
				map: texture
			 } );
		},

		// onProgress callback currently not supported
		undefined,

		// onError callback
		function ( err ) {
			console.error( 'An error happened.' );
		}
	);


	let objloader = new THREE.OBJLoader()
	objloader.load('assets/terrain_tile_build/snow_terrain.obj', function (object) {
		object.scale.set(100,100,100)
		object.children[0].material = snowmat;
		scene.add( object );
		console.log(object)
	},function ( xhr ) {

		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

	},
	// called when loading has errors
	function ( error ) {

		console.log( 'An error happened' );

	});
	var lights = [];
		lights[ 0 ] = new THREE.PointLight( 0x888888, 2, 0 );
		lights[ 1 ] = new THREE.PointLight( 0x888888, 2, 0 );
		lights[ 2 ] = new THREE.PointLight( 0x888888, 2, 0 );
		lights[ 0 ].position.set( 100, 0, 0 );
		lights[ 1 ].position.set( 110, 200, 110 );
		lights[ 2 ].position.set( - 110, - 200, - 110 );
		scene.add( lights[ 0 ] );
		scene.add( lights[ 1 ] );
		scene.add( lights[ 2 ] );
}

function init3dDOM() {
	let element = document.createElement( 'div' );
	element.style.width = '100px';
	element.style.height = '100px';
	element.style.background = new THREE.Color(Math.random() * 0xffffff).getStyle();

	var object = new THREE.CSS3DObject( element );
	object.position.x = 0;
	object.position.y = 0;
	object.position.z = 0;
	object.rotation.x = 0;
	object.rotation.y = 0;
	object.rotation.z = 0;
	sceneCss.add(object)
}

function onWindowResize(){

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    GLRenderer.setSize( window.innerWidth, window.innerHeight );
    CSSRenderer.setSize( window.innerWidth, window.innerHeight );
}

function animate() {
	requestAnimationFrame( animate );
	controls.update( clock.getDelta() );
	GLRenderer.render( scene, camera );
	CSSRenderer.render( sceneCss, camera );
}