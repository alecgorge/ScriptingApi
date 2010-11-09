/**
	A simple example of getting the block the user is aiming at.
	
	Also a simple example of BlockBuilder.
*/
Api.onCommand(function (player, split) {
	if(split[0] == "/hitblox") {
		var h = Api.createHitBlox(player);
		var block = h.getTargetBlock();
		var x = block.getX();
		var y = block.getY();
		var z = block.getZ();
		
		var bb = new BlockBuilder();
		
		// create a 8x1x1 stone prism at 0,0,0 in respect to the points given at attachTo
		bb.addPrism(Blocks.Stone, [0, 0, 0], 8, 1, 1);

		// remove a block
		bb.removeBlock(4, 0, 0);
		
		// add a different block in its place.
		bb.add(Blocks.Wood, 4, 0, 0);

		// construct a 8x1x1 grass prism one block higher than the previous one
		bb.addPrism(2, [0, 1, 0], 8, 1, 1);
		
		// attach it to the world where the user is pointing, but one block higher so it 
		// is build above ground. player.getRotation() is passed so the structure is built
		// in the correct direction relative to the player. This makes it so that in 
		// BlockBuilder, the x axis is always going straight away from the player and the
		// z axis is always perpendicular to the player.
		bb.attachTo(x, y + 1, z, player.getRotation());
		return true;
	}
});