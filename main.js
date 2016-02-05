/*global require*/
require([
   'jquery',
   'underscore',
   'backbone',
   'site/js/App',
   'typhonjs-core-backbone-localstorage'  // Note: Backbone localStorage is bootstrapped here, but not assigned to
], function ($, _, Backbone, App)         // a parameter in the function.
{
   'use strict';

   // Configure RequireJS to throw errors and provide a global error handler.
   requirejs.config({ catchError: true });

   requirejs.onError = function (error)
   {
      console.log("RequireJS Error: " +error.requireType +"; message: " +error.message);

      if (typeof error.requireModules !== 'undefined' && error.requireModules !== null)
      {
         console.log("RequireJS module: " +error.requireModules);
      }

      if (error.stack)
      {
         console.log(error.stack);
      }
   };

   // Start the app!
   new App();
});
