var assert = require('assert');
var chai = require('chai');
var expect = chai.expect;
chai.should();
chai.use(require('chai-things'));

// Dependency
var Grid = require('../grid.js').Grid;

describe('Grid basic test', function(){

	describe('Fundamental Grid namespace test', function(){

		var g = Grid.create(5,5);

		it('should create a 5x5 grid', function(){
			g.should.have.length(5);
			g[0].should.have.length(5);
		});

		it.skip('should duplicate a grid', function(){

		});

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

		it.skip('should iterate through each sibling correctly', function(){

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
	})

});