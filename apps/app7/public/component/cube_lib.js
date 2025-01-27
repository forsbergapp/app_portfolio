/**
 * Cube component library
 * 
 * Original code https://github.com/stringham/rubiks-solver
 * Changes
 * Converted to one javascript module
 * Replaced event listeners with event delegation
 * Moved css to external css file and using responsive css
 * Replaced infinite loop on canvas element with setTimeout
 * Replaced canvas with svg
 * Replaced step button images with characters
 * Removed FlatCube, FlatFace FlatSticker, FlatColorPicker
 * Removed unused code
 * Replaced saving DOM element in classes with querySelector
 * Added jsdoc, es-lint and typescript support
 * Replaced function and prototype usage with classes and arrow functions
 * 
 * @module apps/app7/component/cube_lib
 */

/**
 * @import {CommonModuleCommon, COMMON_DOCUMENT}  from '../../../common_types.js'
 */

/**@type{COMMON_DOCUMENT} */
const COMMON_DOCUMENT = document;

const commonPath ='/common/js/common.js';
/**@type{CommonModuleCommon} */
const {commonWindowSetTimeout} = await import(commonPath);

const WHITE='#ffffff', YELLOW='#ffff00' , GREEN='#009900' , BLUE='#006dbf', RED='#cc0000', ORANGE='#ff8000', CLEAR = '#000000';

const clock90 =   '↷';
const counter90 = '↶';
const clock180 = '↷180°';

/**
 * @name RubiksCubeControls
 * @description RubiksCubeControls
 * @class
 */
class RubiksCubeControls {
	/**
	 * @param {*} id
 	 * @param {*} cube
	 */
	constructor(id, cube) {
		this.cube = cube;
	}
	
	/**
	 * @name setSolution
	 * @description setSolution
	 * @method
	 * @param {*} solution
	 * @returns {void}
	 */
	setSolution = (solution) =>{
		if(solution.length > 0){
			this.solution = solution.split(' ');
			this.updateStepButton();
			COMMON_DOCUMENT.querySelector('#button_controls #overlay').style.display = 'block';
		} else {
			/**@type{string[]} */
			this.solution = [];
			COMMON_DOCUMENT.querySelector('#button_controls #overlay').style.display = 'none';
		}
	};
	/**
	 * @name updateStepButton
	 * @description updateStepButton
	 * @method
	 * @returns {void}
	 */
	updateStepButton = () => {
		if(this.solution && this.solution.length > 0){
			const move = this.solution[0];
			const color = this.cube.getFaceColor(move.substr(0,1));
			COMMON_DOCUMENT.querySelector('#button_controls #button_step_info').style.backgroundColor = color;
			const bgImg = move.length == 1 ? clock90 : move[1] == '2' ? clock180 : counter90;
			COMMON_DOCUMENT.querySelector('#button_controls #button_step_move').textContent = bgImg;
			
			if(COMMON_DOCUMENT.querySelector('#button_controls #button_step')?.firstChild){
				COMMON_DOCUMENT.querySelector('#button_controls #button_step').removeChild(COMMON_DOCUMENT.querySelector('#button_controls #button_step').firstChild);
			}
			COMMON_DOCUMENT.querySelector('#button_controls #button_step').textContent= this.solution.length;
		}
	};
	/**
	 * @name nextMove
	 * @description nextMove
	 * @method
	 * @returns {void}
	 */
	nextMove = () => {
		const move = this.solution?.shift();
		this.cube.makeMove(move);
		if((this.solution?.length ??0)> 0){
			this.updateStepButton();
		}
		else {
			COMMON_DOCUMENT.querySelector('#button_controls #overlay').style.display = 'none';
		}	
	};
}

/**********************************
 * Utility Functions
 **********************************/
/**
 * @name hexToRgb
 * @description hexToRgb
 * @function
 * @param {*} hex
 * @returns {*}
 */
const hexToRgb = (hex) => {
	if(hex.length == 7){
		const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		return result ? {
			r: parseInt(result[1], 16),
			g: parseInt(result[2], 16),
			b: parseInt(result[3], 16),
			a: 1
		} : null;
	}
	else if(hex.length == 9){
		const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		return result ? {
			r: parseInt(result[1], 16),
			g: parseInt(result[2], 16),
			b: parseInt(result[3], 16),
			a: parseInt(result[4], 16)/256
		} : null;
	}
};
/**
 * @name makeRotationAffine
 * @description makeRotationAffine
 * @function
 * @param {*} x
 * @param {*} y
 * @param {*} z
 * @returns {*}
 */
