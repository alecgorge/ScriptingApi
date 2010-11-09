
Api.onCommand(function (player, split) {
	var command = split[0].substring(1);
	var args = [];
	if(split.length > 1) {
		args = split.slice(1);
	}
	
	var printSyntax = function () {
		player.sendMessage(Color.Red + 'Syntax is /'+command+' blockType length width height');
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
	
	if(command == "build") {
		var blockType = parseInt(args[0]);
		var length = parseInt(args[1]);
		var width = parseInt(args[2]);
		var height = parseInt(args[3]);
		
		if(isNaN(blockType)) {
			if(typeof(blockType) == "undefined") {
				printSyntax();
				return true;
			}
			
			blockType = -1;
			for(i in Blocks) {
				if(i == blockType) {
					blockType = Blocks[i];
				}
			}
			
			if(blockType == -1) {
				printSyntax();
				return true;
			}
		}
		
		if(isNaN(length) || isNaN(width) || isNaN(height)) {
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
			
			limits.x = x - length;
			limits.z = z - width;
			doSubtractX = true;
			doSubtractZ = true;
		} else if (rot == "x+") {
			x++;
			
			limits.x = x + length;
			limits.z = z + width;
		} else if (rot == "z-") {
			z--;
			
			limits.x = x + width;
			limits.z = z - length;
			doSubtractX = false;
			doSubtractZ = true;
		} else if (rot == "z+") {
			z++;
			
			limits.x = x - width;
			limits.z = z + length;
			doSubtractX = true;
			doSubtractZ = false;
		}
		
		// println(sprintf("x: %s, y: %s, z: %s, rot: %s, blockType: %s", x, y, z, rot, blockType));
		// println(sprintf("limits.x: %s, limits.y: %s, limits.z: %s", limits.x, limits.y, limits.z));

		if(doSubtractX == false && doSubtractZ == false)
			for(var i = x; i < limits.x; i++)
				for(var j = y; j <= limits.y; j++)
					for(var f = z; f < limits.z; f++)
						this.setBlockAt(blockType, i, j, f);
		else if(doSubtractX == true && doSubtractZ == false)
			for(var i = x; i > limits.x; i--)
				for(var j = y; j <= limits.y; j++)
					for(var f = z; f < limits.z; f++)
						this.setBlockAt(blockType, i, j, f);
		else if(doSubtractX == false && doSubtractZ == true)
			for(var i = x; i < limits.x; i++)
				for(var j = y; j <= limits.y; j++)
					for(var f = z; f > limits.z; f--)
						this.setBlockAt(blockType, i, j, f);
		else if(doSubtractX == true && doSubtractZ == true)
			for(var i = x; i > limits.x; i--)
				for(var j = y; j >= limits.y; j--)
					for(var f = z; f > limits.z; f--)
						this.setBlockAt(blockType, i, j, f);

		return true;
	}
});