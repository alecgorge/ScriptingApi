Api.onChat(function (player) {
	var i = player.getInventory();
	i.removeItem(Api.createItem(1,10));
	i.updateInventory();
});