const makeRotationAffine = (x,y,z) =>{
	return multiplyAffine(multiplyAffine(makeRotateAffineX(x),makeRotateAffineY(y)),makeRotateAffineZ(z));
};

/**
 * @name arrayFind
 * @description Search an array for the first element that satisfies a given condition and
 * 				return that element.
 * @function
 * @param {*} arr
 * @param {*} f
 * @returns {*}
 */
const arrayFind = (arr, f) => {
  const i = arrayFindIndex(arr, f);
  return i < 0 ? null : arr[i];
};


/**
 * @name arrayFindIndex
 * @description Search an array for the first element that satisfies a given condition and
 * 				return its index.
 * @function
 * @param {*} arr
 * @param {*} f
 * @returns {number}
 */
const arrayFindIndex = (arr, f) => {
  const l = arr.length;  // must be fixed during loop... see docs
  const arr2 = arr;
  for (let i = 0; i < l; i++) {
    if (i in arr2 && f(arr2[i], i, arr)) {
      return i;
    }
  }
  return -1;
};


/** 
 * @name AffineMatrix
 * @description This represents an affine 4x4 matrix, stored as a 3x4 matrix with the last
 * 				row implied as [0, 0, 0, 1].  This is to avoid generally unneeded work,
 * 				skipping part of the homogeneous coordinates calculations and the
 * 				homogeneous divide.  Unlike points, we use a constructor function instead
 * 				of object literals to ensure map sharing.  The matrix looks like:
 * 
 *  			e0  e1  e2  e3
 *  			e4  e5  e6  e7
 *  			e8  e9  e10 e11
 *  			0   0   0   1
 * @class
 */
class AffineMatrix {
	/**
	 * @param {*} e0
	 * @param {*} e1
	 * @param {*} e2
	 * @param {*} e3
	 * @param {*} e4
	 * @param {*} e5
	 * @param {*} e6
	 * @param {*} e7
	 * @param {*} e8
	 * @param {*} e9
	 * @param {*} e10
	 * @param {*} e11
	 */
	constructor (e0, e1, e2, e3, e4, e5, e6, e7, e8, e9, e10, e11){
		this.e0  = e0;
		this.e1  = e1;
		this.e2  = e2;
		this.e3  = e3;
		this.e4  = e4;
		this.e5  = e5;
		this.e6  = e6;
		this.e7  = e7;
		this.e8  = e8;
		this.e9  = e9;
		this.e10 = e10;
		this.e11 = e11;
	}
}

/** 
 * @name multiplyAffine
 * @description  Matrix multiplication of AffineMatrix |a| x |b|.  This is unrolled,
 * 				and includes the calculations with the implied last row.
 * @function
 * @param {*} a 
 * @param {*} b
 * @returns {*}
 */
const multiplyAffine = (a, b) => {
	// Avoid repeated property lookups by accessing into the local frame.
	const a0 = a.e0, a1 = a.e1, a2 = a.e2, a3 = a.e3, a4 = a.e4, a5 = a.e5;
	const a6 = a.e6, a7 = a.e7, a8 = a.e8, a9 = a.e9, a10 = a.e10, a11 = a.e11;
	const b0 = b.e0, b1 = b.e1, b2 = b.e2, b3 = b.e3, b4 = b.e4, b5 = b.e5;
	const b6 = b.e6, b7 = b.e7, b8 = b.e8, b9 = b.e9, b10 = b.e10, b11 = b.e11;
	return new AffineMatrix(
		a0 * b0 + a1 * b4 + a2 * b8,
		a0 * b1 + a1 * b5 + a2 * b9,
		a0 * b2 + a1 * b6 + a2 * b10,
		a0 * b3 + a1 * b7 + a2 * b11 + a3,
		a4 * b0 + a5 * b4 + a6 * b8,
		a4 * b1 + a5 * b5 + a6 * b9,
		a4 * b2 + a5 * b6 + a6 * b10,
		a4 * b3 + a5 * b7 + a6 * b11 + a7,
		a8 * b0 + a9 * b4 + a10 * b8,
		a8 * b1 + a9 * b5 + a10 * b9,
		a8 * b2 + a9 * b6 + a10 * b10,
		a8 * b3 + a9 * b7 + a10 * b11 + a11
	);
};
/** 
 * @name makeIdentityAffine
 * @description  makeIdentityAffine
 * @function
 * @returns {*}
 */
const makeIdentityAffine = () =>{
	return new AffineMatrix(
		1, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 1, 0
	);
};
/** 
 * @name makeRotateAffineX
 * @description  http://en.wikipedia.org/wiki/Rotation_matrix
 * @function
 * @param {*} theta
 * @returns {*}
 */
