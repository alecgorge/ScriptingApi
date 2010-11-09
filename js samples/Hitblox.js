
Api.onCommand(function (player, split) {
	if(split[0] == "/hitblox") {
		var h = Api.createHitBlox(player);
		var block = h.getTargetBlock();
		var x = block.getX();
		var y = block.getY()+1;
		var z = block.getZ();
		
		var bb = new BlockBuilder();
		bb.addPrism(1, [0, 0, 0], 8, 1, 1);

		bb.removeBlock(4, 0, 0);

		bb.addPrism(2, [0, 1, 0], 8, 1, 1);
		bb.attachTo(x,y,z, player.getRotation());
		return true;
	}
});