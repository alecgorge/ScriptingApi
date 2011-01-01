/**
  Script: IceMan.js
  Author: magik
  Date: 2010/12/31 9:33PM PST ( HAPPY NEW YEARS!!!! )
  Description:

  Better demonstration of new delay functionality.

  This script adds the /iceman command to the groups specified below in the 
  configuration section.  What this does is create a couple of blocks of glass
  under the player with the mode enabled.  As the player walks, more blocks 
  will be placed in front of him at the same height level.  Once the player 
  walks away from the glass blocks, they "melt" back into air.

  The command /iceman toggles this mode on or off.

  Also note, that sneaking will allow blocks to "melt", as well as create the 
  "ice" 1 block lower when moving, giving you a way of going down.
  
*/

// CONFIGURATION

// ALLOWED GROUPS - these are which groups get to use the command
var groups = Array("admins","mods","vip");  

// MELT DELAY - delay in ms to check if player is near for block melting
var delay = 3000;  

// How many blocks in each direction to create around the iceman
var size = 1;

// Mmultiplier to create more blocks in the direction the player is moving
var lookahead = 5; 

// ID of the "ice" blocks to be created
var blockID = 20;  


// MAIN SCRIPT

var enabled = Array();
var posX = Array();
var posY = Array();
var posZ = Array();

Array.prototype.inArray =  function(target) {
  for ( var i = 0, l = this.length; i < l; i++ ) {
    if ( this[i] == target ) return i;
  }
  return -1;
}

// hook the command function
Api.onCommand(function(player, split) {
  //strips '/' char off front
  var command = split[0].substring(1);
  var args = []
  if (split.length > 1 ) {
    args = split.slice(1);
  }

  // look for command text
  if (command == "iceman") {
    canUse = false; 
    pgroups = player.getGroups();
    for(var i = 0, l = groups.length; i < l; i++) {
      for(var j = 0, ll = pgroups.length; j < ll; j++) {
        if ( groups[i].equals(pgroups[j]) ) {
          canUse = true;
          break;
        }
      }
      if (canUse) break;
    }
    if ( !canUse ) return false;

    //check arguments
    if ( args.length != 0 ) { 
      player.sendMessage("Usage: /iceman - toggles iceman on/off "); 
    } else {
      var ind;
      if ( ( ind = enabled.inArray(player.getName()) ) != -1 ) {
        //disable iceman
        enabled.splice(ind,1);
        player.sendMessage("iceman disabled!");
      } else {
        //enable iceman
        enabled.push(player.getName());
        player.sendMessage("iceman enabled!");
      }
    }

    //command was handled
    return true;
  } else {

    //command not handled
    return false;
  }
});


Api.onPlayerMove(function(player, from, to) {
  var name = player.getName();
  if ( (typeof(posX[name]) != 'undefined') &&
       (typeof(posY[name]) != 'undefined') &&
       (typeof(posZ[name]) != 'undefined') ) {
    var vx = (player.getSneaking()) ? player.x - posX[name] : lookahead*(player.x - posX[name]);
    var vz = (player.getSneaking()) ? player.z - posZ[name] : lookahead*(player.z - posZ[name]);
  } else {
    var vx = 0;
    var vz = 0;
  }
  posX[name] = player.x;
  posY[name] = player.y;
  posZ[name] = player.z;
  if ( enabled.inArray(name) != -1 ) {
    var block = Api.createLocation(to.x, to.y, to.z);
    block.y -= (player.getSneaking()) ? 2 : 1;

    var xs = ( vx < 0 ) ? -size + vx : -size;
    var xe = ( vx > 0 ) ? size + vx : size;
    var zs = ( vz < 0 ) ? -size + vz : -size;
    var ze = ( vz > 0 ) ? size + vz : size;
    for ( var xxx = xs; xxx <= xe; xxx++ ) {
      for ( var zzz = zs; zzz <= ze; zzz++ ) {
        b = Api.createLocation(block.x+xxx, block.y, block.z+zzz);
        checkAndCreateBlock(player, b, delay);
      }
    }

  }
});

function checkAndCreateBlock(player, block, delay) {
  if ( Api.server.getBlockIdAt( block.x, block.y, block.z ) == 0 ) {
    Api.server.setBlockAt(blockID, block.x, block.y, block.z );
    deleteBlockDelay(player, block, delay);
  }
}
function deleteBlockDelay(player, block, delay) {
  var delblock = new Object();
  delblock.player = player;
  delblock.block = block;
  delblock.run = function() {
    if ( !player.getSneaking() &&
         (Math.abs(player.x - block.x) < (2*size+1)) && 
         (Math.abs(player.y - block.y) < (2*size+1)) && 
         (Math.abs(player.z - block.z) < (2*size+1)) ) {
      deleteBlockDelay(delblock.player, delblock.block, delay);
    } else {
      Api.server.setBlockAt(0, block.x, block.y, block.z );
    }
  }
  // Create the Runnable object through the API, and then push it onto the server queue to be called later
  Api.server.addToServerQueue(Api.createRunnable(delblock), delay);
}

