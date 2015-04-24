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
		var siblings = [
			[i-1, j],
			[i+1, j],
			[i, j-1],
			[i, j+1]
		];
		return siblings;
	}
}

/*
 * Iterate through each sibling and commit an action on it
 * NOTE: The value in each sibling is not mutable by the function.
 * @param {grid}
 */
Grid.eachSibling = function(grid){
	return function(i,j){
		return function(F){
			var siblings = Grid.siblings(grid)(i,j);
			siblings.forEach(function(coord){
				F(Grid.cell(coord[0],coord[1]).of(grid));
			});
		}
	}
}

Grid.rows = function(j){}
Grid.cols = function(i){}













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
		if (typeof(grid[self.i])=='undefined') return false;
		return (typeof(grid[self.i][self.j])!='undefined');
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
