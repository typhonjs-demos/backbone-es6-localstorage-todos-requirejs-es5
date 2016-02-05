/**
 * The backbone-es6 AMD ES5 bundle is generated from an ES6 codebase, so the default export is stored under `default`.
 * This shim essentially returns the default named export and is mapped to `backbone` in `config.js`.
 */
define([
   'lib/backbone'
], function(Backbone)
{
   'use strict';

   return Backbone.default ? Backbone.default : Backbone;
});
