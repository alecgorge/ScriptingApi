Api.onChat(function (player) {
	var i = player.getInventory();
	i.removeItem(Api.create("Item", [1,10]));
	i.update();
});