<title>Hooks for ScriptingApi</title><pre>
<?php
/* This script pulls the list of hooks that are exposed to the scripts, compares them to the most recent list from up to date javadocs.

This script also generates the proper JS and Python for the hooks. This should eliminate many of the hook related mistakes I make. 

last update: 1/2/2011
*/

$in = file_get_contents("src/ScriptingApi.java");
$comp = explode("<!-- ========== METHOD SUMMARY =========== -->", file_get_contents("http://hmod.ricin.us/javadoc/PluginListener.html"));
preg_match_all('#<STRONG><A HREF="PluginListener.html.*">([a-zA-Z]+)</A></STRONG>#', $comp[1], $comp_matches);
$comp_matches = $comp_matches[1];

$parts['js'] = <<<EOT
	%s : function (c) { this.bind("%s", c); },

EOT;

$parts['py'] = <<<EOT
	@staticmethod
	def %s(c):
		Api.bind("%s", c)
	

EOT;

$parts['doc'] = <<<EOT
	* `Api.%s`

EOT;

preg_match_all('/trigger\(\s*"([a-zA-Z]+)",/', $in, $matches);
foreach($matches[1] as $hook) {	
	$p1 = "on".ucwords($hook);
	$this_comp_matches[] = $p1;
	if(array_search($p1, $comp_matches) === false) {
		echo "Error: $p1 isn't a valid hook according to the docs\n";
	}
	foreach($parts as $k => $v)
		$res[$k] .= sprintf($v, "on".ucwords($hook), $hook);
}

foreach($comp_matches as $hook) {
	if(array_search($hook, $this_comp_matches) === false) {
		echo "Error: $hook doesn't exist in the current plugin.\n";
	}
}

echo "\n\n";

foreach($res as $v)
	echo $v."\n\n\n\n";
		