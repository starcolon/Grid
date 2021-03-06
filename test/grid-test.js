var assert = require('assert');
var chai = require('chai');
var expect = chai.expect;
chai.should();
chai.use(require('chai-things'));
chai.config.includeStack = true;

"use strict";


// Dependency
var Grid = require('../grid.js').Grid;

describe('Grid basic test', function(){

	describe('Fundamental Grid namespace test', function(){

		var g = Grid.create(5,5);

		it('should create a 5x5 grid', function(){
			g.should.have.length(5);
			g[0].should.have.length(5);
		});

		it('should duplicate a grid', function(){
			g_new = Grid.duplicate(g);

			g_new.should.deep.equal(g);
		});

		it('should duplicate a grid structure and overwrite values with A', function(){
			g_new = Grid.duplicateStructure(g,'A');

			g_new.should.all.deep.equal(['A','A','A','A','A']);
		})

		it('should add a column, becomes a 5x6 grid', function(){
			Grid.addCol(g)(5);
			g.should.have.length(6);
		});

		it('should add a row, becomes a 6x6 grid', function(){
			Grid.addRow(g)(5);
			g.should.have.length(6);
			g[0].should.have.length(6);
		});

		it('should add the 99th column', function(){
			Grid.addCol(g)(99);
			g.should.have.property(99);
		})

		it('should remove 99th column', function(){
			Grid.removeCol(g)(99);
			g.should.not.have.property(99);
		}) 

		it('should remove a row, becomes 5x6 grid', function(){
			Grid.removeRow(g)(5);
			g[0].should.not.have.property(5);
			g[5].should.not.have.property(5);
		});

		it('should list sibling coordinates', function(){
			var siblings = Grid.siblings(g)(2,3);
			siblings.should.not.contain.an.item.deep.equal([2,3]);
			siblings.should.contain.an.item.deep.equal([2,2]);
			siblings.should.contain.an.item.deep.equal([2,4]);
			siblings.should.contain.an.item.deep.equal([3,3]);
			siblings.should.contain.an.item.deep.equal([1,3]);
		})

		it('should list sibling coordinates excluding out-of-bound ones', function(){
			var siblings = Grid.siblings(g)(0,1);
			siblings.should.have.length.below(4);
		})


	});

	describe('Fundamental Grid.cell namespace test', function(){
		var g = Grid.create(10,10,0);

		it('should returns a right coordinate', function(){
			expect(Grid.cell(3,4).coord()).to.deep.equal({i:3, j:4});
			expect(Grid.cell(4,4).coord()).to.deep.equal({i:4, j:4});
			expect(Grid.cell(7,24).coord()).to.deep.equal({i:7, j:24});
		})

		it('should know if a coordinate belongs to the grid', function(){
			expect(Grid.cell(10,10).isIn(g)).to.be.false;
			expect(Grid.cell(10,10).isNotIn(g)).to.be.true;
			expect(Grid.cell(0,-10).isIn(g)).to.be.false;
			expect(Grid.cell(0,0).isIn(g)).to.be.true;
			expect(Grid.cell(2,6).isIn(g)).to.be.true;
			expect(Grid.cell(3,0).isIn(g)).to.be.true;
		});

		it('should populate cell values', function(){
			for (var i=0; i<10; ++i)
				for (var j=0; j<10; ++j)
					Grid.cell(i,j).set(g)(i+':'+j);
			expect(Grid.cell(3,2).of(g)).to.equal('3:2');
			expect(Grid.cell(5,2).of(g)).to.equal('5:2');
			expect(Grid.cell(9,9).of(g)).to.equal('9:9');
			expect(Grid.cell(0,0).of(g)).to.equal('0:0');
		});

		it('should map property of a cell', function(){
			Grid.cell(5,2).set(g)({foo:1024});
			Grid.cell(5,2).applyProperty(g)('foo',Math.sqrt);

			expect(Grid.cell(5,2).of(g)['foo']).to.equal(32);
		})

		it('should generate values for each cell using {eachCell} function', function(){
			var setValue = function(e, i, j){
				g[i][j] = i*10+j;
			}
			Grid.eachCell(g)(setValue);

			expect(g[0][0]).to.equal(0);
			expect(g[1][0]).to.equal(10);
			expect(g[3][5]).to.equal(35);
			expect(g[0][8]).to.equal(8);
			expect(g[8][3]).to.equal(83);
		})

		it('should map property value of each cell given the conditions', function(){
			// Prepare object data
			function firstRow(v,coord){ return coord.j==0 };
			Grid.eachOf(g).where(firstRow).do(function (v,coord){ 
				return {a:parseInt(coord.i*coord.i), b: -coord.i} 
			});
			Grid.eachOf(g).where(firstRow).applyProperty('a',Math.sqrt);

			// Check
			expect(g[0][0]).to.have.property('a');
			expect(g[0][0]).to.have.property('b');
			expect(g[3][0]).to.have.property('a');
			expect(g[3][0]).to.have.property('b');
			expect(g[3][3]).not.to.have.property('a');
			expect(g[3][3]).not.to.have.property('b');


			for (var i in g){
				expect(g[i][0]).to.deep.equal({a:parseInt(i), b:-i});
			}
		})

	})

	describe('Traversal test', function(){
		var g = Grid.create(30,30,'a');

		it('should construct path through the row', function(){
			var route = Grid.traverse(g).from(5,5).to(5,0).route();

			route.should.have.length(6);
			route.should.contain.one.deep.equal({i:5, j:5});
			route.should.contain.one.deep.equal({i:5, j:4});
			route.should.contain.one.deep.equal({i:5, j:3});
			route.should.contain.one.deep.equal({i:5, j:2});
			route.should.contain.one.deep.equal({i:5, j:1});
			route.should.contain.one.deep.equal({i:5, j:0});
		})

		it('should construct path through the column', function(){
			var route = Grid.traverse(g).from(0,5).to(5,5).route();

			route.should.have.length(6);
			route.should.contain.one.deep.equal({i:5, j:5});
			route.should.contain.one.deep.equal({i:4, j:5});
			route.should.contain.one.deep.equal({i:3, j:5});
			route.should.contain.one.deep.equal({i:2, j:5});
			route.should.contain.one.deep.equal({i:1, j:5});
			route.should.contain.one.deep.equal({i:0, j:5});
		})

		it('should construct a zigzag route', function(){
			var route = Grid.traverse(g).from(1,1).to(3,2).route();

			route.should.have.length(4);
			route.should.contain.one.deep.equal({i:1, j:1});
			route.should.contain.one.deep.equal({i:1, j:2});
			route.should.contain.one.deep.equal({i:2, j:2});
			route.should.contain.one.deep.equal({i:3, j:2});
		})

		it('should measure the distance of the route correctly', function(){
			var route_len = Grid.traverse(g).from(1,1).to(3,2).distance();

			expect(route_len).to.equal(Grid.distance({i:1,j:1},{i:3,j:2}));
		})

		it('should calculate the direction of the route', function(){
			var directions = Grid.traverse(g).from(1,1).to(3,2).directions();

			directions.should.have.length(3);
			directions.should.deep.equal(['DOWN','RIGHT','RIGHT'])
		})

		it('should reconstruct the route from directions', function(){
			var route = Grid.traverse(g).from(1,1).go(['DOWN','RIGHT','RIGHT']);

			route.should.have.length(4);
			expect(route[3]).to.deep.equal({i:3, j:2});
		})

		it('should throw an error when moving exceed the grid boundary', function(){
			var directions = ['UP','LEFT','LEFT','LEFT','DOWN'];
			var traversal = Grid.traverse(g).from(1,1);
			expect(traversal.go.bind(traversal, directions)).to.throw('Move exceeds the boundary of the grid');
		})
	})

	describe('Foreach tests', function(){
		var g = Grid.create(3,3,'0');

		it('should throw an exception if grid has not been passed in', function(){
			expect(Grid.eachCellOf.bind(this)).to.throw('Grid has not been defined');
		})

		it('should replace each cell with one', function(){
			var count = Grid.eachCellOf(g).do(function(value,coord){
				return 1;
			});

			// All cells should be affected
			expect(count).to.equal(9);

			for (var i in g)
				for (var j in g[i])
					expect(g[i][j]).to.equal(1);
		})

		it('should make identity matrix with do clause', function(){
			var count = Grid.eachCellOf(g).do(function(value,coord){
				if (coord.i==coord.j)
					return 1;
				else
					return 0;
			});

			var I = [[1,0,0],[0,1,0],[0,0,1]];
			g.should.deep.equal(I);
		})

		it('should make identity with where / setValue clauses', function(){
			Grid.eachCellOf(g).setTo(0);

			for (var i in g)
				for (var j in g[i])
					expect(g[i][j]).to.equal(0);

			var count = Grid.eachCellOf(g)
				.where(function(value,coord){ return coord.i==coord.j})
				.setValue(1);

			expect(count).to.equal(3);

			var I = [[1,0,0],[0,1,0],[0,0,1]];
			g.should.deep.equal(I);
		})

		it('should scale identity matrix with do function', function(){
			var count = Grid.eachCellOf(g).do(function(value,coord){ 
				return value*9
			});

			expect(count).to.equal(9);

			var I9 = [[9,0,0],[0,9,0],[0,0,9]];
			g.should.deep.equal(I9);
		})

	})

	describe('Routing algorithm tests', function(){
		var g = Grid.create(5,5,1);

		var simpleRouting = Grid.routeOf(g).from(4,0).to(0,4);

		describe('Lee routing test', function(){

			it('should find a simple path from 4,0 to 0,4', function(){
				route = simpleRouting.lee();
				route.should.have.length.above(1);

				// Distance between each adjacent block in the path
				// must be exactly 2 blocks (self-included) until it reaches the end
				expect(route[0]).to.deep.equal({i:4,j:0});
				expect(route[route.length-1]).to.deep.equal({i:0,j:4});

				console.log(route);


				var previousBlock = [];
				route.forEach(function (block){
					if (previousBlock!=0){
						var distance = Grid.traverse(g)
							.from(previousBlock.i,previousBlock.j)
							.to(block.i,block.j)
							.distance();
						expect(distance).to.equal(2);
					}

					previousBlock.i = block.i,
					previousBlock.j = block.j;
				});
			})

			it('should find a simple path from 4,0 to 0,4 despite obstacles',function(){
				// Assign obstacles
				var gz = Grid.duplicate(g);
				Grid.cell(4,1).set(gz)('WALL');
				Grid.cell(3,1).set(gz)('WALL');
				Grid.cell(3,2).set(gz)('WALL');
				Grid.cell(3,3).set(gz)('WALL');

				// Generate route now
				var isNotWall = function(value,coord){
					return (value!=='WALL')
				}
				route = Grid.routeOf(gz).from(4,0).to(0,4).where(isNotWall).lee();

				// Route should not cross the wall
				route.should.not.contain.an.item.that.deep.equal({i:4,j:1});
				route.should.not.contain.an.item.that.deep.equal({i:3,j:1});
				route.should.not.contain.an.item.that.deep.equal({i:3,j:2});
				route.should.not.contain.an.item.that.deep.equal({i:3,j:3});

				console.log(route);

				// Route should start at the right spot, end at the right spot
				expect(route[0]).to.deep.equal({i:4,j:0});
				expect(route[route.length-1]).to.deep.equal({i:0,j:4});

			})

			it('should find a simple path in a very big grid',function(){
				var bigGrid = Grid.create(100,100);
				// Generate route now
				var isNotWall = function(value,coord){
					return coord.j!=50 || Math.abs(coord.i-50)>8
				}
				var verbose = false;
				route = Grid.routeOf(bigGrid).from(25,0).to(60,40).where(isNotWall).lee(verbose);

				route.should.have.length.above(10);
				
				// Route should start at the right spot, end at the right spot
				expect(route[0]).to.deep.equal({i:25,j:0});
				expect(route[route.length-1]).to.deep.equal({i:60,j:40});				
			})

		})

		describe('A* search tests', function(){
			var grid = Grid.create(8,8,1);

			it('should find a simple path without cost function', function(){
				var verbose = false;
				var cost = function(){return 1}
				var route = Grid.routeOf(grid).from(2,0).to(0,7).astar(cost,verbose);

				console.log(route);

				route.should.have.length.above(2);
				expect(route[0]).to.deep.equal({i:2,j:0});
				expect(route[route.length-1]).to.deep.equal({i:0,j:7});
			})

			it('should find a path given a wall, no cost function', function(){
				// Assign obstacles
				var gz = Grid.duplicate(grid);
				Grid.cell(2,1).set(gz)('WALL');
				Grid.cell(0,3).set(gz)('WALL');
				Grid.cell(2,2).set(gz)('WALL');

				// Generate route now
				var isNotWall = function(value,coord){
					return (value!=='WALL')
				}
				route = Grid.routeOf(gz).from(4,0).to(0,7).where(isNotWall).astar();

				// Route should not cross the wall
				route.should.not.contain.an.item.that.deep.equal({i:2,j:1});
				route.should.not.contain.an.item.that.deep.equal({i:2,j:2});
				route.should.not.contain.an.item.that.deep.equal({i:0,j:3});

				console.log(route);

				// Route should start at the right spot, end at the right spot
				expect(route[0]).to.deep.equal({i:4,j:0});
				expect(route[route.length-1]).to.deep.equal({i:0,j:7});
			})

			it('should find route given a wall and cost function', function(){

				// Assign obstacles
				var gz = Grid.duplicate(grid);
				Grid.cell(2,1).set(gz)('WALL');
				Grid.cell(0,3).set(gz)('WALL');
				Grid.cell(2,2).set(gz)('WALL');

				// Generate route now
				var isNotWall = function(value,coord){
					return (value!=='WALL')
				}
				var cost = function(value,coord){
					// Rightmost columns cost less
					return 10/(coord.i+1)
				}
				route = Grid.routeOf(gz).from(1,0).to(6,7).where(isNotWall).astar(cost);

				// Route should not cross the wall
				route.should.not.contain.an.item.that.deep.equal({i:2,j:1});
				route.should.not.contain.an.item.that.deep.equal({i:2,j:2});
				route.should.not.contain.an.item.that.deep.equal({i:0,j:3});

				console.log(route);

				// Route should start at the right spot, end at the right spot
				expect(route[0]).to.deep.equal({i:1,j:0});
				expect(route[route.length-1]).to.deep.equal({i:6,j:7});
			})
		})
	})

	describe('Floodfill tests', function(){
		var g = Grid.create(5,5,0);
		Grid.cell(2,2).set(g)(1); // Hole in the middle
		Grid.cell(1,2).set(g)(1);
		Grid.cell(3,2).set(g)(1);
		Grid.cell(2,1).set(g)(1);
		Grid.cell(2,3).set(g)(1);

		it('should floodfill the entire grid without conditions', function(){
			var gz = Grid.duplicate(g);
			var filled = Grid.floodfill(gz).from(2,2).commit();

			filled.should.have.length(25);

			// Display the result
			filled.forEach(function(c){
				Grid.cell(c.i,c.j).set(gz)('*')
			});
			console.log(gz);
		})

		it('should floodfill the middle hole in the grid', function(){
			var gz = Grid.duplicate(g);
			var middle = function(value,coord){
				return value>0
			}
			var filled = Grid.floodfill(gz).from(2,2).where(middle).commit();

			filled.should.have.length(5);

			// Display the result
			filled.forEach(function(c){
				Grid.cell(c.i,c.j).set(gz)('*')
			});
			console.log(gz);
		})
	})

});