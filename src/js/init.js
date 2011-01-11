/* syntax sugar and handy grouping of api calls. I have to do this because Java can't create "complex" objects like this. */
Api = {
	server : Minecraft.getServer(),
	version : Minecraft.getPluginVersion(),
	name : Minecraft.getPluginName(),
	create : function (className, args) {
		return Minecraft.create(className, args);
	},
	fetchEnum : function (className) {
		return Minecraft.getEnum(className);
	},
	createItem : function (a,b,c) {
		if(typeof(a) == "undefined") return Minecraft.createItem();
		else if(typeof(c) == "undefined") return Minecraft.createItem(a,b);
		return Minecraft.createItem(a,b,c);
	},
	createLocation : function (a,b,c,x,y) {
		if(typeof(a) == "undefined") return Minecraft.createLocation();
		else if(typeof(x) == "undefined") return Minecraft.createLocation(a,b,c);
		return Minecraft.createLocation(a,b,c,x,y);
	},
	log : Minecraft.getLog(),
	pluginLoader : Minecraft.getLoader(),
	mcServer : Minecraft.getMCServer(),
	etc : Minecraft.getEtc(),
	createHitBlox : function (player) {
		return Minecraft.createHitBlox(player);
	},
	bind : function (key, callback) {
		Minecraft.bind(key, callback);
	},
	broadcast : function (message, group, notInGroup) {
		if(typeof(group) == "undefined") group = "";
		if(typeof(notInGroup) == "undefined") notInGroup = false;
		Minecraft.broadcast(message, group, notInGroup);
	},
	onPlayerMove : function (c) { this.bind("playerMove", c); },
	onSignShow : function (c) { this.bind("signShow", c); },
	onSignChange : function (c) { this.bind("signChange", c); },
	onOpenInventory : function (c) { this.bind("openInventory", c); },
	onTeleport : function (c) { this.bind("teleport", c); },
	onLoginChecks : function (c) { this.bind("loginChecks", c); },
	onLogin : function (c) { this.bind("login", c); },
	onDisconnect : function (c) { this.bind("disconnect", c); },
	onChat : function (c) { this.bind("chat", c); },
	onCommand : function (c) { this.bind("command", c); },
	onConsoleCommand : function (c) { this.bind("consoleCommand", c); },
	onBan : function (c) { this.bind("ban", c); },
	onIpBan : function (c) { this.bind("ipBan", c); },
	onKick : function (c) { this.bind("kick", c); },
	onBlockCreate : function (c) { this.bind("blockCreate", c); },
	onBlockDestroy : function (c) { this.bind("blockDestroy", c); },
	onArmSwing : function (c) { this.bind("armSwing", c); },
	onAttack : function (c) { this.bind("attack", c); },
	onBlockBreak : function (c) { this.bind("blockBreak", c); },
	onBlockPlace : function (c) { this.bind("blockPlace", c); },
	onBlockPhysics : function (c) { this.bind("blockPhysics", c); },
	onBlockRightClicked : function (c) { this.bind("blockRightClicked", c); },
	onDamage : function (c) { this.bind("damage", c); },
	onExplode : function (c) { this.bind("explode", c); },
	onFlow : function (c) { this.bind("flow", c); },
	onHealthChange : function (c) { this.bind("healthChange", c); },
	onIgnite : function (c) { this.bind("ignite", c); },
	onItemDrop : function (c) { this.bind("itemDrop", c); },
	onItemPickUp : function (c) { this.bind("itemPickUp", c); },
	onItemUse : function (c) { this.bind("itemUse", c); },
	onLiquidDestroy : function (c) { this.bind("liquidDestroy", c); },
	onMobSpawn : function (c) { this.bind("mobSpawn", c); },
	onRedstoneChange : function (c) { this.bind("redstoneChange", c); },
	onVehicleCollision : function (c) { this.bind("vehicleCollision", c); },
	onVehicleDamage : function (c) { this.bind("vehicleDamage", c); },
	onVehicleCreate : function (c) { this.bind("vehicleCreate", c); },
	onVehicleDestroyed : function (c) { this.bind("vehicleDestroyed", c); },
	onVehicleEnter : function (c) { this.bind("vehicleEnter", c); },
	onVehiclePositionChange : function (c) { this.bind("vehiclePositionChange", c); },
	onVehicleUpdate : function (c) { this.bind("vehicleUpdate", c); },

	parsers : {
		'all' : function (input) {
			return [true, input];
		},
		'number' : function (input) {
			var n = parseInt(input);
			if(isNaN(n)) {
				return false;
			}
			return [true, n];
		},
		'block' : function (input) {
			var lower = input.toLowerCase();
			var id = -1;
			
			if(isNaN(parseInt(input))) {
				for(var i in Items) {
					if(i.toLowerCase() == lower) {
						id = Items[i];
						break;
					}
				}
			}
			else {
				id = parseInt(input);
			}
			
			if(typeof(ItemIds[id]) == "string") {
				return [true, id];
			}
			
			return false;
		},
		'string' : function (input) {
			return [true, input+""];
		},
		
	},
	parseArgs : function (requiredArgs, optionalArgs, split) {
		var args = [];
		if(split.length > 1) {
			args = split.slice(1);
		}
		
		if(args.length >= requiredArgs.length && args.length <= requiredArgs.length+optionalArgs.length) {
			var r = [];
			// test required
			for(var i in requiredArgs) {
				var res = this.parsers[requiredArgs[i]](args[i]);
				if(res === false) {
					return false;
				}
				r.push(res[1]);
			}
			
			if(optionalArgs.length > 0) {
				for(var i in optionalArgs) {
					var argIndex = requiredArgs.length - 1 + i;
					if(argIndex < args.length) {
						var res = this.parsers[optionalArgs[i]](args[argIndex]);
						if(res === false) {
							return false;
						}
						r.push(res[1]);
					}
				}
			}
			
			return r;
		}
		return false;
	},
	isCommand : function(testCommand, split) {
		return !(split[0].substring(1) != testCommand);
	}
};

