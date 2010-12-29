/**
	This file adds a command called build that allows you to spawn a
	rectangular prism of blocks at whatever block you are aiming at.
	It always spawns on the block you are aiming at moves forward and to the
	right. The block you are aiming at will always be in the bottom left
	hand corner.

	You can also use this command to clear an area if you use specify
	0 as the block type.
	
	Examples:
	
	/build 1 10 5 3
	
	That constructs a prism 10 blocks long, 5 blocks wide and 3 blocks
	tall out of smooth stone.
	
	/build 0 10 5 3
	
	That constructs a tunnel 10 blocks long, 5 blocks wide and 3 blocks
	tall.
	
	@todo Support vertical "building"
	@todo Support negative numbers/offsets
*/
Api.onCommand(function (player, split) {
	var command = split[0].substring(1);
	var args = [];
	if(split.length > 1) {
		args = split.slice(1);
	}
	
	var printSyntax = function () {
		player.sendMessage(Color.Red + 'Syntax is /'+command+' blockType length width height');
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
		
		var target = Api.createHitBlox(player);
		var block = target.getTargetBlock();
		
		var x = block.getX();
		var y = block.getY()+1;
		var z = block.getZ();
		
		var block = new BlockBuilder();
		block.addPrism(blockType, [0, 0, 0], length, width, height);
		block.attachTo(x,y,z, player.getRotation());
		
		return true;
	}
});