const makeRotateAffineX = theta => {
	const s = Math.sin(theta);
	const c = Math.cos(theta);
	return new AffineMatrix(
		1, 0,  0, 0,
		0, c, -s, 0,
		0, s,  c, 0
	);
};
/**
 * @name makeRotateAffineY
 * @description makeRotateAffineY
 * @function
 * @param {*} theta
 * @returns {*}
 */
const makeRotateAffineY = (theta) => {
	const s = Math.sin(theta);
	const c = Math.cos(theta);
	return new AffineMatrix(
		c, 0, s, 0,
		0, 1, 0, 0,
		-s, 0, c, 0
	);
};
/**
 * @name makeRotateAffineZ
 * @description makeRotateAffineZ
 * @function
 * @param {*} theta
 * @returns {*}
 */
const makeRotateAffineZ = (theta) =>{
	const s = Math.sin(theta);
	const c = Math.cos(theta);
	return new AffineMatrix(
		c, -s, 0, 0,
		s,  c, 0, 0,
		0,  0, 1, 0
	);
};

/**
 * @name transformPoint
 * @description e0  e1  e2  e3
 *  			e4  e5  e6  e7
 *  			e8  e9  e10 e11
 *  			0   0   0   1
 *  			a b c   x   (xa + yb + zc)
 *  			d e f * y = (xd + ye + zf) 
 *  			g h i   z   (xg + yh + zi)
 *  			j k l   (xa + yb + zc)
 *  			m n o * (xd + ye + zf)
 *  			p q r   (xg + yh + zi)
 * 
 *  			Transform the point |p| by the AffineMatrix |t|.
 * @function
 * @param {*} t
 * @param {*} p
 * @returns {*}
 */

const transformPoint = (t, p) =>{
	return {
		x: t.e0 * p.x + t.e1 * p.y + t.e2  * p.z + t.e3,
		y: t.e4 * p.x + t.e5 * p.y + t.e6  * p.z + t.e7,
		z: t.e8 * p.x + t.e9 * p.y + t.e10 * p.z + t.e11
	};
};

/**
 * @name averagePoints
 * @description Average a list of points, returning a new "centroid" point.
 * @function
 * @param {*} ps
 * @returns {*}
 */
const averagePoints = ps => {
	const avg = {x: 0, y: 0, z: 0};
	const il = ps.length;
	for (let i = 0; i < il; ++i) {
		const p = ps[i];
		avg.x += p.x;
		avg.y += p.y;
		avg.z += p.z;
	}

	const f = 1 / il;

	avg.x *= f;
	avg.y *= f;
	avg.z *= f;

	return avg;
};
/**
 * @name averageUnRotatedPoints
 * @description averageUnRotatedPoints
 * @function
 * @param {*} ps
 * @returns {*}
 */
const averageUnRotatedPoints = ps => {
	const avg = {x: 0, y: 0, z: 0};
	const il = ps.length;
	for (let i = 0; i < il; ++i) {
		const p = ps[i];
		avg.x += p.xo;
		avg.y += p.yo;
		avg.z += p.zo;
	}

	const f = 1 / il;

	avg.x *= f;
	avg.y *= f;
	avg.z *= f;

	return avg;
};

/**
 * @name Point
 * @description 3D Point
 * @class
 */
 class Point { 
	/**
	 * @param {*} parent
 	 * @param {*} xyz
 	 * @param {*} project
 	 * @param {*} rubiks
	 */
	constructor (parent, xyz, project, rubiks){
		this.project = project; 
		this.rubiks = rubiks;
		this.xo = xyz[0]; 
		this.yo = xyz[1]; 
		this.zo = xyz[2]; 
		this.cube = parent; 
	}
	/**
	 * @name projection
	 * @description projection
	 * @method
	 * @returns {void}
	 */
	projection = () =>{ 
		let p = transformPoint(this.cube.rotationAffine, {x:this.xo, y:this.yo, z:this.zo});
		// this.rubiks.cameraAffines.forEach(affine=>{
		// 	p = transformPoint(affine, p);
		// });
		p = transformPoint(this.rubiks.cameraAffine, p);
		p = transformPoint(this.rubiks.customAffine, p);
		if(this.rubiks.affinediff){
			p = transformPoint(this.rubiks.affinediff, p);
		}
		this.x = p.x; 
		this.y = p.y; 
		this.z = p.z; 
		const x = p.x;
		const y = p.y;
		const z = p.z;
		if (this.project) { 
			// ---- point visible ---- 
			this.visible = (350 + z > 0); 
			// ---- 3D to 2D projection ---- 
			this.X = ((75/2) + x * (250 / (z + 350)))*(this.rubiks.width / 75);
			this.Y = ((75/2) + y * (250 / (z + 350)))*(this.rubiks.width / 75);
		} 
	}; 
}

