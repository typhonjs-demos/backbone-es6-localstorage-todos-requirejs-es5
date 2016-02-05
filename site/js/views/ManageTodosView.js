/**
 * The main view that lets a user manage their todos `Items`. When the various items are rendered they are tracked
 * in the `itemViews` object hash so that they can be cleaned up correctly.
 */
define([
   'underscore',
   'backbone',
   'eventbus',
   'site/js/models/appState',
   'site/js/collections/todoList',
   'site/js/views/ItemView',
   'text!site/templates/manage-todos.html',
   'text!site/templates/stats.html'
], function(_, Backbone, eventbus, appState, todoList, ItemView, manageTemplate, statsTemplate)
{
   'use strict';

   return Backbone.View.extend(
   {
      el: '.content',

      /**
       * Delegated events for creating new items and clearing completed ones.
       */
      events:
      {
         'keypress #new-todo': 'createOnEnter',
         'click #clear-completed': 'clearCompleted',
         'click #toggle-all': 'toggleAllComplete',
         'click .log-out': function() { eventbus.trigger('app:user:logout'); },
         'click ul#filters a': function(e) { eventbus.trigger('app:select:filter', $(e.target).attr('id')); }
      },

      /**
       * The template for the line of statistics at the bottom of the app.
       */
      statsTemplate: _.template(statsTemplate),

      /**
       * At initialization we bind to the relevant events on the `Todos` collection, when items are added or changed.
       * Kick things off by loading any preexisting todos that might be currently stored via Backbone.LocalStorage.
       *
       * @param {object}   options - optional parameters
       */
      initialize: function(options)
      {
         this.itemViews = {};

         // Binds the `this` context to all methods such that it is accessible via Backbone event callbacks.
         _.bindAll(this, 'addOne', 'addAll', 'addSome', 'createOnEnter', 'render', 'toggleAllComplete');

         // Main todos management template.
         this.$el.html(_.template(manageTemplate)(options));

         /**
          * @type {object} Stores the input field.
          */
         this.input = this.$('#new-todo');

         /**
          * @type {object} Stores the toggle all checkbox.
          */
         this.allCheckbox = this.$('#toggle-all')[0];

         var self = this;

         // Useful to get rid of the initial displayed spinner gif. This is called only once when the collection
         // initially is reset.
         this.listenToOnce(todoList, 'reset', function() { self.$('#todo-list').html(''); });

         // When `AppState` changes invoke `filter` to redraw this view.
         this.listenTo(appState, 'change', this.filter);

         // When `todoList` is reset / initially populated or if an Item done state changes invoke `filter` to
         // redraw this view.
         this.listenTo(todoList, 'change:done reset', this.filter);

         // Ensure that the statistics are re-rendered when an item is added or removed.
         this.listenTo(todoList, 'update', this.render);
      },

      /**
       * Add all items in the Todos collection at once.
       */
      addAll: function()
      {
         this.clearAll();

         todoList.each(this.addOne);

         this.render();
      },

      /**
       * Add a single item to the list by creating a view for it, and appending its element to the `<ul>`.
       *
       * @param {Item}  item - Item to add.
       */
      addOne: function(item)
      {
         var view = new ItemView({ model: item });

         this.itemViews[item] = view;

         this.$('#todo-list').append(view.render().el);
      },

      /**
       * Only adds some todos, based on a filtering function that is passed into `addSome`.
       *
       * @param {function} filter - A function to filter the Items.
       */
      addSome: function(filter)
      {
         this.clearAll();

         todoList.chain().filter(filter).each(this.addOne);

         this.render();
      },

      /**
       * Iterates through the `itemViews` invoking the `Backbone.View->remove` method for each `ItemView` tracked.
       * The object hash is then cleared.
       */
      clearAll: function()
      {
         this.$('#todo-list').html('');

         _.each(this.itemViews, function(itemView)
         {
            itemView.remove();
         });

         this.itemViews = {};
      },

      /**
       * Clear all done todos items, destroying their models.
       */
      clearCompleted: function()
      {
         var self = this;

         _.each(todoList.done(), function(item)
         {
            // This will trigger the remove method of ItemView.
            item.destroy();

            // Remove the ItemView from the tracking map.
            delete self.itemViews[item];
         });
      },

      /**
       * If you hit return in the main input field, create new Item model. The creation of the item is handled over
       * the eventbus via triggering `app:create:item` which invokes `App->createItem`.
       *
       * @param {object}   e - event data
       */
      createOnEnter: function(e)
      {
         // Only respond to `enter` pressed.
         if (e.keyCode !== 13) { return; }

         // Create new item.
         eventbus.trigger('app:create:item', this.input.val());

         // Clear the input text field.
         this.input.val('');

         // Sets state and updates Backbone.history.navigate.
         eventbus.trigger('app:select:filter', 'all');
      },

      /**
       * Invoked when the TodoList collection is reset and when the app state changes.
       */
      filter: function()
      {
         var filterValue = appState.get('filter');

         switch(filterValue)
         {
            case 'all':
               this.addAll();
               break;

            case 'completed':
               this.addSome(function(item) { return item.get('done'); });
               break;

            default:
               this.addSome(function(item) { return !item.get('done'); });
               break;
         }
      },

      /**
       * Re-rendering the App just means refreshing the statistics -- the rest of the app doesn't change.
       */
      render: function()
      {
         var done = todoList.done().length;
         var remaining = todoList.remaining().length;

         // Render the statistics template
         this.$('#todo-stats').html(this.statsTemplate({ total: todoList.length, done: done, remaining: remaining }));

         // Automatically wires all events specified by `get events()`.
         this.delegateEvents();

         // Sets the checked state of the allCheckbox depending on remaining count.
         this.allCheckbox.checked = !remaining;

         // Update the filter state after the stats template is rendered.
         var filterValue = appState.get('filter');
         $('ul#filters a').removeClass('selected');
         $('ul#filters a#' + filterValue).addClass('selected');
      },

      /**
       * Toggles all todos items to completed / done then saves each item.
       */
      toggleAllComplete: function()
      {
         var done = this.allCheckbox.checked;
         todoList.each(function(item) { item.save({ done: done }); });
      }
   });
});