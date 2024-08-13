/**
 * Original code https://github.com/stringham/rubiks-solver
 * Changes
 * Converted to one javascript module
 * Replaced event listeners with event delegation
 * Moved css to external css file and using responsive css
 * Replaced infinite loop on canvas element with setInterval
 * Replaced step button images with characters
 * Removed unused code
 * Added jsdoc, es-lint and typescript support
 */
const WHITE='#ffffff', YELLOW='#ffff00' , GREEN='#009900' , BLUE='#006dbf', RED='#cc0000', ORANGE='#ff8000', CLEAR = '#000000';
const WHITE_class='cube_white', YELLOW_class='cube_yellow' , GREEN_class='cube_green' , BLUE_class='cube_blue', RED_class='cube_red', ORANGE_class='cube_orange';

//flat.js
const FlatCube = function(/**@type{string}*/containerId, /**@type{number}*/size){
		
	const colors = [GREEN_class,RED_class,WHITE_class,ORANGE_class,BLUE_class,YELLOW_class];

	this.container = document.getElementById(containerId);

	while(this.container?.firstChild){
		this.container.removeChild(this.container.firstChild);
	}
	
	this.faceSize = size/3 || 100;
	
	this.faces = [];

	const tops = [0, 1, 1, 1, 2, 3];
	const lefts = [1, 0, 1, 2, 1, 1];

	for(let i=0; i<6; i++){
		this.faces.push(new FlatFace(this, this.faceSize, tops[i]*this.faceSize, lefts[i]*this.faceSize, colors[i]));
	}
	this.faces.forEach(function(face){
		/**@ts-ignore */
		this.container.appendChild(face.container);
	}, this);

	this.message = document.createElement('div');
	this.message.style.position = 'absolute';
	this.message.style.left = this.faceSize/8 + 'px';
	this.message.style.top = this.faceSize*4.03 + 'px';
	this.message.style.color = '#ff0000';
	this.message.style.fontSize = this.faceSize/9 + 'px';
	/**@ts-ignore */
	this.container.appendChild(this.message);

	this.picker = new FlatColorPicker(colors, this.faceSize/4);
	
	/**@ts-ignore */
	this.container.appendChild(this.picker.container);
};


FlatCube.prototype.update = function() {
	if(this.message.firstChild){
		this.message.removeChild(this.message.firstChild);
	}
	if(this.cube){
		this.cube.updateColors();
		if(!this.cube.isSolvable()){
			this.message.appendChild(document.createTextNode(this.cube.solver.currentState));
		}
	}
};

FlatCube.prototype.setColors = function(top, front, right, colors){
	// var FRONT=4, TOP=1, BOTTOM=2, LEFT=0, RIGHT=5, BACK=3;

	const stickers = this.getStickers(top, front, right);
	colors.forEach(function(color, i){
		color && stickers[i] && stickers[i].setColor(color);
	});
};

FlatCube.prototype.getColors = function(top, front, right){
	return this.getStickers(top,front,right).map(function(sticker){
		return sticker && sticker.color;
	});
};

FlatCube.prototype.getStickers = function(top, front, right){
	const faceToIndex = {
		'B':0,
		'L':1,
		'U':2,
		'R':3,
		'F':4,
		'D':5,
	};
	const FRONT=4, TOP=1, BOTTOM=2, LEFT=0, RIGHT=5, BACK=3; 
	
	const me = this;
	const colors = [null,null,null,null,null,null];
	const getColor = function(face, sticker){
		return me.faces[face].stickers[sticker];
	};

	const numFaces = Math.abs(top)+Math.abs(front)+Math.abs(right);
	if(numFaces == 3){
		if(top == 1 && right == 1 && front == 1){
			colors[TOP] = getColor(2,8);
			colors[FRONT] = getColor(4,2);
			colors[RIGHT] = getColor(3,6);
		}
		else if(top == 1 && right == 1 && front == -1){
			colors[TOP] = getColor(2,2);
			colors[RIGHT] = getColor(3,0);
			colors[BACK] = getColor(0,8);
		}
		else if(top == 1 && right == -1 && front == 1){
			colors[TOP] = getColor(2,6);
			colors[FRONT] = getColor(4,0);
			colors[LEFT] = getColor(1,8);
		}
		else if(top == 1 && right == -1 && front == -1){
			colors[TOP] = getColor(2,0);
			colors[BACK] = getColor(0,6);
			colors[LEFT] = getColor(1,2);
		}
		else if(top == -1 && right == 1 && front == 1){
			colors[FRONT] = getColor(4,8);
			colors[RIGHT] = getColor(3,8);
			colors[BOTTOM] = getColor(5,2);
		}
		else if(top == -1 && right == 1 && front == -1){
			colors[RIGHT] = getColor(3,2);
			colors[BACK] = getColor(0,2);
			colors[BOTTOM] = getColor(5,8);
		}
		else if(top == -1 && right == -1 && front == 1){
			colors[FRONT] = getColor(4,6);
			colors[LEFT] = getColor(1,6);
			colors[BOTTOM] = getColor(5,0);
		}
		else if(top == -1 && right == -1 && front == -1){
			colors[BACK] = getColor(0,0);
			colors[LEFT] = getColor(1,0);
			colors[BOTTOM] = getColor(5,6);
		}
	}
	else if(numFaces == 2){
		if(top == 1){
			if(front == 1){
				colors[FRONT] = getColor(4,1);
				colors[TOP] = getColor(2,7);
			}
			else if(front == -1){
				colors[BACK] = getColor(0,7);
				colors[TOP] = getColor(2,1);
			}
			else if(right == 1){
				colors[RIGHT] = getColor(3,3);
				colors[TOP] = getColor(2,5);
			}else if(right == -1){
				colors[LEFT] = getColor(1,5);
				colors[TOP] = getColor(2,3);
			}
		}
		else if(top == -1){
			if(front == 1){
				colors[FRONT] = getColor(4,7);
				colors[BOTTOM] = getColor(5,1);
			}
			else if(front == -1){
				colors[BACK] = getColor(0,1);
				colors[BOTTOM] = getColor(5,7);
			}
			else if(right == 1){
				colors[RIGHT] = getColor(3,5);
				colors[BOTTOM] = getColor(5,5);
			}else if(right == -1){
				colors[LEFT] = getColor(1,3);
				colors[BOTTOM] = getColor(5,3);
			}
		}
		else if(front == 1){
			if(right==1){
				colors[FRONT] = getColor(4,5);
				colors[RIGHT] = getColor(3,7);
			}else if(right==-1){
				colors[FRONT] = getColor(4,3);
				colors[LEFT] = getColor(1,7);
			}
		}
		else if(front == -1){
			if(right==1){
				colors[BACK] = getColor(0,5); 
				colors[RIGHT] = getColor(3,1);
			}else if(right==-1){
				colors[BACK] = getColor(0,3);
				colors[LEFT] = getColor(1,1);
			}
		}
	}
	else if(numFaces == 1){
		//center
		if(top==1)
			colors[TOP] = getColor(2,4);
		else if(top== -1)
			colors[BOTTOM] = getColor(5,4);
		else if(front==1)
			colors[FRONT] = getColor(4,4);
		else if(front== -1)
			colors[BACK] = getColor(0,4);
		else if(right == 1)
			colors[RIGHT] = getColor(3,4);
		else if(right == -1)
			colors[LEFT] = getColor(1,4);
	}
	return colors;
};

