
Api.onCommand(function (player, split) {
	var command = split[0].substring(1);
	var args = [];
	if(split.length > 1) {
		args = split.slice(1);
	}
	
	var printSyntax = function () {
		player.sendMessage(Color.Red + 'Syntax is /'+command+' modelName [scale] [vertical pos]');
	};
		
	if(command == "model") {
		var model = args[0];
		var scale = parseInt(args[1]);
		
		if(isNaN(scale)) {
			scale = false;
		}
		
		var shift = parseInt(args[2]);
		
		if(isNaN(shift)) {
			shift = 0;
		}
		
		if(typeof(model) == "undefined") {
			printSyntax();
			return true;
		}
		
		var target = Api.createHitBlox(player);
		var block = target.getTargetBlock();
		
		var x = block.getX();
		var y = block.getY()+1;
		var z = block.getZ();
		
		importPackage(java.io);
		
		function getScript (name) {
			
		}
		
		// File.
		
		Api.loadJar("plugins"+Api.seperator+"objimport.jar");
		importClass(java.lang.System);
		importClass(com.obj.WavefrontObject);		
		
		var dir = System.getProperty("user.dir").concat(Api.seperator+"models").concat(Api.seperator);		
		
		var block = new BlockBuilder();
		// block.addPrism(blockType, [0, 0, 0], length, width, height);
		block.attachTo(x,y+shift,z, player.getRotation());
		// block.attachTo(x,y,z, player.getRotation());
		
		return true;
	}
});