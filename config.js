// Require.js allows us to configure shortcut alias
require.config(
{
   baseUrl: '.',

   paths:
   {
      jquery: 'lib/zepto',
      underscore: 'lib/underscore',
      backbone: 'lib/backboneShim',    // Note that the shim is being loaded.
      'typhonjs-core-backbone-localstorage': 'lib/typhonjs-core-backbone-localstorage',
      text: 'lib/text',
      eventbus: 'site/js/events/mainEventbus',
      todoList: 'site/js/collections/todoList'
   },
   deps: ['main']
});
