/*
 * The MIT License
 * 
 *  Copyright (c) 2015 Tao P.R. (StarColon Projects)
 * 
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 * 
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 * 
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */

 /**
  * [grid.js] 
  * A simple utility to simulate a bounded grid for virtualization purpose.
  * Grid is implemented in a functional way rather than an OOP discipline.
  *
  * Key data structures are:
  * [grid] - A fully-linked cells
  * [cell] - Each cell floats with a loose link to its 4 neighbors
  * @author Tao PR
  */

var _ = require('underscore');

/**
 * Grid namespace, not to be used as a class
 */
var Grid = function(){}

/**
 * Create a grid object 
 * @param {Integer} numRow
 * @param {Integer} numCol
 * @param {Any} defaultValue
 * @returns {grid}
 */
Grid.create = function(numRow,numCol,defaultValue){
	if (numRow * numCol <= 0) 
		throw "Number of columns and rows must be positive integer." 

	defaultValue = defaultValue || 0;
	var grid = [];

	_(numCol).times(function populateRow(){
		var row = [];
		_(numRow).times(function(){row.push(defaultValue)});
		grid.push(row);	
	});

	return grid;
}

/**
 * Duplicate a grid object (deep copy)
 * @param {grid}
 * @returns {grid}
 */
Grid.duplicate = function(grid){}

/**
 * Remove a row from a grid
 * @param {grid}
 * @returns {Closure}
 */
Grid.removeRow = function(grid){
	return function(n){
		// Iterate through each column, remove the n-th row
		grid.forEach(function(col,i){
			if (grid[i].hasOwnProperty(n))
				grid[i].splice(n,1);
		});
	}
}

/**
 * Remove a column from a grid
 * @param {grid}
 * @returns {Closure}
 */
Grid.removeCol = function(grid){
	return function(n){
		grid.splice(n,1);
	}
}


/**
 * Add a row to a grid. This won't insert if already exist.
 * @param {grid}
 * @returns {Closure}
 */
Grid.addRow = function(grid){
	return function(n,len){
		// Iterate through each column, add the n-th row
		grid.forEach(function(col,i){
			if (!grid[i].hasOwnProperty(n))
				grid[i][n] = new Array(len);
		});
	}
}

/**
 * Add a column to a grid. This won't insert if already exist.
 * @param {grid}
 * @returns {Closure}
 */
Grid.addCol = function(grid){
	return function(n,len){
		if (!grid.hasOwnProperty(n))
			grid[n] = new Array(len);
	}
}

/**
 * List sibling coordinates of a specified coordinate
 * @param {grid}
 * @returns {Array} array of a coordinates
 */
Grid.siblings = function(grid){
	return function (i,j){
		var sib = [
			[i-1, j],
			[i+1, j],
			[i, j-1],
			[i, j+1]
		];

		var qualifiedSiblings = [];
		sib.forEach(function(s){
			var a = s[0], b = s[1];
			if (Grid.has(grid)(a,b))
				qualifiedSiblings.push([a,b]);
		});

		return qualifiedSiblings;
	}
}


/**
 * Determine if a coordinate (i,j) is in the grid
 * @param {Grid}
 */
Grid.has = Grid.contains = function(grid){
	return function(i,j){
		return (i in grid && j in grid[i]);
	}
}

/**
 * Iterate through each cell in the grid and commit an action
 */
Grid.eachCell = function(grid){
	return function(F){
		grid.forEach(function (col,i){
			col.forEach(function(cell,j){
				F(cell,i,j);
			})
		})
	}
}

/**
 * Iterate through each sibling and commit an action on it
 * Usage: Grid.eachSibling(grid)(5,3)(doSomething)
 * @param {grid}
 */
Grid.eachSibling = function(grid){
	return function(i,j){
		return function(F){
			var siblings = Grid.siblings(grid)(i,j);
			siblings.forEach(function(coord){
				var i = coord[0], j = coord[j];
				var value = Grid.cell(i,j).of(grid);
				F(value, i, j);
			});
		}
	}
}


/**
 * Calculate the block distance of a route between two coordinates
 */
Grid.distance = function(coord1, coord2){
	return Math.abs(coord1.i-coord2.i) + Math.abs(coord1.j-coord2.j)
}


/**
 * Traverse through the grid 
 * @param {grid}
 */
