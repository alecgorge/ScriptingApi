
/*Api.onChat(function (player, message) {
	var slot1 = player.getInventory().getItemFromSlot(0);
	
	// if something is in the first slot
	if(slot1 != null) {
		println(slot1.getItemId());
		println(slot1.getAmount());
	}
	else {
		player.giveItemDrop(Items['Stone'], 10);
	}
});*/

function rotationToAxis (rotation) {
	degrees = ((rotation - 90) % 360);
	if (degrees < 0) degrees+= 360.0;

	var getXYZ = function (degrees) {
		if (0 <= degrees && degrees < 67.5) {
			return "Negative X Axis";
		} else if (67.5 <= degrees && degrees < 112.5) {
			return "Negative Z Axis";
		} else if (112.5 <= degrees && degrees < 202.5) {
			return "Positive X Axis";
		} else if (202.5 <= degrees && degrees < 292.5) {
			return "Positive Z Axis";
		} else if (292.5 <= degrees && degrees < 360.0) {
			return "Negative X Axis";
		}
	};
	
	return getXYZ(degrees);
}

Api.onCommand(function (player, split) {
	var command = split[0].substring(1);
	
	if(command == 'xyz') {
		player.sendMessage(Color.Rose + "You are facing down the "+rotationToAxis(player.getRotation())+" axis.");
		
		return true;
	}
});

Api.onCommand(function (player, split) {
	var command = split[0].substring(1);
	var args = [];
	if(split.length > 1) {
		args = split.slice(1);
	}
	
	var printSyntax = function () {
		player.sendMessage(Color.Red + 'Syntax is /'+command+' radius OR');
		player.sendMessage(Color.Red + '/'+command+' length width height (width should be odd)');
	};
	
	var printSyntaxSink = function () {
		player.sendMessage(Color.Red + 'Syntax is /'+command+' [radius] [depth]');
	};
	
	if(command == "sink") {
		if(args.length > 0) {
			for(var i in args) {
				if(isNaN(parseInt(args[i]))) {
					printSyntaxSink();
					return true;
				}
			}
			if (args.length == 2) {
				var radius = {radius: parseInt(args[0]), depth: parseInt(args[1])};
			}
			else {
				printSyntaxSink();
				return true;
			}
		}
		else {
			printSyntaxSink();
			return true;
		}
		
		var x = player.getX();
		var y = player.getY();
		var z = player.getZ();

		var up = player.getPitch() < 0;
		
		if(up) var limits = {x:[],y:[0, radius.depth],z:[]};
		else var limits = {x:[],y:[parseInt('-'+radius.depth), 0],z:[]};
		
		limits.x.push(parseInt('-'+radius.radius), radius.radius);
		limits.z.push(parseInt('-'+radius.radius), radius.radius);

		// println("positive: "+positive+", side: "+side+", inFront: "+inFront+", length: "+radius.length+", width: "+radius.width+", height: "+radius.height);
		// println("x("+limits.x[0]+","+limits.x[1]+") "+"y("+limits.y[0]+","+limits.y[1]+") "+"z("+limits.z[0]+","+limits.z[1]+")");
		for(var i = (x+limits.x[0]); i < (limits.x[1]+x+1); i++)
			for(var j = (y+limits.y[0]); j < ((limits.y[1])+y); j++)
				for(var f = (z+limits.z[0]); f < (limits.z[1]+z+1); f++)
					this.setBlockAt(Blocks.Air, i, j, f);
					
		return true;
	}
	else if(command == "explode" || command == "tunnel") {
		if(args.length > 0) {
			for(var i in args) {
				if(isNaN(parseInt(args[i]))) {
					printSyntax();
					return true;
				}
			}
			if(args.length == 1) {
				var radius = parseInt(args[0]);
			}
			else if (args.length == 3) {
				var radius = {length: parseInt(args[0]), width: parseInt(args[1]), height: parseInt(args[2])}
			}
			else {
				printSyntax();
				return true;
			}
		}
		else {
			printSyntax();
			return true;
		}
		
		var x = player.getX();
		var y = player.getY();
		var z = player.getZ();
				
		if(typeof(radius) == "number") {
			for(var i = (x-radius); i < (radius+x+1); i++)
				for(var j = (y-radius); j < ((radius+1)+y); j++)
					for(var f = (z-radius); f < (radius+z+1); f++)
						this.setBlockAt(Blocks.Air, i, j, f);
		}		
		else {
			var limits = {x:[],y:[0, radius.height],z:[]};
			var result = rotationToAxis(player.getRotation());
			
			var positive = (result.indexOf("Positive") != -1 ? true : false);
			var inFront = (result.indexOf("X") != -1 ? 'x' : 'z');
			var side = (inFront == 'x' ? 'z' : 'x');
			
			if(positive) limits[inFront].push((inFront == 'z'? 1 : 0), radius.length+(inFront == 'x' ? 1: 0));
			else limits[inFront].push(parseInt('-'+radius.length)-(!positive && inFront == 'z' ? 0: 1), -1);
			
			if(radius.width % 2 == 0) limits[side].push(parseInt("-"+(radius.width/2)), (radius.width/2)-1);
			else limits[side].push(parseInt("-"+((radius.width-1)/2)), ((radius.width-1)/2));

			// println("positive: "+positive+", side: "+side+", inFront: "+inFront+", length: "+radius.length+", width: "+radius.width+", height: "+radius.height);
			// println("x("+limits.x[0]+","+limits.x[1]+") "+"y("+limits.y[0]+","+limits.y[1]+") "+"z("+limits.z[0]+","+limits.z[1]+")");
			for(var i = (x+limits.x[0]-(side == 'x' ? 1 : 0)); i < (limits.x[1]+x-(positive && side == 'x' ? 0 : 0)); i++)
				for(var j = (y+limits.y[0]); j < ((limits.y[1])+y); j++)
					for(var f = (z+limits.z[0]); f < (limits.z[1]+z+1); f++)
						if(this.getBlockIdAt(i,j,f) != 7) {
							this.setBlockAt(Blocks.Air, i, j, f);
						}
		}		
		
		//println(this.setBlockAt(Blocks.Air, x, y-1, z));
		return true;
	}
	
});

/*Api.bind("login", function (player) {
	// to just the player
	player.sendMessage(Colors.Yellow + "Currently running plugin: " + Api.name + " v" + Api.version + "!");
	
	// to everyone!
	Api.broadcast(Colors.Green + player.getName() + " has joined the server! Wooo~");
	
	// to admins
	Api.broadcast(Colors.Red + "Watch out! " + player.getName() + " could be dangerous!!!", "admins");
});*/