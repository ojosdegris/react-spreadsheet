'use strict';

var Formula = require( './formula' );

var FORMULA = /^=/;

var Cell = function( content, spreadsheet ){
  var self = this;
  this._content = content || '';
  this._status = {active: false, selected: false}

  this._spreadsheet = spreadsheet;
  this._spreadsheet.setMaxListeners( 0 ); // There is not memory leaks
  this._spreadsheet.on( 'reset:status', function(){
    self.status( 'selected', false );
    self.status( 'active' , false );
  } );
};

Cell.prototype.content = function( content ){
  return this._content = content ? content : this._content;
};

Cell.prototype.status = function( status, value ){
  if( typeof(value) === 'boolean' ){
    this._status[status] = value;
    return true;
  }
  return this._status[status];

};

Cell.prototype.isFormula = function(){
  return !!this._content.match( FORMULA);
};

Cell.prototype.resolve = function( formula ){
  return new Formula( formula, this._spreadsheet ).resolve();
};

Cell.prototype.toString = function( isExport ){
  return isExport || this.status( 'active' ) ? this._content
                                             : this.isFormula( this._content ) ? this.resolve( this._content )
                                                                               : this._content
};

module.exports = Cell;
