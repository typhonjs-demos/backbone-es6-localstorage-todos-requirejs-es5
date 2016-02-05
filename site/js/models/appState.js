/**
 * This is the transient application state. By using a `Backbone.Model` this also makes it an
 * instance of `Backbone.Events` allowing subscription to state changes. An instance of AppState created after
 * definition allows any other subsequent code to access this instance.
 */
define([
   'backbone'
], function(Backbone)
{
   'use strict';

   var AppState = Backbone.Model.extend(
   {
      /**
       * Default value for AppState which is set in `Backbone.Model` when initializing an instance of `AppState`.
       */
      defaults: { filter: 'all' }
   });

   /**
    * Returns an instance of AppState shared between router, views and main app.
    */
   return new AppState();
});