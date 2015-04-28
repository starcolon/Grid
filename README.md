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
