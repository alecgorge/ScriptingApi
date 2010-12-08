Api.onCommand(function (player, split) {
	var command = split[0].substring(1);
	var args = [];
	if(split.length > 1) {
		args = split.slice(1);
	}
		
	var printSyntax = function () {
		player.sendMessage(Color.Red + 'Syntax is /'+command+' radius findID replaceID');
	};
		
	if(command == "replace") {
		var radius = parseInt(args[0]);
		var find = parseInt(args[1]);
		var replace = parseInt(args[2]);
		
		if(isNaN(radius) || isNaN(find) || isNaN(replace)) {
			printSyntax();
			return true;
		}
		
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