/**
 * @name Face
 * @description Draws the cube, uses class Point
 * @class
 */
class Face  { 
	/**
	* @param {*} cube
	* @param {*} index
	* @param {*} normalVector
	* @param {*} color
	* @param {*} rubiks
	*/
	constructor(cube, index, normalVector, color, rubiks){
		/*eslint-disable */
		var g, b;
		// ---- Rubiks Cube ----
		this.rubiks = rubiks;
		// ---- parent cube ---- 
		this.cube = cube; 
		// ---- coordinates ---- 
		this.p0 = cube.points[index[0]];
		this.p1 = cube.points[index[1]];
		this.p2 = cube.points[index[2]];
		this.p3 = cube.points[index[3]];
		// ---- normal vector ---- 
		this.normal = new Point(this.cube, normalVector, false, rubiks);
		// ---- color ----
		this.color = color;
	}
	/**
	 * @name distanceToCamera
	 * @description Distance to camera
	 * @method
	 * @returns {void}
	 */
	distanceToCamera = () =>{ 
		const dx = (this.p0.x + this.p1.x + this.p2.x + this.p3.x ) * 0.25; 
		const dy = (this.p0.y + this.p1.y + this.p2.y + this.p3.y ) * 0.25; 
		const dz = (350 + 250) + (this.p0.z + this.p1.z + this.p2.z + this.p3.z ) * 0.25; 
		this.distance = Math.sqrt(dx * dx + dy * dy + dz * dz); 
	}; 
	/**
	 * @name draw
	 * @description draw
	 * @method
	 * @param {*} index
	 * @returns {void}
	 */
	draw = (index) => { 
		// ---- light ---- 
		this.normal.projection(); 
		let light = ( 
			false ? 
			this.normal.y + this.normal.z * 0.5 : 
			this.normal.z 
		); 
		const r = this.g = this.b = light;
		light += (1-light)*.8;
		const rgb = hexToRgb(this.color);
		const face = COMMON_DOCUMENT.querySelector(`#cube_face_${index}`);
		const style = `rgba(${Math.round(rgb.r*light)},${Math.round(rgb.g*light)},${Math.round(rgb.b*light)},${rgb.a})`;
		face.style.fill = style;
		face.setAttribute('d', `M${this.p0.X} ${this.p0.Y} L${this.p1.X} ${this.p1.Y} L${this.p2.X} ${this.p2.Y} L${this.p3.X} ${this.p3.Y} Z`);
	};

};



/**
 * @name Cube
 * @description Cube uses classes Face and Point
 * @class
 */
