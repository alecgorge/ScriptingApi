Api.onCommand(function (player, split) {
	var printSyntax = function () {
		player.sendMessage(Color.Red + 'Syntax is /replace radius findBlock replaceBlock');
	};
	
	if(Api.isCommand("cylinder", split)) {
		var args = Api.parseArgs(["block", "number", "number"], [], split);
		
		if(!args) {
			player.sendMessage(Color.Red + 'Syntax is /cylinder blockType radius height');
			return true;
		}
		
		var blockId = args[0];
		var radius = args[1];
		var height = args[2];
		
		var h = Api.createHitBlox(player);
		var block = h.getTargetBlock();
		
		var b = new BlockBuilder();
		b.cylinder(blockId, [0,0,0], height, radius);
		b.attachTo(block.getX(), block.getY()+1, block.getZ(), player.getRotation());
		
		return true;
	}
	
	if(Api.isCommand("pyramid", split)) {
		var args = Api.parseArgs(["block", "number", "number"], [], split);
		
		if(!args) {
			player.sendMessage(Color.Red + 'Syntax is /pyramid blockType length width');
			return true;
		}
		
		var blockId = args[0];
		var length = args[1];
		var width = args[2];
		
		var h = Api.createHitBlox(player);
		var block = h.getTargetBlock();
		
		var b = new BlockBuilder();
		b.pyramid(blockId, [0,0,0], length, width);
		b.attachTo(block.getX(), block.getY()+1, block.getZ(), player.getRotation());
		
		return true;
	}
});