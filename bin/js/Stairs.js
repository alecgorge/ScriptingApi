Api.onCommand(function (player, split) {	
	var printSyntax = function () {
		player.sendMessage(Color.Red + 'Syntax is /stairs blockType upOrDown width depth [clearance]');
	};
	
	if(Api.isCommand("stairs", split)) {
		var args = Api.parseArgs(["block", "string", "number", "number"], ["number"], split);
		
		if(!args) {
			printSyntax();
			return true;
		}
		
		var blockType = args[0];
		var type = args[1];
		var width = args[2];
		var depth = args[3];
		var clearance = args[4];
		
		if(!(type == "up" || type == "down")) {
			printSyntax();
			return true;
		}
		
		var target = Api.createHitBlox(player);
		var block = target.getTargetBlock();
		
		var x = block.getX();
		var y = block.getY();
		var z = block.getZ();
		
		var bb = new BlockBuilder();
		
		if(type == "up") {
			y++;
			for(var i = 0; i < depth; i++)
				bb.addPrism(blockType, [i, i, 0], 1, width, (isNaN(clearance) ? 1 : clearance));
		}
		else if(type == "down") {
			for(var i = 0; i > parseInt("-"+depth) - 1; i--)
				bb.addPrism(blockType, [Math.abs(i), i, 0], 1, width, clearance);
		}
		bb.attachTo(x,y,z, player.getRotation());
		
		return true;
	}
});