class Cube  { 
	/**
	 * @param {*} x
	 * @param {*} y
	 * @param {*} z
	 * @param {*} w
	 * @param {*} rubiks
	 * @param {*} colors
	 */
	constructor (x, y, z, w, rubiks, colors){
		this.rubiks = rubiks;
		// ---- create points ---- 
		this.w = w; 
		this.points = []; 
		const p = [ 
			[x-w, y-w, z-w], 
			[x+w, y-w, z-w], 
			[x+w, y+w, z-w], 
			[x-w, y+w, z-w], 
			[x-w, y-w, z+w], 
			[x+w, y-w, z+w], 
			[x+w, y+w, z+w], 
			[x-w, y+w, z+w] 
		]; 
		for (var i in p) this.points.push( 
			new Point(this, p[i], true, rubiks) 
		); 
		
		// ---- faces coordinates ---- 
		const f  = [ 
			[0,1,2,3], 
			[0,4,5,1], 
			[3,2,6,7], 
			[0,3,7,4], 
			[1,5,6,2], 
			[5,4,7,6] 
		]; 
		// ---- faces normals ---- 
		const nv = [ 
			[0,0,1], 
			[0,1,0], 
			[0,-1,0], 
			[1,0,0], 
			[-1,0,0], 
			[0,0,-1] 
		]; 
		// ---- cube transparency ---- 
		this.alpha = 1; 
		// ---- push faces ---- 
		this.faces = [];
		for (var i in f) { 
			this.faces.push( 
				new Face(this, f[i], nv[i], colors[i], rubiks)
			); 
		} 
		this.rotationAffine = makeIdentityAffine();
		this.rotateX = 0;
		this.rotateY = 0;
		this.rotateZ = 0;
	}
	/**
	 * @name getPosition
	 * @description getPosition
	 * @method
	 * @returns {*}
	 */
	getPosition = () =>{
		const points = [];
		for(let i=0; i<this.points.length; i++){
			//cubie rotations
			let p = transformPoint(makeRotateAffineX(this.rotateX), {x:this.points[i].xo,y:this.points[i].yo,z:this.points[i].zo});
			//rotateY
			p = transformPoint(makeRotateAffineY(this.rotateY), p);
			//rotateZ
			p = transformPoint(makeRotateAffineZ(this.rotateZ), p);
			points.push(p);
		}
		const result = averagePoints(points);
		result.x = Math.round(result.x);
		result.y = Math.round(result.y);
		result.z = Math.round(result.z);
		return result;
	};
	/**
	 * @name setRotationAffine
	 * @description setRotationAffine
	 * @method
	 * @returns {void}
	 */
	setRotationAffine = () =>{
		if(this.rotateX != 0 || this.rotateY != 0 || this.rotateZ != 0)
			this.rotationAffine = makeRotationAffine(this.rotateX, this.rotateY, this.rotateZ);
	};
	/**
	 * @name resetRotation
	 * @description resetRotation
	 * @method
	 * @returns {void}
	 */
	resetRotation = () =>{
		for(var i=0; i<this.points.length; i++){
			//cubie rotations
			var p = transformPoint(makeRotateAffineX(this.rotateX), {x:this.points[i].xo,y:this.points[i].yo,z:this.points[i].zo});
			//rotateY
			p = transformPoint(makeRotateAffineY(this.rotateY), p);
			//rotateZ
			p = transformPoint(makeRotateAffineZ(this.rotateZ), p);
			this.points[i].xo = p.x;
			this.points[i].yo = p.y;
			this.points[i].zo = p.z;
		}
		for(var i=0; i<this.faces.length; i++){
			const normal = this.faces[i].normal;
			var p = transformPoint(makeRotateAffineX(this.rotateX), {x:normal.xo,y:normal.yo,z:normal.zo});
			//rotateY
			p = transformPoint(makeRotateAffineY(this.rotateY), p);
			//rotateZ
			p = transformPoint(makeRotateAffineZ(this.rotateZ), p);
			normal.xo = p.x;
			normal.yo = p.y;
			normal.zo = p.z;	
		}
		this.rotateX = 0;
		this.rotateY = 0;
		this.rotateZ = 0;
		this.rotationAffine = makeIdentityAffine();
	};
};



/**
 * @name RubiksCube
 * @description RubiksCube uses class Cube
 * @class
 */
class RubiksCube {
	/**
	 * @param {*} width
	 */
	constructor(width) {
		this.faceNames = ['L', 'U', 'D', 'B', 'F', 'R'];	
		this.opposites = {
			'F':'B',
			'B':'F',
			'T':'D',
			'D':'T',
			'R':'L',
			'L':'R'
		};
		this.turnSpeed = 250;
		this.width = width;
		this.blocks = [];
		this.points = [];
		this.faces = [];
		/**@type{string[]} */
		this.queue = [];
		/**@type{string[]} */
		this.moveHistory = [];
		this.rotating = false;
		this.rotating2 = false;
		//starts with white on top without rotate animation at start
		this.cameraY = 0.6051576618506336;	//1.0471973333333313;
		this.cameraX = 0.6383711800616866;	//3.9269900000000044;	
		this.cameraZ = 0;
		this.cx = 0.6;
		this.cy = 0.6;
		this.cz = 0;
		this.cameraAffine = makeRotationAffine(this.cameraX,this.cameraY,this.cameraZ);
		this.customAffine = makeIdentityAffine();
		const w = 54/6;
		for(let i=-1; i<2; i++){
			for(let j=-1; j<2; j++){
				for(let k=-1; k<2; k++){
					if(k!=0 || j != 0 || i != 0){
						
						// var colors = [RED,WHITE,YELLOW,GREEN,BLUE,ORANGE];
						const colors = [CLEAR,CLEAR,CLEAR,CLEAR,CLEAR,CLEAR];
						if(j == 1)       colors[2] = YELLOW;
						else if(j == -1) colors[1] = WHITE;
						if(i == 1)       colors[4] = BLUE;
						else if(i == -1) colors[3] = GREEN;
						if(k == 1)       colors[5] = ORANGE;
						else if(k == -1) colors[0] = RED;
						const block = new Cube(2.20*i*w, 2.20*j*w, 2.20*k*w, w, this, colors);
						this.blocks.push(block);
						for(var f = 0; f < block.faces.length; f++)
							this.faces.push(block.faces[f]);
						for(var f = 0; f < block.points.length; f++)
							this.points.push(block.points[f]);
					}
				}
			}
		}	
	}
	

