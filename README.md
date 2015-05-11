# Grid
[![Build Status](https://travis-ci.org/starcolon/Grid.svg?branch=master)](https://travis-ci.org/starcolon/Grid)

Grid module for virtualization projects



The library is more designed in functional programming sense than an object-oriented discipline. Grid is actually a set of pure functions that manipulate generic two-dimensional arrays. The module itself does not and will not define its own data type. It just basically comprises a purely functional sets of operations.

## Prerequisite
Grid is designed specifically for some ECMAScript 6 features on {iojs}. Thus, basically, it won't run on the old (0.X.X `node.js`). You'll need an `iojs` on your machine.

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


### To get the value of a single cell
```javascript
Grid.cell(50,50).of(grid);
```

### To set the value of a single cell
```javascript
Grid.cell(50,50).set(grid)(3);
```

### To alter a property of a single cell
```javascript
Grid.cell(50,50).applyProperty(grid)('v',function(v){return v*2}); // sqr the cell.v
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

### To alter a property of each cell
In case we want to apply a function (mapper) onto a specific property of each cell which satisfy the `where` clause, use:
```javascript
Grid.eachOf(grid).applyProperty('value',Math.sqrt); // Sqrt all cell.value
```

### To add a specific cell to the grid
In case you need to add a new cell outside of the current boundary of the grid, call this:
```javascript
Grid.cell(70,70).addTo(grid); // The value needs to be assign later on
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


## Traversal
Grid allows the developer to easily traverse between any two points in the grid. Traversal functions in Grid library does not consider the values, it is just a set of blind operations.

### Construct a blind route between two points
This just constructs an array of the coordinates between two given points in the grid. It throws an exception if it cannot draw a straight line betweeen them.

```javascript
var straightroute = Grid.traverse(grid).from(1,1).to(5,3).route();
```

What it returns is an array of the JSON-like coordinate, e.g.:
```javascript
straightroute = [{i:1,j:1},{i:1,j:2},{i:1,j:3}]
```

If you just want a block distance (of such route) between two points, call this:
```javascript
var distance = Grid.traverse(grid).from(1,1).to(5,3).distance();
```

### Get a series of directions from a point to another
If you want to know how to move from a point to another in a grid, call this:
```javascript
var directions = Grid.traverse(grid).from(1,1).to(5,3).directions();
// returns something like ['DOWN','DOWN','RIGHT','RIGHT','LEFT']
```

### Given a series of directions, construct me a route
If you have an array definition of directions like: `['LEFT','UP','UP',RIGHT']`, you can call the function below to construct an array of blocks which construct a route accordingly:

```javascript
var route = Grid.traverse(grid).from(1,1).go(['DOWN','RIGHT','RIGHT']);
// returns something like [{i:1,j:1},{i:1,j:2},{i:2,j:2},{i:3,j:2}]
```

## Lee's routing algorithm
Grid implements `Lee's routing algorithm` which can be called by:

```javascript
var route = Grid.routeOf(grid).from(5,5).to(6,25).lee();
// returns something like [{i:5,j:5},{i:6,j:5},{i:6,j:6} ... {i:6,j:25}]
```

You can also supply a where clause to narrow down the area in the grid where it is eligible to construct a path through like this:
```javascript
var isWalkableThrough = function(value,coord){ return value>10 };
var route = Grid.routeOf(grid).from(5,5).to(6,25).where(isWalkableThrough).lee();
```

## A* routing algorithm
A simple A* search can be done easily in Grid. Simply call this function with a cost function supplied:

```javascript
function cost(value, coord){ /* returns positive cost value */ };
var route = Grid.routeOf(grid).from(5,5).to(6,25).astar(cost);
```
Where clause can also be applied to filter the cells. Also, if `cost` function is omitted, all cells are equally prioritized.


## Floodfill algorithm
Grid allows you to do a simple floodfill where conditions are applied.
For example, if you want to floodfill your grid starting from (2,2) where the value is negative, do this:

```javascript
function isNegative(value,coord){ return value<0 };
var coordList = Grid.floodfill(grid).where(isNegative).commit();
// returns an array of coordinates which has been filled e.g. [{i:2,j:2},{i:3,j:2}]
```