/* Directions */
/**
 * Returns compass direction according to your rotation
 * @param degrees
 * @return string direction
 */
Api.getCompassPointForDirection = function(degrees) {
	if (0 <= degrees && degrees < 22.5) {
		return "N";
	} else if (22.5 <= degrees && degrees < 67.5) {
		return "NE";
	} else if (67.5 <= degrees && degrees < 112.5) {
		return "E";
	} else if (112.5 <= degrees && degrees < 157.5) {
		return "SE";
	} else if (157.5 <= degrees && degrees < 202.5) {
		return "S";
	} else if (202.5 <= degrees && degrees < 247.5) {
		return "SW";
	} else if (247.5 <= degrees && degrees < 292.5) {
		return "W";
	} else if (292.5 <= degrees && degrees < 337.5) {
		return "NW";
	} else if (337.5 <= degrees && degrees < 360.0) {
		return "N";
	} else {
		return "ERR";
	}
};

/**
	Takes a result like the one from player.getRotation() and returns the axis
	that player is pointed towards.
*/
Api.rotationToAxis = function (rotation) {
	var degrees;

	if(rotation >= 0 && rotation < 360) {
		degrees = rotation;
	}
	else {
		degrees = ((rotation - 90) % 360);
		if (degrees < 0) degrees+= 360.0;
	}

	var getXYZ = function (degrees) {
		if (0 <= degrees && degrees < 67.5) {
			return "x-";
		} else if (67.5 <= degrees && degrees < 112.5) {
			return "z-";
		} else if (112.5 <= degrees && degrees < 202.5) {
			return "x+";
		} else if (202.5 <= degrees && degrees < 292.5) {
			return "z+";
		} else if (292.5 <= degrees && degrees < 360.0) {
			return "x-";
		}
	};
	
	return getXYZ(degrees);
};


/* Colors for text chat */
Colors = {
    Black : "\u00A70",
    Navy : "\u00A71",
    Green : "\u00A72",
    Blue : "\u00A73",
    Red : "\u00A74",
    Purple : "\u00A75",
    Gold : "\u00A76",
    LightGray : "\u00A77",
    Gray : "\u00A78",
    DarkPurple : "\u00A79",
    LightGreen : "\u00A7a",
    LightBlue : "\u00A7b",
    Rose : "\u00A7c",
    LightPurple : "\u00A7d",
    Yellow : "\u00A7e",
    White : "\u00A7f"
};
Color = Colors;

