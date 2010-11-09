/**
	This file adds a command called "items" that allows you to retrieve
	items using a regex search. All *'s are replaced with (.*) for regex
	compatibility. Here is an example:

	/items diamond*axe 1 

	That would give you a Diamond Axe and a Diamond Pickaxe.
*/
Api.onCommand(function (player, split) {
	var command = split[0].substring(1);
	var args = [];
	if(split.length > 1) {
		args = split.slice(1);
	}

	if(command == "items") {
		var quantity = parseInt(args[args.length-1]);
		if(isNaN(quantity)) {
			player.sendMessage(Color.Red + 'Syntax is /'+command+' search quanity.Search is wildcard (*) enabled');
			return true;
		}
		
		var firstArg = parseInt(args[0]);
		var itemid = [];
		if(!isNaN(firstArg)) {
			itemid.push(firstArg);
		}
		else {
			if(args.length > 2) {
				var searchArgs = args.slice(0,-1).join(" ");
			}
			else {
				var searchArgs = args[0];
			}
			
			var regexSearch = (searchArgs+"").toLowerCase().replace("*", "(.*)");
			for(var i in Blocks) {
				if(i.toLowerCase().match(regexSearch)) {
					itemid.push(Blocks[i]);
				}
			}
		}
		
		for(var i in itemid) {
			player.giveItemDrop(itemid[i], quantity);
		}
		
		player.sendMessage("Here you go!");
		
		return true;
	}
});