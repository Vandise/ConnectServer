import ConfReader from '../../app/core/conf/ConfReader';
let chai = require('chai');
let sinon = require("sinon");
let expect = chai.expect;

/** @test {ConfReader} */
describe('ConfReader ',function(){

  let confReader = null;

  /**
  * Generate the ConfReader
  */
  before(function(){
    confReader = new ConfReader();
  });

  /** @test {ConfReader#read} */
  describe('ConfReader#read',function(){
    it('Expect database name to equals null',function(){
      let result = confReader.read('./src/conf/dev.yml');
      expect(result.database.toto).to.equals(undefined);
    });
  });

  /** @test {ConfReader#read} */
  describe('ConfReader#read',function(){
    it('Expect database name to equals null',function(){
      let result = confReader.read('./src/conf/fail.yml');
      expect(result).to.equals(null);
    });
  });

});