FlatCube.prototype.getColor = function() {
	return this.picker.getColor();
};

const FlatFace = function(cube, size, top, left, color){
	this.container = document.createElement('div');
	// this.container.style.position = 'absolute';
	// this.container.style.width = size + 'px';
	// this.container.style.height = size + 'px';
	this.container.id = `flatface_${color}`;
	this.container.className = 'flatface';
	this.container.style.top = top + 'px';
	this.container.style.left = left + 'px';
	this.cube = cube;
	this.stickers = [];
	const tops = [0, 0, 0, 1, 1, 1, 2, 2, 2];
	const lefts = [0, 1, 2, 0, 1, 2, 0, 1, 2];
	for(let i=0; i<9; i++){
		const sticker = new FlatSticker(i, 'flatface', tops[i]*size/3, lefts[i]*size/3, color);
		//const sticker = new FlatSticker(size/3, tops[i]*size/3, lefts[i]*size/3, color);
		this.stickers.push(sticker);
		this.container.appendChild(sticker.container);
	}
};

const FlatSticker = function(index, name, top, left, color){
//const FlatSticker = function(size, top, left, color){
	this.container = document.createElement('div');
	this.container.className = `flatsticker ${color}`;
	this.container.id = `flatsticker_${name}_${color}_${index}`;

	this.setColor(color);
};

FlatSticker.prototype.setColor = function(color) {
	this.color = color;
	//this.container.style.backgroundColor = color;
	const getColorName = (color)=>{
		switch (color){
			case WHITE:{
				return 'cube_white';
			}
			case BLUE:{
				return 'cube_blue';
			}
			case GREEN:{
				return 'cube_green';
			}
			case RED:{
				return 'cube_red';
			}
			case ORANGE:{
				return 'cube_orange';
			}
			case YELLOW:{
				return 'cube_yellow';
			}
			default:{
				return color;
			}
		}
	};
	color = getColorName(color);
	this.container.className = `flatsticker ${color}`;
};

const FlatColorPicker = function(colors, size){
	const me = this;
	size*=1.5;
	this.container = document.createElement('div');
	this.container.id = 'FlatColorPicker';
	this.container.onclick = function(){me.setSelection(-1);};
	this.size = size;
	this.colors = colors;

	this.choices = [];
	const tops = [0,0,0,0,0,0];
	const lefts = [0,1,2,3,4,5];
	for(let i=0; i<6; i++){
		this.choices.push(new FlatSticker(i, 'flatcolorpicker', .25*size, .25*size + 1.29*lefts[i]*size, colors[i]));
		//this.choices[this.choices.length-1].container.style.cursor = 'pointer';
	}
	this.choices.forEach(function(choice, i){
		this.container.appendChild(choice.container);
	}, this);
};

FlatColorPicker.prototype.setSelection = function(index) {
	this.selection = index;
	this.choices.forEach(function(choice, i){
		if(i == index)
			choice.container.style.borderWidth = '3px';
		else
			choice.container.style.borderWidth = '1px';
	}, this);
};

FlatColorPicker.prototype.getColor = function(){
	return this.selection < 0 ? '' : this.colors[this.selection];
};
const clock90 =   '↷';
const counter90 = '↶';
const clock180 = '↷180°';

const RubiksCubeControls = function(id, cube, width){
	const me = this;

	this.cube = cube;

	this.container = document.getElementById(id);

	this.buttons = {};

	this.cube.addUpdateCallback(function(){
		for(const face in me.buttons){
			const color = me.cube.getFaceColor(face.substr(0,1));
		}
	});

	const addButton = function(name, background){
		const color = me.cube.getFaceColor(name.substr(0,1));
		const button = document.querySelector(`#button_controls #button_${name}`);

		me.buttons[name] = button;

	};

	addButton('L',clock90);
	addButton('R',clock90);
	addButton('U',clock90);
	addButton('D',clock90);
	addButton('F',clock90);
	addButton('B',clock90);
	addButton('L2',counter90);
	addButton('R2',counter90);
	addButton('U2',counter90);
	addButton('D2',counter90);
	addButton('F2',counter90);
	addButton('B2',counter90);

	this.setProgress = function (data){
		me.progress.style.width = data*100 + '%';
		if(data == 1){
			me.progress.style.width = '0%';
		}
	};

	this.overlay = document.querySelector('#button_controls #overlay');

	this.stepButtonInfo = document.querySelector('#button_controls #button_step_info');
	this.stepButton = document.querySelector('#button_controls #button_step');
	this.stepButtonMove = document.querySelector('#button_controls #button_step_move');

	this.scrambleButton = document.querySelector('#button_controls #button_scramble');

	this.progress = document.querySelector('#button_controls #solve_progress');

	if(width){
		this.setWidth(width);
	}
};
RubiksCubeControls.prototype.solve = function() {
	this.progress.display = '';
	const me = this;
	this.cube.solve(function(data){
		me.setProgress(data);
	});
	let counter = 0;
	const timer = setInterval(function() {
		counter ++;
		if(me.cube.turnSpeed * 50 < counter * 10){
			clearInterval(timer);
		}
		else
			me.cube.render();
	}, 10);
	
	this.setSolution('');
};
RubiksCubeControls.prototype.setSolution = function(solution) {
	if(solution.length > 0){
		this.solution = solution.split(' ');
		this.updateStepButton();
		this.overlay.style.display = '';
	} else {
		this.solution = [];
		this.overlay.style.display = 'none';
	}
};

