/**
 * Our basic todos Item model has `content`, `order`, and `done` attributes.
 */
define([
   'backbone'
], function(Backbone)
{
   'use strict';

   return Backbone.Model.extend(
   {
      /**
       * Default attributes for the item.
       */
      defaults:
      {
         content: 'empty todo...',
         done: false
      },

      /**
       * Ensure that each item created has `content`.
       */
      initialize: function()
      {
         if (!this.get('content'))
         {
            this.set({ 'content': this.defaults.content });
         }
      },

      /**
       * Toggle the `done` state of this item.
       */
      toggle: function()
      {
         this.save({ done: !this.get('done') });
      }
   });
});