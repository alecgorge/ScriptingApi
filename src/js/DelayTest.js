/**
  DelayTest.js
  
  shows how to use new delay functionality, using the new createRunnable method of the Api to create a Runnable object
  that can be passed to the server object with addToServerQueue

  -magik 12-31-2010
*/


// hook the command function
Api.onCommand(function(player, split) {
  //strips '/' char off front
  var command = split[0].substring(1);
  var args = []
  if (split.length > 1 ) {
    args = split.slice(1);
  }

  // look for command text
  if (command == "delaytest") {
    //check # of args
    if ( args.length < 2 ) {
      player.sendMessage("Usage: /delaytest <msg> <delay in ms>");
    } else {
      // grab last argument, should be numeric for delay
      var delay = args.pop();

      if (delay.toString().search(/^-?[0-9]+$/) != 0) {
        player.sendMessage("Last argument must be a numeric delay in ms");
      } else {
        //concatenate message together
        var msg = args[0];
        for(i=1;i<args.length;i++) msg += " "+ args[i];

        // create new object with a run() function to be run after the delay
        var obj = new Object();
        obj.player = player;
        obj.run = function() { this.player.sendMessage(msg); }

        // Create the Runnable object through the API, and then push it onto the server queue to be called later
        Api.server.addToServerQueue(Api.createRunnable(obj), delay);
      }
    }
    
    // don't pass command up, it has been "processed"
    return true;
  } else {

    // not our command, pass it up
    return false;
  }
});
