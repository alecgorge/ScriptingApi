# JSApi: a plugin for hMod

JSApi is a plugin that allows you to create plugins for hMod in pure Javascript. Every hook for hMod has been implemented so the results are limitless. Also, a few extra features were rolled in in order to make plugin development as painless as possible. All Javascript errors are stack traced in the console. If one plugin crashes, the others are unaffected.

## Loading new Javascript plugins

* Add a file to the js/ directory with the extension .js .
* Use the /reloadjs command.
* Your plugin is loaded!

## Quick Examples

The best way to learn is to look at the files in the "js samples/" directory.

## Info about the API

* You can call all the native methods of Java objects. For example, when Player is an argument to a callback, you can use all the methods listed on [this page](http://hey0.net/javadoc/index.html?Player.html).
* The list of hooks and arguments is available [here](http://hey0.net/javadoc/index.html?PluginListener.html).
* To get the instance of [Server](http://hey0.net/javadoc/index.html?Server.html), either use "this" inside a callback or use Api.getServer();
* To do an INFO level log, use Api.log.info("log message") to get an instance of the [Logger](http://download.oracle.com/javase/1.5.0/docs/api/java/util/logging/Logger.html) class and call the info method.
* To do an SEVERE level log, use Api.log.severe("log message") to get an instance of the [Logger](http://download.oracle.com/javase/1.5.0/docs/api/java/util/logging/Logger.html) class and call the severe method.
* To create an instance of [HitBlox](http://hey0.net/javadoc/index.html?HitBlox.html), use the Api.createHitBlox(player) method.
* To send a message to all players use the Api.broadcast() method. broadcast takes three arguments, the first is the message to send, the second can be null or it can be a group to limit a message to, the third can be null or a boolean. If the third argument is true, broadcast will send a message to everyone NOT in the specified group.
* All of the colors for chat are available with Colors.Blue, Colors.Red, etc...
* A key:value object of all the item names and their id's is available as Items["Air"], Items["Stone"], etc... Blocks is aliased to Items.
* A key:value object of all the ids and their respective names is available as ItemIds[0], ItemIds[1], etc...
* You can access the [etc](http://hey0.net/javadoc/etc.html) class via Api.etc.
* You can get the connection to MySQL server via Api.getSQLConnection() (returned value is an instance of [Connect](http://download.oracle.com/javase/1.4.2/docs/api/java/sql/Connection.html)).
* You can access the current [DataSource](http://hey0.net/javadoc/index.html?DataSource.html) class ([MySQLSource](http://hey0.net/javadoc/index.html?MySQLSource.html) or [FileFileSource](http://hey0.net/javadoc/index.html?FlatFileSource.html)) with Api.etc.getDataSource(). 

## The BlockBuilder class

The BlockBuilder class is meant to make building simple to complex objects really easy. It accounts for the users rotation and the axes.

Essentially you first create the blocks that you want, then you attach them to the world. All you have to do is construct the group of blocks in a "sandbox" where you start at x = 0, y = 0 and z = 0.

See the end of "js examples/Hitblox.js" for a simple example of how to use the BlockBuilder class.