function BlockBuilder() {
	this.blocks = [];
	this.blockRef = {};
	
	this.add = function(id, x, y, z) {
		if(typeof(id.blocks) == "object") {
			for(var i in id.blocks) {
				if(id.blocks[i] == null) continue;
				this.blocks.push(id.blocks[0], id.blocks[1], id.blocks[2], id.blocks[3]);
			}
		}
		
		this.blockRef[""+x+y+z] = this.blocks.push([id, x, y, z]);
		return this;
	};
	
	this.addPrism = function (id, start, length, width, height) {
		var sx = start[0];
		var sy = start[1];
		var sz = start[2];
		var ex = sx+length;
		var ey = sy+height-1;
		var ez = sz+width;
		
		for(var i = sx; i < ex; i++)
			for(var j = sy; j <= ey; j++)
				for(var f = sz; f < ez; f++)
					this.add(id, i, j, f);
		return this;
	};
	
	this.prism = this.addPrism;
	
	this.attachTo = function(x, y, z, rot) {
		var dir = Api.rotationToAxis(rot);
		
		var doX, doZ;
		if(dir == "x-") {			
			doX = true;
			doZ = true;
		} else if (dir == "x+") {
			doX = false;
			doZ = false;
		} else if (dir == "z-") {
			doX = false;
			doZ = true;
		} else if (dir == "z+") {
			doX = true;
			doZ = false;
		}
		
		for(var i in this.blocks) {
			var ref = this.blocks[i];
			
			if(ref == null) continue;
			
			
			// where i = :
			// 1 = length
			// 2 = height
			// 3 = width
			if(doX && doZ)
				Api.server.setBlockAt(ref[0], x - ref[1], y + ref[2], z - ref[3]);
			else if(!doX && !doZ)
				Api.server.setBlockAt(ref[0], x + ref[1], y + ref[2], z + ref[3]);
			else if(!doX && doZ)
				Api.server.setBlockAt(ref[0], x + ref[3], y + ref[2], z - ref[1]);
			else if(doX && !doZ)
				Api.server.setBlockAt(ref[0], x - ref[3], y + ref[2], z + ref[1]);
		}
		return this;
	}
	
	this.line = function (id,start,end) {
		var arrmax = function() {
			var max = this[0];
			var len = this.length;
			for (var i = 1; i < len; i++) if (this[i] > max) max = this[i];
			return max;
		};
	
		function pointsInLine (p1, p2) {
			var pxd = p2['x'] - p1['x'];
			var pzd = p2['z'] - p1['z'];
			var pyd = p2['y'] - p1['y'];

			// Find out steps
			var steps = arrmax(p1['x'], p1['y'], p2['x'], p2['y'], p1['z'], p2['z']);

			var coords = [p1];

			for (var i = 0; i < steps; i++)
				coords.push([
					Math.round(p1.x += pxd / steps),
					Math.round(p1.y += pyd / steps),
					Math.round(p1.z += pzd / steps)
				]);
				
			return coords;
		}
		var points = pointsInLine({x:start[0],y:start[1],z:start[2]},{x:end[0],y:end[1],z:end[2]});
		
		for(var i in points) {
			this.add(id,points[i].x,points[i].y,points[i].z);
		}
		return this;
	};
	
	this.circle = function (type, center, radius) {
		radius = parseInt(radius);
		for(var i in center) { center[i] = parseInt(center[i]); }
		
		function calculateEllipse(x, y, a, b, steps) {
			if (steps == null) steps = 36;
			var points = [];

			// Angle is given by Degree Value
			// var beta = -angle * (Math.PI / 180); //(Math.PI/180) converts Degree Value into Radians
			var sinbeta = 1;//Math.sin(beta);
			var cosbeta = 1;//Math.cos(beta);

			for (var i = 0; i < 360; i += 360 / steps) {
				var alpha = i * (Math.PI / 180);
				var sinalpha = Math.sin(alpha);
				var cosalpha = Math.cos(alpha);

				var X = x + (a * cosalpha * cosbeta - b * sinalpha * sinbeta);
				var Y = y + (a * cosalpha * sinbeta + b * sinalpha * cosbeta);

				points.push([Math.round(X), Math.round(Y)]);
			}

			return points;
		}
		function ellipse (xc, yc, xr, yr) {
			var points = [];
			for(var xcoord = 0-xr; xcoord <= xr; xcoord++) {
				var angle = Math.atan2(xcoord, ycoord);
				points.push([xc+Math.cos(angle)*xr, yc+Math.sin(angle)*yr]);
			}
					
			return points;
		}
		
		var points = calculateEllipse(center[0], center[2], radius/2, radius/2,  36);
		for(var i in points) {
			this.add(type, points[i][0], center[1], points[i][1]);
		}
		
		return this;
	};
	
	this.sphere = function (type, center, radius) {
		for(var i = 1; i < radius; i++)
			this.circle(type, [center[0], center[1]-(radius-i), center[2]], i);
		for(var i = radius; i > 0; i--)
			this.circle(type, [center[0], center[1]+(radius-i), center[2]], i);
		return this;
	};
	
	this.pyramid = function (type, start, length, width) {
		var i = 0;
		while(i !== false) {
			this.prism(type, [start[0]+i, start[1]+i, start[2]+i], length, width, 1);
			
			i++;
			length -= 2;
			width -= 2;
			
			if(length < 1 || width < 1) i = false;
		}
		return this;
	}
	
    this.invertedCone = function (type, center, radius, height) {
		var new_r = radius;
		for (var y = -1; y < height-1; y++) {
			new_r = radius - (radius * (y/height));
			this.circle(type, center, new_r);
		}
		return this;		
    };

    this.cone = function (type, center, radius, height) {
		var new_r;
		for (var y = -1; y < height-1; y++) {
			new_r = (radius * (y/height));
			this.circle(type, center, new_r);
		}
		return this;
    };
	
	this.cylinder = function (id, center, height, radius) {
		for (var y = 0; y < height; y++)
			this.circle(id, [center[0], center[1]+y, center[2]], radius);
		return this;
	};
	
	this.removeBlock = function(x, y, z) {
		delete this.blocks[this.blockRef[""+x+y+z]];
		delete this.blockRef[""+x+y+z];
		return this;
	};
}

