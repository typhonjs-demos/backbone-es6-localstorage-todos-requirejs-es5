/**
 * The `Backbone.View` for an item which encapsulates the ability to edit the content of the item. With a desktop
 * browser an `Item` can be edited with a double click or double tap when running on a mobile device. In this case
 * additional jQuery events including `doubletap` are loaded via the jQuery finger
 * plugin (http://ngryman.sh/jquery.finger/).
 */
define([
   'underscore',
   'backbone',
   'text!site/templates/item.html'
], function(_, Backbone, itemTemplate)
{
   'use strict';

   return Backbone.View.extend(
   {
      /**
       * Defines the tag that is created for an `Item`.
       */
      tagName: 'li',

      /**
       * Delegated events for interacting with an `Item`.
       */
      events:
      {
         'click .toggle': 'toggleDone',
         'dblclick label.todo-content': 'edit',
         'doubletap label.todo-content': 'edit',
         'click .todo-destroy': 'clear',
         'keypress .edit': 'updateOnEnter',
         'blur .edit': 'closeEdit'
      },

      /**
       * Cache the template function for a single item.
       */
      template: _.template(itemTemplate),

      /**
       * The ItemView listens for changes to its model, re-rendering. Since there's a one-to-one correspondence between
       * an Item and an ItemView. If the model is deleted then the `Backbone.View->remove` method is invoked.
       */
      initialize: function ()
      {
         // Binds the `this` context to all methods such that it is accessible via Backbone event callbacks.
         _.bindAll(this, 'clear', 'closeEdit', 'remove', 'render');

         this.listenTo(this.model, 'change', this.render);
         this.listenTo(this.model, 'destroy', this.remove);
      },

      /**
       * Remove the item, destroy the model.
       */
      clear: function ()
      {
         this.model.destroy();
      },

      /**
       * Close the `editing` mode, saving changes to the item.
       */
      closeEdit: function ()
      {
         this.model.save({content: this.input.val()});
         this.$el.removeClass('editing');
      },

      /**
       * Switch this view into `editing` mode, displaying the input field.
       */
      edit: function ()
      {
         this.$el.addClass('editing');
         this.input.focus();
      },

      /**
       * Re-render the contents of the Item.
       *
       * @returns {ItemView}
       */
      render: function ()
      {
         this.$el.html(this.template(this.model.toJSON()));

         /**
          * @type {object} Stores the edit input.
          */
         this.input = this.$('.edit');

         return this;
      },

      /**
       * Toggle the `done` state of the model.
       */
      toggleDone: function ()
      {
         this.model.toggle();
      },

      /**
       * If you hit `enter`, we're through editing the item.
       *
       * @param {object}   e - event data
       */
      updateOnEnter: function (e)
      {
         if (e.keyCode === 13)
         {
            this.closeEdit();
         }
      }
   });
});