Grid.traverse = function(grid){


	/** 
	 * Grid.traverse(grid).from(i,j)
	 * Define where to start traversal
	 */
	this.from = function(i,j){

		var startAt = [i,j];
		var route = [{i:i, j:j}];
		
		/**
		 * Grid.traverse(grid).from(i,j).to(m,n)
		 * Walk straight to the coordinate
		 */
		this.to = function(m,n){
			var stopAt = [m,n];
			
			// Construct a route from the beginning point to the target point
			nextStep(startAt, stopAt, 1);

			/**
			 * Get the route array
			 * @returns {Array} Array of coordinates in the route
			 */
			this.route = function(){
				return route;
			}


			/**
			 * Measure how far from begin to end 
			 * @returns {Integer} block distance of the route
			 */
			this.distance = this.len = function(){
				return route.length;
			}


			/**
			 * Translate route into directions
			 * @returns {Array}
			 */
			this.directions = function(){
				var directions = [];
				_.reduce(route, function(previous,next){
					directions.push(direction(previous,next));
					previous = next;
					return previous;
				})
				return directions;
			}

			return this;
		}


		function deepPosEqual(pos1,pos2){
			return pos1[0]===pos2[0] && pos1[1]===pos2[1]
		}


		/**
		 * Step to the next pos until it reaches the end
		 * Also construct the route as it goes
		 * @param {Array} pos - starting point 
		 * @param {Array} end - ending point
		 * @param {Integer} i - coordinate index (1=row, 0=col)
		 * @returns {Array} the last position
		 */
		function nextStep(pos,end,i){
			if (deepPosEqual(pos,end)){
				// addRoute(pos);
				return pos;
			}
			else if (pos[i]!==end[i]){
				pos[i] = pos[i]<end[i] ? pos[i]+1 : pos[i]-1;
				addRoute(pos);
				pos = nextStep(pos,end,i);
			}
			else if (i>0)
				pos = nextStep(pos,end,i-1);
			else{
				return pos;
			}
		}

		function addRoute(pos){
			route.push({i:pos[0], j:pos[1]});
		}


		function direction(from, to){
			if (from.i<to.i)
				return 'RIGHT';
			else if (from.i>to.i)
				return 'LEFT';
			else if (from.j<to.j)
				return 'DOWN';
			else if (from.j>to.j)
				return 'UP';
			else
				return null;
		}


		return this;
	}



	return this;
}












/** 
 * Cell metaclass
 * @param {Integer} i
 * @param {Integer} j
 */
Grid.cell = function(i,j){ 
	if ((typeof(i) != 'number') || (typeof(j) != 'number'))
		throw 'Coordinate i, j must be defined as integer';

	// Assign the coordinate reference
	this.i = i; this.j = j; 

	var self = this;

	/**
	 * Grid.cell(i,j).of(grid) - Returns a cell value
	 * If the cell does not belong to the grid, it throws an error
	 * @param {grid}
	 * @returns {Object} any value stored in the cell
	 */
	this.of = function(grid){
		if (this.isNotIn(grid))
			return undefined;
		return grid[i][j];
	}

	/**
	 * Grid.cell(i,j).set(grid)(0xFF) - Set a value of a cell
	 * @param {grid}
	 * @returns {Closure}
	 */
	this.set = function(grid){
		return function(value){
			if (self.isNotIn(grid))
				self.addTo(grid);
			grid[self.i][self.j] = value;
		}
	}

	/**
	 * Grid.cell(i,j).coord() - Returns a coordinate JSON object
	 * @returns {JSON}
	 */
	this.coord = function(){
		return {i: self.i, j: self.j}
	}


	/** 
	 * Grid.cell(i,j).isIn(grid) - Check if a cell is in the grid
	 * @param {grid}
	 * @returns {True/False}
	 */
	this.isIn = function(grid){
		return Grid.has(grid)(i,j)
	}

	/**
	 * Grid.cell(i,j).isNotIn(grid) - Check if a cell is not in the grid
	 * @param {grid}
	 * @returns {True/False}
	 */
	this.isNotIn = function(grid){
		return !this.isIn(grid)
	}

	/**
	 * Grid.cell(i,j).addTo(grid) - Add a cell to a grid at the specified coordinate
	 * @param {grid}
	 * @returns {True/False} false if the cell is not added
	 */
	this.addTo = function(grid){
		// Grid already contains the cell at the certain coordinate?
		if (this.isIn(grid))
			return false;

		// Register a cell
		if (!grid.hasOwnProperty(this.i))
			grid[this.i] = [];
		if (!grid[i].hasOwnProperty(this.j))
			grid[this.i][this.j] = [];

		return true;
	}

	/**
	 * Grid.cell(i,j).siblings(grid) - Equivalent to Grid.siblings(grid)(i,j)
	 * @param {grid}
	 */
	this.siblings = function(grid){
		return Grid.siblings(grid)(i,j);
	}

	return this; 
}

// Export the module for node.js app
if (typeof(exports)!='undefined') 
	exports.Grid = Grid;
