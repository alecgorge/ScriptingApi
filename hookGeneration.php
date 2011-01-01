<?php

$in = <<<EOT
ARM_SWING
ATTACK
BAN
BLOCK_BROKEN
BLOCK_CREATED
BLOCK_DESTROYED
BLOCK_PHYSICS
BLOCK_PLACE
BLOCK_RIGHTCLICKED
CHAT
COMMAND
DAMAGE
DISCONNECT
EXPLODE
FLOW
HEALTH_CHANGE
IGNITE
IPBAN
ITEM_DROP
ITEM_PICK_UP
ITEM_USE
KICK
LIQUID_DESTROY
LOGIN
LOGINCHECK
OPEN_INVENTORY
MOB_SPAWN
PLAYER_MOVE
REDSTONE_CHANGE
SERVERCOMMAND
SIGN_CHANGE
SIGN_SHOW
TELEPORT
VEHICLE_COLLISION
VEHICLE_CREATE
VEHICLE_DAMAGE
VEHICLE_DESTROYED
VEHICLE_ENTERED
VEHICLE_POSITIONCHANGE
VEHICLE_UPDATE
EOT;

$js = <<<EOT
	%s : function (c) { this.bind("%s", c); },

EOT;

$py = <<<EOT
	@staticmethod
	def %s(c):
		Api.bind("%s", c)
	

EOT;

$a = explode("\n", $in);
foreach($a as $hook) {
	$actual = (array)explode("_", strtolower($hook));
	$jss[] = sprintf($js, "on".ucwords($actual[0]).ucwords($actual[1]), $actual[0].ucwords($actual[1]));
	$pys[] = sprintf($py, "on".ucwords($actual[0]).ucwords($actual[1]), $actual[0].ucwords($actual[1]));
}
foreach($jss as $v)
	echo $v;
foreach($pys as $v)
	echo $v;
