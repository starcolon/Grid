# Grid
Grid module for virtualization projects
[![Build Status](https://travis-ci.org/starcolon/Grid.svg?branch=master)](https://travis-ci.org/starcolon/Grid)



The library is more designed in functional programming sense than an object-oriented discipline. Grid is actually a set of pure functions that manipulate generic two-dimensional arrays. The module itself does not and will not define its own data type. It just basically comprises a purely functional sets of operations.

## Include the library to the project
Grid can simply be included to a node project by `require`:

```javascript
var Grid = require('.\grid.js').Grid;
```

## Create an empty grid
A grid object is represented by a native JS two-dimensional array. You can either manually create your own two-dimensional array as a grid or simply call:

```javascript
var grid = Grid.create(7,5); // Create a 5x7 matrix (a grid with 7 columns, 5 rows)
```

## Create an empty grid with initial value
Supply the third parameter as a value like this:
```javascript
var grid = Grid.create(7,7,'value');
```

## Duplicate a grid
To duplicate (deep copy) a grid structure and content, call:
```javascript
var newgrid = Grid.duplicate(grid);
```

## Duplicate a grid, but overwrite the values
You can duplicate a grid structure but replace it with the new values by:
```javascript
var newgrid = Grid.duplicateStructure(grid, 255);
```

If the second parameter is omitted, the value is set to zero.


## Add a row or column to a grid
This add a row, column at the specied index:
```javascript
var padded = Grid.addCol(grid)(10); // add column at 10
var foo = Grid.addRow(grid)(2); // add row at 2
```

## Remove a row or column
Need to supply an index of the row or column to remove:
```javascript
var newgrid = Grid.removeCol(grid)(7); 
var smallergrid = Grid.removeRow(grid)(3);
```

## Cell operations
Grid comes with a number of cell operations as follow:

### Lookup siblings
Given a coordinate of a cell, we can list the sibling coordinates as follows:
```javascript
var siblings = Grid.siblings(grid)(1,3); // siblings of cell(1,3)
```

The returned value is an array of sibling coordinates. Each coordinate is denoted in a form of two-column array, `e.g. [2,3]`

### Get JSON formatted coordinate
To wrap a coordinate with JSON format e.g., `{i:50, j:25}`, call this:
```javascript
var coord = Grid.cell(50,25).coord();
```

### Examine if a coordinate belongs to the grid
Simply call this:
```javascript
Grid.cell(22,1).isIn(grid);
```

Or an equivalent way:
```javascript
Grid.has(g,22,1);
Grid.contains(g,22,1);
```

To check if a coordinate does not belong to the grid
```javascript
Grid.cell(50,50).isNotIn(grid);
```

### To set the value of a single cell
```javascript
Grid.cell(50,50).set(3);
```

### To set the value of cells given the condition
Multiple cell value assignments by condition can be done by this function:
```javascript
Grid.eachOf(grid).where(condition).setTo(3);
Grid.eachOf(grid).where(condition).setValue(3); // Another variant
Grid.eachCellOf(grid).where(condition).setValue(3); // Yet another variant
```

Where a condition is expressed in a function which takes the value and coordinate that looks like {i:0,j:0}
```javascript
var condition = function(value,coord){ 
    if (coord.i>0 && coord.j>10) return true; else return false; 
}
```

If the where clause is not supplied, all cells are applied exhaustively:
```javascript
Grid.eachOf(grid).setTo(0);
```

### Count the number of cells
Where clause can be applied as a condition also:
```javascript
var countAll = Grid.eachOf(grid).count();
var countNegative = Grid.eachOf(grid).where(function(value,coord){
	return value<0
}).count();
```

### Map
Where clause can also be supplied to filter only certain cells:
```javascript
Grid.eachOf(grid).do(function(value,coord){ return value*2 }); // multiple each cell by two
Grid.eachOf(grid).map(Math.sqrt); // Another variant
Grid.eachOf(grid).where(fn).map(Math.sqrt); // Supply where clause
```
