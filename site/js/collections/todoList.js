/**
 * This module defines a `Backbone.Collection` which stores todos `Items` and provides utility methods to filter,
 * sort and retrieve the next order number used to sort `Items`. An single shared instance of TodoList is created
 * right after definition below. This allows the instance to be used anywhere the collection is necessary.
 * Multiple views may access this instance, but in this demo only `ManageTodosView` displays data from the
 * collection.
 */
define([
   'backbone',
   'site/js/models/Item',
   'typhonjs-core-backbone-localstorage'   // Note: Backbone localStorage is bootstrapped here, but not assigned to
], function(Backbone, Item)                // a parameter in the function.
{
   'use strict';

   var TodoList = Backbone.Collection.extend(
   {
      /**
       * Reference to this collection's model.
       */
      model: Item,

      /**
       * Assigns a LocalStorage instance for this collection stored in browser `localStorage` under the key:
       * `backbone:es6:localstorage:TodoList`.
       */
      localStorage: new Backbone.LocalStorage('backbone:es6:localstorage:TodoList'),

      /**
       * Todos are sorted by their original insertion order.
       *
       * @param {Item} item - item model.
       * @returns {number}
       */
      comparator: function(item)
      {
         return item.get('order');
      },

      /**
       * Filter down the list of all todos items that are finished.
       *
       * @returns {*}
       */
      done: function()
      {
         return this.filter(function(item) { return item.get('done'); });
      },

      /**
       * We keep the todos Items in sequential order, despite being saved by unordered GUID in the database. This
       * generates the next order number for new items.
       *
       * @returns {number}
       */
      nextOrder: function()
      {
         if (!this.length) { return 1; }
         return this.last().get('order') + 1;
      },

      /**
       * Filter down the list to only todos items that are still not finished.
       *
       * @returns {*}
       */
      remaining: function()
      {
         return this.without.apply(this, this.done());
      }
   });

   /**
    * Return an instance of TodoList shared between views and main app.
    */
   return new TodoList();
});
