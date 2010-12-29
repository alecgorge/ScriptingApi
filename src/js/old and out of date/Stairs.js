Api.onCommand(function (player, split) {
	var command = split[0].substring(1);
	var args = [];
	if(split.length > 1) {
		args = split.slice(1);
	}
		
	var printSyntax = function () {
		player.sendMessage(Color.Red + 'Syntax is /'+command+' blockType upOrDown width depth [clearance]');
	};
		
	if(command == "stairs") {
		var blockType = parseInt(args[0]);
		var type = args[1];
		var width = parseInt(args[2]);
		var depth = parseInt(args[3]);
		var clearance = parseInt(args[4]);
		
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
		
		if(!(type == "up" || type == "down")) {
			printSyntax();
			return true;
		}
		
		if(isNaN(width) || isNaN(depth)) {
			printSyntax();
			return true;
		}
		
		var target = Api.createHitBlox(player);
		var block = target.getTargetBlock();
		
		var x = block.getX();
		var y = block.getY();
		var z = block.getZ();
		
		var bb = new BlockBuilder();
		
		println(type);
		
		if(type == "up") {
			y++;
			for(var i = 0; i < depth; i++)
				bb.addPrism(blockType, [i, i, 0], 1, width, (isNaN(clearance) ? 1 : clearance));
		}
		else if(type == "down") {
			if(isNaN(clearance)) {
				printSyntax();
				return true;
			}
			for(var i = 0; i > parseInt("-"+depth) - 1; i--)
				bb.addPrism(blockType, [Math.abs(i), i, 0], 1, width, clearance);
		}
		bb.attachTo(x,y,z, player.getRotation());
		
		return true;
	}
});