	/**
	 * @name isSolvable
	 * @description isSolvable
	 * @method
	 * @returns {*}
	 */
	isSolvable = () =>{
		return !this.rotating;
	};
	/**
	 * @name scramble
	 * @description scramble
	 * @method
	 * @param {*} num
	 * @returns {void}
	 */
	scramble = (num) => {
		if(this.isSolvable()){
			const moves = 'u d f b l r'.split(' ');
			const me = this;
			if(this.rotating){
				return;
			}
			num = num || 50;
			// shift();
			const turnSpeed = this.turnSpeed;
			this.turnSpeed = 100;
			for(let i=0; i<num; i++) {
				const r = Math.random();
				this.makeMove(moves[Math.floor(Math.random()*moves.length)] + (Math.random() > 1/2 ? '\'' : ''));
			}
			const checkAgain = ()=>{
				commonWindowSetTimeout(()=> {
					if(me.queue.length == 0){
						me.turnSpeed = turnSpeed;
					} else {
						checkAgain();
					}
				}, 10);
			};
			checkAgain();
		}
	};
	/**
	 * @name render
	 * @description render
	 * @method
	 * @returns {*}
	 */
	render = () =>{
			
		this.cameraAffine = makeRotationAffine(this.cameraX,this.cameraY,this.cameraZ);

		this.blocks.forEach(block=>{
			block.setRotationAffine();
		});

		this.points.forEach(point=>{
			point.projection();
		});

		this.faces.forEach(face=>{
			face.distanceToCamera();
		});

		this.faces.sort((p0, p1) =>{ 
			/**@ts-ignore */
			return p1.distance - p0.distance; 
		}); 

		for(let i=0; i<this.faces.length; i++){
			this.faces[i].draw(i);
		}
	};
	/**
	 * @name rotateFace
	 * @description rotateFace
	 * @method
	 * @param {*} face
	 * @param {*} d
	 * @returns {void}
	 */
	rotateFace = (face, d) =>{
		if(this.rotating)
			return;
		this.rotating = face;
		const blocks = this.getBlocks(face);
		/**@type{{	rotateY:Cube['rotateY'],
		 * 			rotateX:Cube['rotateX'],
		 * 			rotateZ:Cube['rotateZ']}[]} */
		const rotations = [];
		blocks.forEach((/**@type{Cube}*/block)=>{
			rotations.push({
				rotateY: block.rotateY,
				rotateX: block.rotateX,
				rotateZ: block.rotateZ
			});
		});

		const me = this;

		const start = Date.now();

		const duration = Math.abs(d)*this.turnSpeed;

		const rotate = () =>{
			const p = Math.min((Date.now()-start)/duration, 1);
			blocks.forEach((/**@type{Cube}*/block, /**@type{number}*/i)=>{
				if (face == 'F' || face == 'B' || face == 'Z'){
					block.rotateX = rotations[i].rotateX + d*(Math.PI/2)*p;
				}	
				if(face == 'U' || face == 'D' || face == 'Y'){
					block.rotateY = rotations[i].rotateY + d*(Math.PI/2)*p;
				}
				if (face == 'L' || face == 'R' || face == 'X'){
					block.rotateZ = rotations[i].rotateZ + d*(Math.PI/2)*p;
				}
			});
			if(p >= 1){
				for(let i=0; i<blocks.length; i++){
					blocks[i].resetRotation();
				}
				me.rotating = false;
				me.makeNextMove();
			}
			else
				commonWindowSetTimeout(() => {rotate();me.render()}, 10);
		};
		rotate();
	};
	/**
	 * @name getBlocks
	 * @description getBlocks
	 * @method
	 * @param {*} face
	 * @returns {Cube[]}
	 */
	getBlocks = (face) => {
		/**@type{Cube[]} */
		let result = [];
		if(face == 'B'){
			this.blocks.forEach(block=>{
				if(block.getPosition().x < 0)
					result.push(block);
			});
		}
		else if(face == 'F'){
			this.blocks.forEach(block=>{
				if(block.getPosition().x > 0)
					result.push(block);
			});
		}
		else if(face == 'U'){
			this.blocks.forEach(block=>{
				if(block.getPosition().y < 0)
					result.push(block);
			});
		}
		else if(face == 'D'){
			this.blocks.forEach(block=>{
				if(block.getPosition().y > 0)
					result.push(block);
			});
		}
		else if(face == 'L'){
			this.blocks.forEach(block=>{
				if(block.getPosition().z < 0)
					result.push(block);
			});
		}
		else if(face == 'R'){
			this.blocks.forEach(block=>{
				if(block.getPosition().z > 0)
					result.push(block);
			});
		} else if(face == 'X' || face == 'Y' || face == 'Z'){
			result = this.blocks;
		}
		return result;
	};
	/**
	 * @name makeMoves
	 * @description makeMoves
	 * @method
	 * @param {*} moves
	 * @returns {void}
	 */
	makeMoves = (moves) => {
		moves = moves.split(/\s/);
		for(let i=0; i<moves.length; i++){
			this.makeMove(moves[i]);
		}
	};
	/**
	 * @name makeMove
	 * @description makeMove
	 * @method
	 * @param{*} move
	 * @returns {void}
	 */
	makeMove = move => {
		if(this.rotating){
			this.queue.push(move);
			return;
		}
		this.moveHistory.push(move);
		let spin = 1;
		if(move[move.length-1] == '2'){
			spin++;
			move = move.substr(0,move.length-1);
		}
		switch(move.toLowerCase()){
			case 'f':
				this.rotateFace('F', -spin);
				break;
			case 'f\'':
				this.rotateFace('F', spin);
				break;
			case 'r':
				this.rotateFace('R', -spin);
				break;
			case 'r\'':
				this.rotateFace('R', spin);
				break;
			case 'u':
				this.rotateFace('U', spin);
				break;
			case 'u\'':
				this.rotateFace('U', -spin);
				break;
			case 'd':
				this.rotateFace('D', -spin);
				break;
			case 'd\'':
				this.rotateFace('D', spin);
				break;
			case 'b':
				this.rotateFace('B', spin);
				break;
			case 'b\'':
				this.rotateFace('B', -spin);
				break;
			case 'l':
				this.rotateFace('L', spin);
				break;
			case 'l\'':
				this.rotateFace('L', -spin);
				break;
			case 'x':
				this.rotateFace('X', spin);
				break;
			case 'x\'':
				this.rotateFace('X', -spin);
				break;
			case 'y':
				this.rotateFace('Y', spin);
				break;
			case 'y\'':
				this.rotateFace('Y', -spin);
				break;
			case 'z':
				this.rotateFace('Z', -spin);
				break;
			case 'z\'':
				this.rotateFace('Z', spin);
				break;
		}
	};
	/**
	 * @name makeNextMove
	 * @description makeNextMove
	 * @method
	 * @returns {void}
	 */
	makeNextMove = () => {	
		if(this.queue.length > 0){
			this.makeMove(this.queue.shift());
		}
	};
	/**
	 * @name getFaceColor
	 * @description getFaceColor
	 * @method
	 * @param {*}face
	 * @returns {*}
	 */
	getFaceColor = (face) => {
		/**
		 * @param {*} c
		 */
		const getOutside = c =>{
			let index = -1;
			let max = 0;
			for(let i=0; i<c.faces.length; i++){
				//CHANGE: added const
				const p = averageUnRotatedPoints([c.faces[i].p0,c.faces[i].p1, c.faces[i].p2, c.faces[i].p3]);
				if(Math.abs(p.x) > max){
					index = i;
					max = Math.abs(p.x);
				}
				if(Math.abs(p.y) > max){
					index = i;
					max = Math.abs(p.y);
				}
				if(Math.abs(p.z) > max){
					index = i;
					max = Math.abs(p.z);
				}
			}
			return c.faces[index].color;
		}

		switch(face){
			case 'D':
				return getOutside(arrayFind(this.blocks, (/**@type{*}*/block)=>{
					const p = block.getPosition();
					return (p.x == 0 && p.y > 0 && p.z == 0);
				}));
			case 'U':
				return getOutside(arrayFind(this.blocks, (/**@type{*}*/block)=>{
					const p = block.getPosition();
					return (p.x == 0 && p.y < 0 && p.z == 0);
				}));
			case 'L':
				return getOutside(arrayFind(this.blocks, (/**@type{*}*/block)=>{
					const p = block.getPosition();
					return (p.x == 0 && p.y == 0 && p.z < 0);
				}));
			case 'R':
				return getOutside(arrayFind(this.blocks, (/**@type{*}*/block)=>{
					const p = block.getPosition();
					return (p.x == 0 && p.y == 0 && p.z > 0);
				}));
			case 'F':
				return getOutside(arrayFind(this.blocks, (/**@type{*}*/block)=>{
					const p = block.getPosition();
					return (p.x > 0 && p.y == 0 && p.z == 0);
				}));
			case 'B':
				return getOutside(arrayFind(this.blocks, (/**@type{*}*/block)=>{
					const p = block.getPosition();
					return (p.x < 0 && p.y == 0 && p.z == 0);
				}));
		}
	};
	/**
	 * @name getCubie
	 * @description getCubie
	 * @method
	 * @param {*} position
	 * @returns {*}
	 */
	getCubie = (position) =>{
		const cubes = this.getBlocks(position[0]);
		switch(position){
			//Edge piece
			case 'UF':
			case 'DF':
				return arrayFind(cubes, (/**@type{*}*/c)=>{
					const p = c.getPosition();
					return p.z == 0 && p.x > 0;
				});
			case 'UB':
			case 'DB':
				return arrayFind(cubes, (/**@type{*}*/c)=>{
					const p = c.getPosition();
					return p.z == 0 && p.x < 0;
				});
			case 'UR':
			case 'DR':
				return arrayFind(cubes, (/**@type{*}*/c)=>{
					const p = c.getPosition();
					return p.z > 0 && p.x == 0;
				});
			case 'UL':
			case 'DL':
				return arrayFind(cubes, (/**@type{*}*/c)=>{
					const p = c.getPosition();
					return p.z < 0 && p.x == 0;
				});
			case 'FR':
			case 'BR':
				return arrayFind(cubes, (/**@type{*}*/c)=>{
					const p = c.getPosition();
					return p.z > 0 && p.y == 0;
				});
			case 'FL':
			case 'BL':
				return arrayFind(cubes, (/**@type{*}*/c)=>{
					const p = c.getPosition();
					return p.z < 0 && p.y == 0;
				});
			//Corner Cubie
			case 'UFR':
			case 'DRF':
				return arrayFind(cubes, (/**@type{*}*/c)=>{
						const p = c.getPosition();
						return p.z > 0 && p.x > 0;
					});
			case 'URB':
			case 'DBR':
				return arrayFind(cubes, (/**@type{*}*/c)=>{
						const p = c.getPosition();
						return p.z > 0 && p.x < 0;
					});
			case 'UBL':
			case 'DLB':
				return arrayFind(cubes, (/**@type{*}*/c)=>{
						const p = c.getPosition();
						return p.z < 0 && p.x < 0;
					});
			case 'ULF':
			case 'DFL':
				return arrayFind(cubes, (/**@type{*}*/c)=>{
						const p = c.getPosition();
						return p.z < 0 && p.x > 0;
					});
		}
	};
	/**
	 * @name getState
	 * @description getState
	 * @method
	 * @returns {string}
	 */
	getState = () =>{
		const me = this;
		let result = '';
		const cubicles = ['UF', 'UR', 'UB', 'UL', 'DF', 'DR', 'DB', 'DL', 'FR', 'FL', 'BR', 'BL', 'UFR', 'URB', 'UBL', 'ULF', 'DRF', 'DFL', 'DLB', 'DBR'];
		const colorToFace = {};
		const faceToDirection = {
			'F':'x',
			'B':'x',
			'U':'y',
			'D':'y',
			'R':'z',
			'L':'z'
		};
		/**
		 * @param {*} c
		 * @param {*} direction
		 */
		const getFaceColor = (c, direction) =>{
			//direction is a string 'x', 'y', or 'z'
			let result=null;
			let max = 0;
			c.faces.forEach((/**@type{*}*/f)=>{
				//CHANGE: add const
				const p = averageUnRotatedPoints([f.p0,f.p1, f.p2, f.p3]);

				if(Math.abs(p[direction]) > max){
					max = Math.abs(p[direction]);
					result = f.color;
				}
			});
			return result;
		};
		this.faceNames.forEach(face=>{
			/**@ts-ignore */
			colorToFace[me.getFaceColor(face)] = face;
		});
		
		cubicles.forEach(cubicle=>{
			const c = me.getCubie(cubicle);
			let cubieName = '';
			cubicle.split('').forEach(face=>{
				/**@ts-ignore */
				const color = getFaceColor(c, faceToDirection[face]);
				/**@ts-ignore */
				cubieName += colorToFace[color];
			});
			result += cubieName + ' ';
		});
		
		return result.trim();
	};

}

export {RubiksCube, RubiksCubeControls, makeIdentityAffine, makeRotationAffine, makeRotateAffineX, makeRotateAffineY, multiplyAffine};