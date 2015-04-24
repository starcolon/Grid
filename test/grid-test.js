var assert = require('assert');
var chai = require('chai');
var expect = chai.expect;
chai.should();
chai.use(require('chai-things'));

// Dependency
var Grid = require('../grid.js').Grid;

describe('Grid basic test', function(){

	describe('Fundamental test', function(){

		var g = Grid.create(5,5);

		it('should create a 5x5 grid', function(){
			g.should.have.length(5);
			g.should.all.deep.equal(new Array(5));
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

	});

});