Items = {
	"Air" : 0, "Stone" : 1, "Grass" : 2, "Dirt" : 3, "Cobblestone" : 4, "Wood" : 5, "Sapling" : 6, "Bedrock" : 7, "Water" : 8, "Stationary water" : 9,
	"Lava" : 10, "Stationary lava" : 11, "Sand" : 12, "Gravel" : 13, "Gold ore" : 14, "Iron ore" : 15, "Coal ore" : 16, "Log" : 17, "Leaves" : 18, "Sponge" : 19, "Glass" : 20,
	"Yellow flower" : 37, "Red rose" : 38, "Brown Mushroom" : 39, "Red Mushroom" : 40, "Gold Block" : 41, "Iron Block" : 42, "Double Step" : 43, "Step" : 44, "Brick" : 45, "TNT" : 46, "Bookshelf" : 47,
	"Mossy Cobblestone" : 48, "Obsidian" : 49, "Torch" : 50, "Fire" : 51, "Mob Spawner" : 52, "Wooden Stairs" : 53, "Chest" : 54, "Redstone Wire" : 55, "Diamond Ore" : 56, "Diamond Block" : 57, "Workbench" : 58,
	"Crops" : 59, "Soil" : 60, "Furnace" : 61, "Burning Furnace" : 62, "Sign Post" : 63, "Wooden Door" : 64, "Ladder" : 65, "Minecart Tracks" : 66, "Cobblestone Stairs" : 67, "Wall Sign" : 68, "Lever" : 69,
	"Stone Pressure Plate" : 70, "Iron Door" : 71, "Wooden Pressure Plate" : 72, "Redstone Ore" : 73, "Glowing Redstone Ore" : 74, "Redstone torch (\"off\" state)" : 75, "Redstone torch (\"on\" state)" : 76, "Stone Button" : 77, "Snow" : 78, "Ice" : 79, "Snow Block" : 80,
	"Cactus" : 81, "Clay" : 82, "Reed" : 83, "Jukebox" : 84, "Fence" : 85, "Pumpkin" : 86, "Bloodstone" : 87, "Slow Sand" : 88, "Lightstone" : 89, "Portal" : 90, "Jack-O-Lantern" : 91,
	"Iron Spade" : 256, "Iron Pickaxe" : 257, "Iron Axe" : 258, "Flint and Steel" : 259, "Apple" : 260, "Bow" : 261, "Arrow" : 262, "Coal" : 263, "Diamond" : 264, "Iron Ingot" : 265, "Gold Ingot" : 266,
	"Iron Sword" : 267, "Wooden Sword" : 268, "Wooden Spade" : 269, "Wooden Pickaxe" : 270, "Wooden Axe" : 271, "Stone Sword" : 272, "Stone Spade" : 273, "Stone Pickaxe" : 274, "Stone Axe" : 275, "Diamond Sword" : 276, "Diamond Spade" : 277,
	"Diamond Pickaxe" : 278, "Diamond Axe" : 279, "Stick" : 280, "Bowl" : 281, "Mushroom Soup" : 282, "Gold Sword" : 283, "Gold Spade" : 284, "Gold Pickaxe" : 285, "Gold Axe" : 286, "String" : 287, "Feather" : 288,
	"Gunpowder" : 289, "Wooden Hoe" : 290, "Stone Hoe" : 291, "Iron Hoe" : 292, "Diamond Hoe" : 293, "Gold Hoe" : 294, "Seeds" : 295, "Wheat" : 296, "Bread" : 297, "Leather Helmet" : 298, "Leather Chestplate" : 299,
	"Leather Leggings" : 300, "Leather Boots" : 301, "Chainmail Helmet" : 302, "Chainmail Chestplate" : 303, "Chainmail Leggings" : 304, "Chainmail Boots" : 305, "Iron Helmet" : 306, "Iron Chestplate" : 307, "Iron Leggings" : 308, "Iron Boots" : 309, "Diamond Helmet" : 310,
	"Diamond Chestplate" : 311, "Diamond Leggings" : 312, "Diamond Boots" : 313, "Gold Helmet" : 314, "Gold Chestplate" : 315, "Gold Leggings" : 316, "Gold Boots" : 317, "Flint" : 318, "Pork" : 319, "Grilled Pork" : 320, "Paintings" : 321,
	"Golden apple" : 322, "Sign" : 323, "Wooden door" : 324, "Bucket" : 325, "Water bucket" : 326, "Lava bucket" : 327, "Mine cart" : 328, "Saddle" : 329, "Iron door" : 330, "Redstone" : 331, "Snowball" : 332,
	"Boat" : 333, "Leather" : 334, "Milk Bucket" : 335, "Clay Brick" : 336, "Clay Balls" : 337, "Reed" : 338, "Paper" : 339, "Book" : 340, "Slime Ball" : 341, "Storage Minecart" : 342, "Powered Minecart" : 343,
	"Egg" : 344, "Compass" : 345, "Fishing Rod" : 346, "Watch" : 347, "Lightstone Dust" : 348, "Raw Fish" : 349, "Cooked Fish" : 350, "Gold Record" : 2256, "Green Record" : 2257,
};
ItemIds = {
	0 : 'Air', 1 : 'Stone', 2 : 'Grass', 3 : 'Dirt', 4 : 'Cobblestone', 5 : 'Wood', 6 : 'Sapling', 7 : 'Bedrock', 8 : 'Water', 9 : 'Stationary water', 10 : 'Lava',
	11 : 'Stationary lava', 12 : 'Sand', 13 : 'Gravel', 14 : 'Gold ore', 15 : 'Iron ore', 16 : 'Coal ore', 17 : 'Log', 18 : 'Leaves', 19 : 'Sponge', 20 : 'Glass', 37 : 'Yellow flower',
	38 : 'Red rose', 39 : 'Brown Mushroom', 40 : 'Red Mushroom', 41 : 'Gold Block', 42 : 'Iron Block', 43 : 'Double Step', 44 : 'Step', 45 : 'Brick', 46 : 'TNT', 47 : 'Bookshelf', 48 : 'Mossy Cobblestone',
	49 : 'Obsidian', 50 : 'Torch', 51 : 'Fire', 52 : 'Mob Spawner', 53 : 'Wooden Stairs', 54 : 'Chest', 55 : 'Redstone Wire', 56 : 'Diamond Ore', 57 : 'Diamond Block', 58 : 'Workbench', 59 : 'Crops',
	60 : 'Soil', 61 : 'Furnace', 62 : 'Burning Furnace', 63 : 'Sign Post', 64 : 'Wooden Door', 65 : 'Ladder', 66 : 'Minecart Tracks', 67 : 'Cobblestone Stairs', 68 : 'Wall Sign', 69 : 'Lever', 70 : 'Stone Pressure Plate',
	71 : 'Iron Door', 72 : 'Wooden Pressure Plate', 73 : 'Redstone Ore', 74 : 'Glowing Redstone Ore', 75 : 'Redstone torch ("off" state)', 76 : 'Redstone torch ("on" state)', 77 : 'Stone Button', 78 : 'Snow', 79 : 'Ice', 80 : 'Snow Block', 81 : 'Cactus',
	82 : 'Clay', 83 : 'Reed', 84 : 'Jukebox', 85 : 'Fence', 86 : 'Pumpkin', 87 : 'Bloodstone', 88 : 'Slow Sand', 89 : 'Lightstone', 90 : 'Portal', 91 : 'Jack-O-Lantern', 256 : 'Iron Spade',
	257 : 'Iron Pickaxe', 258 : 'Iron Axe', 259 : 'Flint and Steel', 260 : 'Apple', 261 : 'Bow', 262 : 'Arrow', 263 : 'Coal', 264 : 'Diamond', 265 : 'Iron Ingot', 266 : 'Gold Ingot', 267 : 'Iron Sword',
	268 : 'Wooden Sword', 269 : 'Wooden Spade', 270 : 'Wooden Pickaxe', 271 : 'Wooden Axe', 272 : 'Stone Sword', 273 : 'Stone Spade', 274 : 'Stone Pickaxe', 275 : 'Stone Axe', 276 : 'Diamond Sword', 277 : 'Diamond Spade', 278 : 'Diamond Pickaxe',
	279 : 'Diamond Axe', 280 : 'Stick', 281 : 'Bowl', 282 : 'Mushroom Soup', 283 : 'Gold Sword', 284 : 'Gold Spade', 285 : 'Gold Pickaxe', 286 : 'Gold Axe', 287 : 'String', 288 : 'Feather', 289 : 'Gunpowder',
	290 : 'Wooden Hoe', 291 : 'Stone Hoe', 292 : 'Iron Hoe', 293 : 'Diamond Hoe', 294 : 'Gold Hoe', 295 : 'Seeds', 296 : 'Wheat', 297 : 'Bread', 298 : 'Leather Helmet', 299 : 'Leather Chestplate', 300 : 'Leather Leggings',
	301 : 'Leather Boots', 302 : 'Chainmail Helmet', 303 : 'Chainmail Chestplate', 304 : 'Chainmail Leggings', 305 : 'Chainmail Boots', 306 : 'Iron Helmet', 307 : 'Iron Chestplate', 308 : 'Iron Leggings', 309 : 'Iron Boots', 310 : 'Diamond Helmet', 311 : 'Diamond Chestplate',
	312 : 'Diamond Leggings', 313 : 'Diamond Boots', 314 : 'Gold Helmet', 315 : 'Gold Chestplate', 316 : 'Gold Leggings', 317 : 'Gold Boots', 318 : 'Flint', 319 : 'Pork', 320 : 'Grilled Pork', 321 : 'Paintings', 322 : 'Golden apple',
	323 : 'Sign', 324 : 'Wooden door', 325 : 'Bucket', 326 : 'Water bucket', 327 : 'Lava bucket', 328 : 'Mine cart', 329 : 'Saddle', 330 : 'Iron door', 331 : 'Redstone', 332 : 'Snowball', 333 : 'Boat',
	334 : 'Leather', 335 : 'Milk Bucket', 336 : 'Clay Brick', 337 : 'Clay Balls', 338 : 'Reed', 339 : 'Paper', 340 : 'Book', 341 : 'Slime Ball', 342 : 'Storage Minecart', 343 : 'Powered Minecart', 344 : 'Egg',
	345 : 'Compass', 346 : 'Fishing Rod', 347 : 'Watch', 348 : 'Lightstone Dust', 349 : 'Raw Fish', 350 : 'Cooked Fish', 2256 : 'Gold Record', 2257 : 'Green Record'
};
Blocks = Items;
