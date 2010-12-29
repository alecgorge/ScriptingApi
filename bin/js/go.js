Api.onCommand(function (player, split) {	
	if(Api.isCommand("go", split)) {
		var h = Api.createHitBlox(player);
		var block = h.getTargetBlock();
		
		player.teleportTo(block.getX(), Api.server.getHighestBlockY(block.getX(), block.getZ()), block.getZ(), player.getRotation(), player.getPitch());
		
		return true;
	}
});