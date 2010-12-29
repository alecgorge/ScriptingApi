
Api.onCommand(function (player, split) {
	var command = split[0].substring(1);
	var args = [];
	if(split.length > 1) {
		args = split.slice(1);
	}
	
	var printSyntax = function () {
		player.sendMessage(Color.Red + 'Syntax is /'+command+' height radius');
	};
		
	var rotationToAxis = function (rotation) {
		degrees = ((rotation - 90) % 360);
		if (degrees < 0) degrees+= 360.0;

		var getXYZ = function (degrees) {
			if (0 <= degrees && degrees < 67.5) {
				return "x-";
			} else if (67.5 <= degrees && degrees < 112.5) {
				return "z-";
			} else if (112.5 <= degrees && degrees < 202.5) {
				return "x+";
			} else if (202.5 <= degrees && degrees < 292.5) {
				return "z+";
			} else if (292.5 <= degrees && degrees < 360.0) {
				return "x-";
			}
		};
		
		return getXYZ(degrees);
	};
	
	if(command == "tree") {
		var height = parseInt(args[0]);
		var radius = parseInt(args[1]);
		
		if(isNaN(radius) || isNaN(height)) {
			printSyntax();
			return true;
		}
		
		var x = player.getX();
		var y = player.getY();
		var z = player.getZ() - 1;
		var rot = rotationToAxis(player.getRotation());
		var length_offset = 1;
		
		var limits = {};
		var doSubtractX = false;
		var doSubtractZ = false;
		limits.y = y + height - 1;
		
		if(rot == "x-") {
			// one block offset so it doesn't destory the block you are standing on
			x--;
			
			limits.x = x;
			limits.z = z;
			doSubtractX = true;
			doSubtractZ = true;
		} else if (rot == "x+") {
			x++;
			
			limits.x = x;
			limits.z = z;
		} else if (rot == "z-") {
			z--;
			
			limits.x = x;
			limits.z = z;
			doSubtractX = false;
			doSubtractZ = true;
		} else if (rot == "z+") {
			z++;
			
			limits.x = x;
			limits.z = z;
			doSubtractX = true;
			doSubtractZ = false;
		}
		
		//generate cube of leaves
		var limitLeaves = {x:[],y:[height * 4/5, height*2],z:[]};	
		
		limitLeaves.x.push(parseInt('-'+radius), radius);
		limitLeaves.z.push(parseInt('-'+radius), radius);

		for(var i = (x+limitLeaves.x[0]); i < (limitLeaves.x[1]+x+1); i++)
			for(var j = (y+limitLeaves.y[0]); j < ((limitLeaves.y[1])+y); j++)
				for(var f = (z+limitLeaves.z[0]); f < (limitLeaves.z[1]+z+1); f++)
					if(Math.random() > .25)
						this.setBlockAt(18, i, j, f);
					
		// println(sprintf("x: %s, y: %s, z: %s, rot: %s, blockType: %s", x, y, z, rot, blockType));
		// println(sprintf("limits.x: %s, limits.y: %s, limits.z: %s", limits.x, limits.y, limits.z));

		//generate primary trunk of log
		if(doSubtractX == false && doSubtractZ == false)	
			for(var j = y; j <= limits.y; j++)
					this.setBlockAt(17, x, j, z);
		else if(doSubtractX == true && doSubtractZ == false)
			for(var j = y; j <= limits.y; j++)
					this.setBlockAt(17, x, j, z);
		else if(doSubtractX == false && doSubtractZ == true)
			for(var j = y; j <= limits.y; j++)
					this.setBlockAt(17, x, j, z);
		else if(doSubtractX == true && doSubtractZ == true)
			for(var j = y; j >= limits.y; j--)
					this.setBlockAt(17, x, j, z);
		
		//generate branches of log		
		var limitBranches = {x:[],y:[(height * 2/5) - 1, height - 1],z:[]};	
		
		limitBranches.x.push(parseInt('-'+radius/2), radius/2);
		limitBranches.z.push(parseInt('-'+radius/2), radius/2);
		
		// println(sprintf("x: %s, y: %s, z: %s, rot: %s, blockType: %s", x, y, z, rot, blockType));
		// println(sprintf("limits.x: %s, limits.y: %s, limits.z: %s", limits.x, limits.y, limits.z));

		// for(var i = (x+limitBranches.x[0]); i < (limitBranches.x[1]+x+1); i++)
			// for(var j = (y+limitBranches.y[0]); j < ((limitBranches.y[1])+y); j++)
				// for(var f = (z+limitBranches.z[0]); f < (limitBranches.z[1]+z+1); f++)
					// if(Math.random() > 0.75 )
						// this.setBlockAt(17, i, j, f);
		
		return true;
	}
});