Api.onCommand(function (player, split) {
	var printSyntax = function () {
		player.sendMessage(Color.Red + 'Syntax is /items search quanity.Search is wildcard (*) enabled');
	};
	
	if(Api.isCommand("replace", split)) {
		var args = Api.parseArgs(["number", "block", "block"], [], split);
		
		if(!args) {
			printSyntax();
			return true;
		}
		
		var radius = args[0];
		var find = args[1];
		var replace = args[2];
		
		var x = player.getX();
		var y = player.getY();
		var z = player.getZ();
		
		for (var i = (x - radius); i < (x + radius + 1); i++)
			for (var j = (z - radius - 1); j < (z + radius); j++)
				for(var f = (y - radius); f < (y + radius); f++)
					if (this.getBlockIdAt(i, f, j) == find)
						this.setBlockAt(replace, i, f, j);
		
		return true;
	}
});