RubiksCubeControls.prototype.updateStepButton = function() {
	if(this.solution && this.solution.length > 0){
		const move = this.solution[0];
		const color = this.cube.getFaceColor(move.substr(0,1));
		this.stepButtonInfo.style.backgroundColor = color;
		const bgImg = move.length == 1 ? clock90 : move[1] == '2' ? clock180 : counter90;
		//this.stepButton.style.backgroundImage = bgImg;
		this.stepButtonMove.innerText = bgImg;
		if(this.stepButton.firstChild){
			this.stepButton.removeChild(this.stepButton.firstChild);
		}
		this.stepButton.appendChild(document.createTextNode(this.solution.length));
	}
};
RubiksCubeControls.prototype.nextMove = function() {
	const move = this.solution.shift();
	this.cube.makeMove(move);
	if(this.solution.length > 0){
		this.updateStepButton();
	} else {
		this.overlay.style.display = 'none';
	}
	const me = this;
	let counter = 0;
	const timer_render = setInterval(() => {
		counter ++;
		if ((me.cube.turnSpeed*2) > counter *10)
			me.cube.render();
		else
			clearInterval(timer_render);
	}, 10);
	
};
RubiksCubeControls.prototype.setWidth = function(width) {

	if(!this.solution || this.solution.length == 0){
		this.overlay.style.display = 'none';
	}

};
//rubrik.js
/**********************************
 * Utility Functions
 **********************************/
function hexToRgb(hex) {
	if(hex.length == 7){
	    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	    return result ? {
	        r: parseInt(result[1], 16),
	        g: parseInt(result[2], 16),
	        b: parseInt(result[3], 16),
	        a: 1
	    } : null;
	}
	else if(hex.length == 9){
	    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	    return result ? {
	        r: parseInt(result[1], 16),
	        g: parseInt(result[2], 16),
	        b: parseInt(result[3], 16),
	        a: parseInt(result[4], 16)/256
	    } : null;
	}
}

function makeRotationAffine(x,y,z){
	return multiplyAffine(multiplyAffine(makeRotateAffineX(x),makeRotateAffineY(y)),makeRotateAffineZ(z));
}

/**
 * Search an array for the first element that satisfies a given condition and
 * return that element.
 */
const arrayFind = function(arr, f) {
  const i = arrayFindIndex(arr, f);
  return i < 0 ? null : arr[i];
};


/**
 * Search an array for the first element that satisfies a given condition and
 * return its index.
 */

const arrayFindIndex = function(arr, f) {
  const l = arr.length;  // must be fixed during loop... see docs
  const arr2 = arr;
  for (let i = 0; i < l; i++) {
    if (i in arr2 && f(arr2[i], i, arr)) {
      return i;
    }
  }
  return -1;
};

/**********************************
 * Variables
 **********************************/
const xAutorotate = 0, yAutorotate = 0, zAutorotate = 0; 

/************************************************************
 * MMMM    MMMM   OOOOOOOO   DDDDDDDD   EEEEEEEE  LL
 * MM MM  MM MM   OO    OO   DD    DD   EE        LL
 * MM  MMMM  MM   OO    OO   DD    DD   EEEEE     LL
 * MM   MM   MM   OO    OO   DD    DD   EE        LL
 * MM   MM   MM   OOOOOOOO   DDDDDDDD   EEEEEEEE  LLLLLLL
 ************************************************************/

/**********************************
 *  3D Translation Stuff
 *********************************/

