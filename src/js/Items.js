/**
	This file adds a command called "items" that allows you to retrieve
	items using a regex search. All *'s are replaced with (.*) for regex
	compatibility. Here is an example:

	/items diamond*axe 1 

	That would give you a Diamond Axe and a Diamond Pickaxe.
*/
Api.onCommand(function (player, split) {
	var printSyntax = function () {
		player.sendMessage(Color.Red + 'Syntax is /items search quanity.Search is wildcard (*) enabled');
	};
	
	if(Api.isCommand("items", split)) {
		var args = Api.parseArgs(["string", "number"], [], split);
		
		if(!args) {
			printSyntax();
			return true;
		}
		
		var firstArg = args[0];
		var quantity = args[1];
		var itemid = [];
		if(!isNaN(firstArg))
			itemid.push(firstArg);
		else {
			if(args.length > 2)
				var searchArgs = args.slice(0,-1).join(" ");
			else
				var searchArgs = args[0];
			
			var regexSearch = (searchArgs+"").toLowerCase().replace("*", "(.*)");
			for(var i in Blocks)
				if(i.toLowerCase().match(regexSearch))
					itemid.push(Blocks[i]);
		}
		
		for(var i in itemid)
			player.giveItemDrop(itemid[i], quantity);
		
		player.sendMessage("Here you go!");
		
		return true;
	}
  return false;
});
