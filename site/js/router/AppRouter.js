/**
 * Provides a basic `Backbone.Router` to route between app states: `all`, `active` & `completed`. When a user
 * navigates between these different filter type states `Backbone.history.navigate` is invoked in `App->selectFilter`
 * to update the navigation history allowing the user to use the back and forward browser controls to navigate the app.
 * When a filter type is selected it is referenced in the current URL for the web app. 
 * 
 * Please note that in the `App constructor` a default catch all no route callback is specified which handles
 * unmatched routes.
 */
define([
   'backbone',
   'site/js/models/appState'
], function(Backbone, appState)
{
   'use strict';

   return Backbone.Router.extend(
   {
      /**
       * Creates the routes delegated to the given methods specified.
       */
      routes:
      {
         'all': function () { appState.set({ filter: 'all' }); },
         'active': function () { appState.set({ filter: 'active' }); },
         'completed': function () {appState.set({ filter: 'completed' }); }
      }
   });
});