// This represents an affine 4x4 matrix, stored as a 3x4 matrix with the last
// row implied as [0, 0, 0, 1].  This is to avoid generally unneeded work,
// skipping part of the homogeneous coordinates calculations and the
// homogeneous divide.  Unlike points, we use a constructor function instead
// of object literals to ensure map sharing.  The matrix looks like:
//  e0  e1  e2  e3
//  e4  e5  e6  e7
//  e8  e9  e10 e11
//  0   0   0   1
function AffineMatrix(e0, e1, e2, e3, e4, e5, e6, e7, e8, e9, e10, e11) {
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

// Matrix multiplication of AffineMatrix |a| x |b|.  This is unrolled,
// and includes the calculations with the implied last row.
function multiplyAffine(a, b) {
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
}
function makeIdentityAffine() {
	return new AffineMatrix(
		1, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 1, 0
	);
}
// http://en.wikipedia.org/wiki/Rotation_matrix
function makeRotateAffineX(theta) {
	const s = Math.sin(theta);
	const c = Math.cos(theta);
	return new AffineMatrix(
		1, 0,  0, 0,
		0, c, -s, 0,
		0, s,  c, 0
	);
}
function makeRotateAffineY(theta) {
	const s = Math.sin(theta);
	const c = Math.cos(theta);
	return new AffineMatrix(
		 c, 0, s, 0,
		 0, 1, 0, 0,
		-s, 0, c, 0
	);
}
function makeRotateAffineZ(theta) {
	const s = Math.sin(theta);
	const c = Math.cos(theta);
	return new AffineMatrix(
		c, -s, 0, 0,
		s,  c, 0, 0,
		0,  0, 1, 0
	);
}

//  e0  e1  e2  e3
//  e4  e5  e6  e7
//  e8  e9  e10 e11
//  0   0   0   1

// a b c   x   (xa + yb + zc)
// d e f * y = (xd + ye + zf) 
// g h i   z   (xg + yh + zi)

// j k l   (xa + yb + zc)
// m n o * (xd + ye + zf)
// p q r   (xg + yh + zi)

// Transform the point |p| by the AffineMatrix |t|.
function transformPoint(t, p) {
	return {
		x: t.e0 * p.x + t.e1 * p.y + t.e2  * p.z + t.e3,
		y: t.e4 * p.x + t.e5 * p.y + t.e6  * p.z + t.e7,
		z: t.e8 * p.x + t.e9 * p.y + t.e10 * p.z + t.e11
	};
}

// Average a list of points, returning a new "centroid" point.
function averagePoints(ps) {
	const avg = {x: 0, y: 0, z: 0};
	for (var i = 0, il = ps.length; i < il; ++i) {
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
}

function averageUnRotatedPoints(ps) {
	const avg = {x: 0, y: 0, z: 0};
	for (var i = 0, il = ps.length; i < il; ++i) {
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
}

/**********************************
 * 3D Point
 **********************************/
 const Point = function (parent, xyz, project, rubiks) { 
	this.project = project; 
	this.rubiks = rubiks;
	this.xo = xyz[0]; 
	this.yo = xyz[1]; 
	this.zo = xyz[2]; 
	this.cube = parent; 
};
Point.prototype.projection = function () { 
	let p = transformPoint(this.cube.rotationAffine, {x:this.xo, y:this.yo, z:this.zo});
	// this.rubiks.cameraAffines.forEach(function(affine){
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
/**********************************
 * Face Object
 **********************************/
const Face = function (cube, index, normalVector, color, rubiks) { 
	//CHANGED: added g and b variables
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
};
Face.prototype.distanceToCamera = function () { 
	// ---- distance to camera ---- 
	const dx = (this.p0.x + this.p1.x + this.p2.x + this.p3.x ) * 0.25; 
	const dy = (this.p0.y + this.p1.y + this.p2.y + this.p3.y ) * 0.25; 
	const dz = (350 + 250) + (this.p0.z + this.p1.z + this.p2.z + this.p3.z ) * 0.25; 
	this.distance = Math.sqrt(dx * dx + dy * dy + dz * dz); 
}; 
Face.prototype.draw = function () { 
	const ctx = this.rubiks.ctx;
	// ---- shape face ---- 
	ctx.beginPath(); 
	ctx.moveTo(this.p0.X, this.p0.Y); 
	ctx.lineTo(this.p1.X, this.p1.Y); 
	ctx.lineTo(this.p2.X, this.p2.Y); 
	ctx.lineTo(this.p3.X, this.p3.Y); 
	ctx.closePath(); 
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
	// ---- fill ---- 
	ctx.fillStyle = 'rgba(' + 
						Math.round(rgb.r*light) + ',' + 
						Math.round(rgb.g*light) + ',' + 
						Math.round(rgb.b*light) + ',' + rgb.a + ')'; 
	ctx.fill(); 
};
Face.prototype.getRenderData = function(){
	
	this.normal.projection(); 
	const light = ( 
		false ? 
		this.normal.y + this.normal.z * 0.5 : 
		this.normal.z 
	); 
	//CHANGE: adds this. before g and b variables
	let r = this.g = this.b;
	const rgb = hexToRgb(this.color);
	r = Math.round(rgb.r*light).toString(16);
	this.g = Math.round(rgb.g*light).toString(16);
	this.b = Math.round(rgb.b*light).toString(16);
	r = r.length == 1 ? '0' + r : r;
	this.g = this.g.length == 1 ? '0' + this.g : this.g;
	this.b = this.b.length == 1 ? '0' + this.b : this.b;
	const fillColor = '#' + r + this.g + this.b;
	return {
		FillColor:fillColor,
		StrokeColor:null,
		LineWidth:null,
		Actions:[
			{
				Action:'move',
				x:this.p0.X,
				y:this.p0.Y
			},{
				Action:'line',
				x: this.p1.X, 
				y:this.p1.Y
			},{
				Action:'line',
				x: this.p2.X, 
				y:this.p2.Y
			},{
				Action:'line',
				x: this.p3.X, 
				y:this.p3.Y
			},{
				Action:'close'
			}
		]
	};
};
/**********************************
 * Cube Object
 **********************************/
const Cube = function(x, y, z, w, rubiks, colors) { 
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
};

RubiksCube.prototype.update = function(){
	if(this.flatCube && !this.rotating){
		this.blocks.forEach(function(block){
			const p = block.getPosition();
			const colors = block.getColors();
			this.flatCube.setColors(
				p.y < 0 ? 1 : p.y > 0 ? -1 : 0, 
				p.x < 0 ? -1 : p.x > 0 ? 1 : 0, 
				p.z < 0 ? -1 : p.z > 0 ? 1 : 0,
				colors
			);
		}, this);
	}
	if(!this.rotating){
		this.updateCallbacks.forEach(function(f){f();});
	}
};

RubiksCube.prototype.addUpdateCallback = function(f){
	this.updateCallbacks.push(f);
};

Cube.prototype.updateColors = function(colors){
	this.faces.forEach(function(face){
		const getColor = (color) => {
			switch (color){
				case 'cube_white':{
					return WHITE;
				}
				case 'cube_blue':{
					return BLUE;
				}
				case 'cube_green':{
					return GREEN;
				}
				case 'cube_red':{
					return RED;
				}
				case 'cube_orange':{
					return ORANGE;
				}
				case 'cube_yellow':{
					return YELLOW;
				}
			}	
		}
		if(colors[0] && face.normal.zo == 1)
			face.color = getColor(colors[0]);
		else if(colors[1] && face.normal.yo == 1)
			face.color = getColor(colors[1]);
		else if(colors[2] && face.normal.yo == -1)
			face.color = getColor(colors[2]);
		else if(colors[3] && face.normal.xo == 1)
			face.color = getColor(colors[3]);
		else if(colors[4] && face.normal.xo == -1)
			face.color = getColor(colors[4]);
		else if(colors[5] && face.normal.zo == -1)
			face.color = getColor(colors[5]);
	});
};

Cube.prototype.getColors = function(){
	const colors = [null,null,null,null,null,null];
	this.faces.forEach(function(face){
		if(face.normal.zo == 1)
			colors[0] = face.color;
		else if(face.normal.yo == 1)
			colors[1] = face.color;
		else if(face.normal.yo == -1)
			colors[2] = face.color;
		else if(face.normal.xo == 1)
			colors[3] = face.color;
		else if(face.normal.xo == -1)
			colors[4] = face.color;
		else if(face.normal.zo == -1)
			colors[5] = face.color;
	});
	return colors;
};

Cube.prototype.getPosition = function() {
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
Cube.prototype.setRotationAffine = function(){
	if(this.rotateX != 0 || this.rotateY != 0 || this.rotateZ != 0)
		this.rotationAffine = makeRotationAffine(this.rotateX, this.rotateY, this.rotateZ);
};
Cube.prototype.resetRotation = function() {
	const points = [];
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
Cube.prototype.getRenderData = function(){
	const result = [];
	const faces = [];
	let j = 0, p; 
	while ( p = this.points[j++] ) { 
		p.projection(); 
	}
	for(let k=0; k<this.faces.length; k++){
		this.faces[k].distanceToCamera();
		faces.push(this.faces[k]);
	}
	faces.sort(function (p0, p1) { 
		return p1.distance - p0.distance; 
	}); 
	// ---- painting faces ---- 
	j = 0; 
	while ( f = faces[j++] ) { 
		if (f.visible) { 
			result.push(f.getRenderData());
		} else break; 
	}

	return result;
};
function RubiksCube(canvas, width){
	this.canvas = document.getElementById(canvas);
	this.turnSpeed = 250;
	this.width = width;
	this.canvas.width = width;
	this.canvas.height = width;
	this.ctx = this.canvas.getContext('2d');
	this.blocks = [];
	this.points = [];
	this.faces = [];
	this.queue = [];
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
	this.updateCallbacks = [];
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
	this.solver = new RubiksCubeSolver();

}

RubiksCube.prototype.solve = function(progress) {
	const me = this;
	if(this.isSolvable()){
		// this.makeMoves(this.solver.solve(this.getState(), progress));
		this.solver.solveAsync(this.getState(), function(solution){
			me.makeMoves(solution);
		}, progress);
	}
};

RubiksCube.prototype.getSolutionAsync = function(callback, progress) {
	if(this.isSolvable()){
		this.solver.solveAsync(this.getState(), callback, progress);
	}
	callback('');
};

RubiksCube.prototype.getSolution = function() {
	if(this.isSolvable()){
		return this.solver.solve(this.getState());
	}
	return '';
};

RubiksCube.prototype.isSolvable = function(){
	return !this.rotating && this.solver.setState(this.getState());
};

RubiksCube.prototype.scramble = function(num) {
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
	const checkAgain = function(){
		setTimeout(function() {
			if(me.queue.length == 0){
				me.turnSpeed = turnSpeed;
			} else {
				checkAgain();
			}
			me.render();
		}, 10);
	};
	checkAgain();
};

RubiksCube.prototype.updateSize = function(size) {
	this.width = size;
	this.canvas.width = size;
	this.canvas.height = size;
};

RubiksCube.prototype.updateColors = function() {
	if(this.rotating){
		return;
	}
	this.blocks.forEach(function(block){
		const p = block.getPosition();
		const colors = this.flatCube.getColors( 
			p.y < 0 ? 1 : p.y > 0 ? -1 : 0, 
			p.x < 0 ? -1 : p.x > 0 ? 1 : 0, 
			p.z < 0 ? -1 : p.z > 0 ? 1 : 0
		);
		block.updateColors(colors);
	}, this);
	if(!this.rotating){
		this.updateCallbacks.forEach(function(f){f();});
	}
};

RubiksCube.prototype.render = function(){
		
	this.cameraAffine = makeRotationAffine(this.cameraX,this.cameraY,this.cameraZ);

	this.blocks.forEach(function(block){
		block.setRotationAffine();
	});

	this.points.forEach(function(point){
		point.projection();
	});

	this.faces.forEach(function(face){
		face.distanceToCamera();
	});

	this.faces.sort(function (p0, p1) { 
		return p1.distance - p0.distance; 
	}); 

	this.ctx.fillStyle = '#fafafa'; 
	this.ctx.fillRect(0, 0, this.width, this.width);
	for(let i=0; i<this.faces.length; i++){
		this.faces[i].draw();
	}
};

RubiksCube.prototype.opposites = {
	'F':'B',
	'B':'F',
	'T':'D',
	'D':'T',
	'R':'L',
	'L':'R'
};

RubiksCube.prototype.rotateFace = function(face, d){
	if(this.rotating)
		return;
	this.rotating = face;
	const blocks = this.getBlocks(face);
	const rotations = [];
	blocks.forEach(function(block){
		rotations.push({
			rotateY: block.rotateY,
			rotateX: block.rotateX,
			rotateZ: block.rotateZ
		});
	});

	const me = this;

	const start = Date.now();

	const duration = Math.abs(d)*this.turnSpeed;

	const rotate = function(){
		const p = Math.min((Date.now()-start)/duration, 1);
		blocks.forEach(function(block, i){
			if (face == 'F' || face == 'B' || face == 'Z')
				block.rotateX = rotations[i].rotateX + d*(Math.PI/2)*p;
			if(face == 'U' || face == 'D' || face == 'Y')
				block.rotateY = rotations[i].rotateY + d*(Math.PI/2)*p;
			if (face == 'L' || face == 'R' || face == 'X')
				block.rotateZ = rotations[i].rotateZ + d*(Math.PI/2)*p;
		});
		if(p >= 1){
			clearInterval(timer_render);
			timer_render = null;
			for(let i=0; i<blocks.length; i++){
				blocks[i].resetRotation();
			}
			me.rotating = false;
			me.update();
			me.makeNextMove();
		}
	};
	let timer_render = setInterval(() => {rotate();}, 10);
};

RubiksCube.prototype.getBlocks = function(face) {
	let result = [];
	if(face == 'B'){
		this.blocks.forEach(function(block){
			if(block.getPosition().x < 0)
				result.push(block);
		});
	}
	else if(face == 'F'){
		this.blocks.forEach(function(block){
			if(block.getPosition().x > 0)
				result.push(block);
		});
	}
	else if(face == 'U'){
		this.blocks.forEach(function(block){
			if(block.getPosition().y < 0)
				result.push(block);
		});
	}
	else if(face == 'D'){
		this.blocks.forEach(function(block){
			if(block.getPosition().y > 0)
				result.push(block);
		});
	}
	else if(face == 'L'){
		this.blocks.forEach(function(block){
			if(block.getPosition().z < 0)
				result.push(block);
		});
	}
	else if(face == 'R'){
		this.blocks.forEach(function(block){
			if(block.getPosition().z > 0)
				result.push(block);
		});
	} else if(face == 'X' || face == 'Y' || face == 'Z'){
		result = this.blocks;
	}
	return result;
};
RubiksCube.prototype.makeMoves = function(moves) {
	moves = moves.split(/\s/);
	for(let i=0; i<moves.length; i++){
		this.makeMove(moves[i]);
	}
};

RubiksCube.prototype.makeMove = function(move) {
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
	let counter = 0;
	const me = this;
	const timer = setInterval(function() {
		counter ++;
		if((me.turnSpeed + 100) < counter * 10){
			clearInterval(timer);
		}
		else
			me.render();
	}, 10);
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

RubiksCube.prototype.makeNextMove = function() {	
	if(this.queue.length > 0){
		this.makeMove(this.queue.shift());
	}
};

RubiksCube.prototype.getFaceColor = function(face){
	
	function getOutside(c){
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
			return getOutside(arrayFind(this.blocks, function(block){
				const p = block.getPosition();
				return (p.x == 0 && p.y > 0 && p.z == 0);
			}));
		case 'U':
			return getOutside(arrayFind(this.blocks, function(block){
				const p = block.getPosition();
				return (p.x == 0 && p.y < 0 && p.z == 0);
			}));
		case 'L':
			return getOutside(arrayFind(this.blocks, function(block){
				const p = block.getPosition();
				return (p.x == 0 && p.y == 0 && p.z < 0);
			}));
		case 'R':
			return getOutside(arrayFind(this.blocks, function(block){
				const p = block.getPosition();
				return (p.x == 0 && p.y == 0 && p.z > 0);
			}));
		case 'F':
			return getOutside(arrayFind(this.blocks, function(block){
				const p = block.getPosition();
				return (p.x > 0 && p.y == 0 && p.z == 0);
			}));
		case 'B':
			return getOutside(arrayFind(this.blocks, function(block){
				const p = block.getPosition();
				return (p.x < 0 && p.y == 0 && p.z == 0);
			}));
	}
};
// var faceNames = ['L', 'U', 'D', 'B', 'F', 'R'];
RubiksCube.prototype.getCubie = function(position){
	const cubes = this.getBlocks(position[0]);
	switch(position){
		//Edge piece
		case 'UF':
		case 'DF':
			return arrayFind(cubes, function(c){
				const p = c.getPosition();
				return p.z == 0 && p.x > 0;
			});
		case 'UB':
		case 'DB':
			return arrayFind(cubes, function(c){
				const p = c.getPosition();
				return p.z == 0 && p.x < 0;
			});
		case 'UR':
		case 'DR':
			return arrayFind(cubes, function(c){
				const p = c.getPosition();
				return p.z > 0 && p.x == 0;
			});
		case 'UL':
		case 'DL':
			return arrayFind(cubes, function(c){
				const p = c.getPosition();
				return p.z < 0 && p.x == 0;
			});
		case 'FR':
		case 'BR':
			return arrayFind(cubes, function(c){
				const p = c.getPosition();
				return p.z > 0 && p.y == 0;
			});
		case 'FL':
		case 'BL':
			return arrayFind(cubes, function(c){
				const p = c.getPosition();
				return p.z < 0 && p.y == 0;
			});
		//Corner Cubie
		case 'UFR':
		case 'DRF':
			return arrayFind(cubes, function(c){
					const p = c.getPosition();
					return p.z > 0 && p.x > 0;
				});
		case 'URB':
		case 'DBR':
			return arrayFind(cubes, function(c){
					const p = c.getPosition();
					return p.z > 0 && p.x < 0;
				});
		case 'UBL':
		case 'DLB':
			return arrayFind(cubes, function(c){
					const p = c.getPosition();
					return p.z < 0 && p.x < 0;
				});
		case 'ULF':
		case 'DFL':
			return arrayFind(cubes, function(c){
					const p = c.getPosition();
					return p.z < 0 && p.x > 0;
				});
	}
};

RubiksCube.prototype.faceNames = ['L', 'U', 'D', 'B', 'F', 'R'];

RubiksCube.prototype.getState = function(){
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
	const getFaceColor = function(c, direction){
		//direction is a string 'x', 'y', or 'z'
		let result=null;
		let max = 0;
		c.faces.forEach(function(f){
			//CHANGE: add const
			const p = averageUnRotatedPoints([f.p0,f.p1, f.p2, f.p3]);
			if(Math.abs(p[direction]) > max){
				max = Math.abs(p[direction]);
				result = f.color;
			}
		});
		return result;
	};
	this.faceNames.forEach(function(face){
		colorToFace[me.getFaceColor(face)] = face;
	});
	
	cubicles.forEach(function(cubicle){
		const c = me.getCubie(cubicle);
		let cubieName = '';
		cubicle.split('').forEach(function(face){
			const color = getFaceColor(c, faceToDirection[face]);
			cubieName += colorToFace[color];
		});
		result += cubieName + ' ';
	});
	
	return result.trim();
};
//solver.js
// SSSSSSSS   OOOOOO   LL      VV    VV  EEEEEEE  RRRRRR
// SS        OO    OO  LL      VV    VV  EE       RR   RR
// SSSSSSSS  00    00  LL       VV  VV   EEEEEEE  RRRRR
//       SS  00    00  LL        VVVV    EE       RR  RR
// SSSSSSSS   000000   LLLLLL     VV     EEEEEEE  RR   RR

/*
  This is an implementation of Thistlewaite's algorithm in javascript:
  (http://en.wikipedia.org/wiki/Optimal_solutions_for_Rubik's_Cube#Thistlethwaite.27s_algorithm)

  The Rubik's cube has 20 cubicles, the cubicles are fixed positions on the cube where cubies reside
  Each cubie is named after the cubicle it belongs in. A cubicle is named by the faces it has.
  The faces are labeled as: {U: up, D: down, R: right, L: left, F: front, B: back}

  To solve a cube you pass it a string of the current state of the cube that looks like:
  UF UR UB UL DF DR DB DL FR FL BR BL UFR URB UBL ULF DRF DFL DLB DBR (<-- is an already solved cube)

  The first 12 pairs correspond to the cubicle of the Rubik's cube
  For a scrambled cube you put the cubie that is in the cubicle in the order presented above.
  An example of a scramble cube is:
  BR DF UR LB BD FU FL DL RD FR LU BU UBL FDR FRU BUR ULF LDF RDB DLB

 */

 /*The state of the Rubik's cube is the position of the cubies at each of the 20 non-center locations
  * We number the cubies in the following order:
  * 
  *                    -------------------
  *                    |     |     |     |
  *                    |     |     |     |
  *                    |     |     |     |
  *                    -------------------
  *                    |     |     |     |
  *                    |  11 |  B  |  10 |
  *                    |     |     |     |
  *                    -------------------
  *                    |     |     |     |
  *                    |     |     |     |
  *                    |     |     |     |
  *  =======================================================
  *  |     |     |     |     |     |     |     |     |     |
  *  |     |     |     |  14 |  2  |  13 |     |     |     |
  *  |     |     |     |     |     |     |     |     |     |
  *  -------------------------------------------------------
  *  |     |     |     |     |     |     |     |     |     |
  *  |     |  L  |     |  3  |  U  |  1  |     |  R  |     |
  *  |     |     |     |     |     |     |     |     |     |
  *  -------------------------------------------------------
  *  |     |     |     |     |     |     |     |     |     |
  *  |     |     |     |  15 |  0  |  12 |     |     |     |
  *  |     |     |     |     |     |     |     |     |     |
  *  =======================================================
  *                    |     |     |     |
  *                    |     |     |     |
  *                    |     |     |     |
  *                    -------------------
  *                    |     |     |     |
  *                    |  9  |  F  |  8  |
  *                    |     |     |     |
  *                    -------------------
  *                    |     |     |     |
  *                    |     |     |     |
  *                    |     |     |     |
  *                    ===================
  *                    |     |     |     |
  *                    |  17 |  4  |  16 |
  *                    |     |     |     |
  *                    -------------------
  *                    |     |     |     |
  *                    |  7  |  D  |  5  |
  *                    |     |     |     |
  *                    -------------------
  *                    |     |     |     |
  *                    |  18 |  6  |  19 |
  *                    |     |     |     |
  *                    -------------------
*/

// /**********************************************************************
//  * 
//  * A cube 'state' is a Array<int> with 40 entries, the first 20
//  * are a permutation of {0,...,19} and describe which cubie is at
//  * a certain position (regarding the input ordering). The first
//  * twelve are for edges, the last eight for corners.
//  * 
//  * The last 20 entries are for the orientations, each describing
//  * how often the cubie at a certain position has been turned
//  * counterclockwise away from the correct orientation. Again the
//  * first twelve are edges, the last eight are corners. The values
//  * are 0 or 1 for edges and 0, 1 or 2 for corners.
//  * 
//  **********************************************************************/
//CHANGE: added const
const RubiksCubeSolver = function(){
	this.phase = 0;
	this.currentState = null;
	this.goalState = null;
};

RubiksCubeSolver.prototype.applyMove = function(move, inState) {
	const affectedCubies = [
		[0,  1,  2,  3,  0,  1,  2,  3],   // U
		[4,  7,  6,  5,  4,  5,  6,  7],   // D
		[0,  9,  4,  8,  0,  3,  5,  4],   // F
		[2, 10,  6, 11,  2,  1,  7,  6],   // B
		[3, 11,  7,  9,  3,  2,  6,  5],   // L
		[1,  8,  5, 10,  1,  0,  4,  7],   // R
	];
	let turns = move % 3 + 1;
	const face = Math.floor(move / 3);
	const state = inState.slice();
	while(turns--> 0){
		const oldState = state.slice();
		for(let i=0; i<8; i++ ){
			const isCorner = i > 3;
			const target = affectedCubies[face][i] + isCorner*12;
			const killer = affectedCubies[face][(i&3)==3 ? i-3 : i+1] + isCorner*12;
			const orientationDelta = (i<4) ? (face>1 && face<4) : (face<2) ? 0 : 2 - (i&1);
			state[target] = oldState[killer];
			state[target+20] = oldState[killer+20] + orientationDelta;
			if(turns == 0)
				 state[target+20] %= 2 + isCorner;
		}
	}
	return state;
};

RubiksCubeSolver.prototype.inverse = function(move) {
	return move + 2 - 2 * (move % 3);
};

RubiksCubeSolver.prototype.getId = function(state) {
	//--- Phase 1: Edge orientations.
	if(this.phase < 2)
		return JSON.stringify(state.slice(20,32));
	
	//-- Phase 2: Corner orientations, E slice edges.
	if(this.phase < 3){
		var result = state.slice(31,40);
		for(var e=0; e<12; e++)
			result[0] |= (Math.floor(state[e] / 8)) << e;
		return JSON.stringify(result);
	}
	
	//--- Phase 3: Edge slices M and S, corner tetrads, overall parity.
	if(this.phase < 4){
		var result = [0,0,0];
		for(var e=0; e<12; e++)
			result[0] |= ((state[e] > 7) ? 2 : (state[e] & 1)) << (2*e);
		for(let c=0; c<8; c++)
			result[1] |= ((state[c+12]-12) & 5) << (3*c);
		for(let i=12; i<20; i++)
			for(let j=i+1; j<20; j++)
				result[2] ^= state[i] > state[j];
		return JSON.stringify(result);
	}
	
	//--- Phase 4: The rest.
	return JSON.stringify(state);
};

// //----------------------------------------------------------------------

RubiksCubeSolver.prototype.setState = function(cube) {
	cube = cube.split(' ');
	if(cube.length != 20){
		this.currentState = 'Not enough cubies provided';
		return false;
	}
	//--- Prepare current (start) and goal state.
	const goal = ['UF', 'UR', 'UB', 'UL', 'DF', 'DR', 'DB', 'DL', 'FR', 'FL', 'BR', 'BL', 'UFR', 'URB', 'UBL', 'ULF', 'DRF', 'DFL', 'DLB', 'DBR'];
	this.currentState = new Array(40);
	this.goalState = new Array(40);
	for(var i=0; i<40; i++){
		this.currentState[i] = 0;
		this.goalState[i] = 0;
	}
	for(var i=0; i<20; i++){
		
		//--- Goal state.
		this.goalState[i] = i;
		
		//--- Current (start) state.
		let cubie = cube[i];
		while((this.currentState[i] = goal.indexOf(cubie)) == -1){
			cubie = cubie.substr(1) + cubie[0];
			this.currentState[i+20]++;
			if(this.currentState[i+20] > 2){
				this.currentState = 'Cannot solve: Invalid painting of cube.';
				return false;
			}
		}
		goal[goal.indexOf(cubie)] = '';
	}
	return this.verifyState();
};

RubiksCubeSolver.prototype.verifyState = function() {
	if(!Array.isArray(this.currentState))
		return false;
	//orientation of edges
	let sum = 0;
	this.currentState.slice(20,32).forEach(function(edge){
		sum+=edge;
	});
	if(sum % 2 != 0){
		//edge orientation
		this.currentState = 'Cannot solve: Edges not oriented correctly.';
		return false;
	}
	sum = 0;
	//orientation of corners
	this.currentState.slice(32,40).forEach(function(edge){
		sum+=edge;
	});
	if(sum % 3 != 0){
		//corner orientation
		this.currentState = 'Cannot solve: Corners not oriented correctly';
		return false;
	}

    const getParity = function(a){
    	let count = 0;
		for(let i = 0; i<a.length; i++){
			for(let j=0; j<i; j++){
				if(a[j] > a[i]){
					count++;
					const temp = a[i];
					a[i] = a[j];
					a[j] = temp;
				}
			}
		}
		return count;
    };
	//check for parity
	sum = 0;
	       //edge parity
	sum += getParity(this.currentState.slice(0,12));
	       //corner parity
	sum += getParity(this.currentState.slice(12,20));
	if (sum % 2 != 0){
		this.currentState = 'Cannot solve: Parity error only one set of corners or edges swapped.' ;
		return false;
	}

	return true;
};


RubiksCubeSolver.prototype.solve = function(cube) {
	this.solution = '';
	this.phase = 0;  
	
	if(cube){
		if(!this.setState(cube))
			return false;
	}
	else if(!this.verifyState())
		return false;

	while(++this.phase < 5){
		this.startPhase();
	}
	this.prepareSolution();
	return this.solution;
};

RubiksCubeSolver.prototype.solveAsync = function(cube, callback, progress) {
	this.solution = '';
	this.phase = 1;
	if(cube){
		if(!this.setState(cube)){
			callback(false);
			return;
		}
	} else if(!this.verifyState()){
		callback(false);
		return;
	}

	const nextPhase = function(){
		if(this.phase < 5){
			this.startPhase();
			progress && progress(this.phase/5);
			this.phase++;
			setTimeout(nextPhase.bind(this), 0);
		} else {
			progress && progress(1);
			this.prepareSolution();
			callback(this.solution);
		}
	};

	nextPhase.bind(this)();
};

RubiksCubeSolver.prototype.startPhase = function() {
	//--- Compute ids for current and goal state, skip phase if equal.
	const currentId = this.getId(this.currentState), goalId = this.getId(this.goalState);
	if(currentId == goalId)
		return;
	//--- Initialize the BFS queue.
	const q = [];
	q.push(this.currentState);
	q.push(this.goalState);
	
	//--- Initialize the BFS tables.
	const predecessor = {};
	const direction = {}, lastMove = {};
	direction[currentId] = 1;
	direction[goalId] = 2;
	
	//--- Begin BFS search
	while(1){
		//--- Get state from queue, compute its ID and get its direction.
		const oldState = q.shift();
		var oldId = this.getId(oldState);
		const oldDir = direction[oldId];
		
		//--- Apply all applicable moves to it and handle the new state.
		const applicableMoves = [0, 262143, 259263, 74943, 74898];
		for(let move=0; move<18; move++){
			if(applicableMoves[this.phase] & (1 << move)){
				
				//--- Apply the move.
				const newState = this.applyMove(move, oldState);
				var newId = this.getId(newState);
				const newDir = direction[newId];
				
				//--- Have we seen this state (id) from the other direction already?
				//--- I.e. have we found a connection?
				if( newDir  &&  newDir != oldDir ){
					//--- Make oldId represent the forwards and newId the backwards search state.
					if(oldDir > 1){
						const temp = newId;
						var newId = oldId;
						var oldId = temp;
						move = this.inverse(move);
					}
					
					//--- Reconstruct the connecting algorithm.
					const algorithm = [move];
					while(oldId != currentId){ 
						algorithm.unshift(lastMove[oldId]);
						oldId = predecessor[ oldId ];
					}
					while(newId != goalId){
						algorithm.push(this.inverse(lastMove[newId]));
						newId = predecessor[newId];
					}
					
					//--- append to the solution and apply the algorithm.
					for(let i=0; i<algorithm.length; i++ ){
						for(let j=0; j<algorithm[i]%3 + 1; j++)
							this.solution += 'UDFBLR'[Math.floor(algorithm[i]/3)];
						this.currentState = this.applyMove(algorithm[i], this.currentState);
					}
					
					//--- Jump to the next this.phase.
					return;
				}
				
				//--- If we've never seen this state (id) before, visit it.
				if(!newDir){
					q.push(newState);
					direction[newId] = direction[oldId];
					lastMove[newId] = move;
					predecessor[newId] = oldId;
				}
			}
		}
	}
};

RubiksCubeSolver.prototype.prepareSolution = function(){
	let moves = this.solution.match(/(\w)\1*/g);
	if(!moves){
		this.solution = '';
		return;
	}
	const opposites = {'F':'B','B':'F','T':'D','D':'T','R':'L','L':'R'};
	let result = '';
	for(let i=0; i<moves.length-2; i++){
		if(moves[i][0] == moves[i+2][0] && opposites[moves[i+1][0]] == moves[i][0]){
			const temp = moves[i+2];
			moves[i+2] = moves[i+1];
			moves[i+1] = temp;
			i = 0;
		}
	}
	moves = moves.join('').match(/(\w)\1*/g);
	moves.forEach(function(move){
		if(move.length % 4 == 1)
			result += move[0];
		else if(move.length % 4 == 2)
			result += move[0] + '2';
		else if(move.length % 4 == 3)
			result += move[0] + '\'';
		else if(move.length % 4 == 0)
			return;
		result += ' ';
	});
	this.solution = result.trim();
};

export {RubiksCube, FlatCube, RubiksCubeControls, FlatColorPicker, makeIdentityAffine, makeRotationAffine, makeRotateAffineX, makeRotateAffineY, multiplyAffine};