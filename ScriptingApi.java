import java.io.File;
import java.io.FileFilter;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.logging.Logger;

import javax.script.Invocable;
import javax.script.ScriptEngine;
import javax.script.ScriptEngineFactory;
import javax.script.ScriptEngineManager;
import javax.script.ScriptException;


/**
*
* @author alecgorge
*/
public class ScriptingApi extends Plugin  {
	private Listener l = new Listener(this);
	public static final Logger log = Logger.getLogger("Minecraft");
	private String name = "ScriptingApi";
	private String version = "rev 8";
	protected String abbr = "ScriptingApi";
	private ArrayList<PluginRegisteredListener> listeners = new ArrayList<PluginRegisteredListener>();

	String message;
	public static ScriptEngineManager manager = new ScriptEngineManager();
	public static HashMap<String, ScriptEngine> engines = new HashMap<String, ScriptEngine>();
	public static HashMap<String, Invocable> invoc = new HashMap<String, Invocable>();
	public static String pluginName = "";
	public static String pluginVersion = "";
	public String minGroup = "";
	public String engAbbr = "";
	
	public void enable() {
	}	
	
	public void disable() {
		log.info(name + " stopped ("+version+")");
		
		for(PluginRegisteredListener r : listeners) {
			etc.getLoader().removeListener(r);
		}
		MinecraftJSApi.bindings.clear();
	}
	
	public void doFile(String f, String ext) {
		try {
			engines.get(ext).eval(new InputStreamReader(new FileInputStream(f), "UTF-8"));
		} catch (IOException e) {
			e.printStackTrace();
		} catch (ScriptException e) {
			e.printStackTrace();
		} catch (NullPointerException e) {
			log.info(e.getMessage());
			e.printStackTrace();
		}
		
	}

	public void initialize() {
		pluginName = name;
		pluginVersion = version;
		
		File jython = new File(System.getProperty("user.dir") + File.separator + "plugins" + File.separator + "jython.jar");
		if(jython.exists()) {
			try {
				ClasspathHacker.addFile(jython);
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		
		List<ScriptEngineFactory> factories = manager.getEngineFactories();
		if(factories.size() == 0) {
			log.severe("You have no scripting engines! Install Rhino!");
			return;
		}
		
		engines.put("js", manager.getEngineByName("ECMAScript"));
		invoc.put("js", (Invocable) engines.get("js"));
		engines.get("js").put("Minecraft", new MinecraftJSApi());
		
		if(jython.exists()) {
			engines.put("py", manager.getEngineByName("python"));
			invoc.put("py", (Invocable) engines.get("py"));
			engines.get("py").put("Minecraft", new MinecraftJSApi());
		}
		
		//if()
		
		loadAll();
		
		log.info(name + " initialized ("+version+")");
		// Uncomment as needed.
		etc.getLoader().addListener( PluginLoader.Hook.ARM_SWING, l, this, PluginListener.Priority.MEDIUM);
		etc.getLoader().addListener( PluginLoader.Hook.BAN, l, this, PluginListener.Priority.MEDIUM);
		etc.getLoader().addListener( PluginLoader.Hook.BLOCK_CREATED, l, this, PluginListener.Priority.MEDIUM);
		etc.getLoader().addListener( PluginLoader.Hook.BLOCK_DESTROYED, l, this, PluginListener.Priority.MEDIUM);
		etc.getLoader().addListener( PluginLoader.Hook.CHAT, l, this, PluginListener.Priority.MEDIUM);
		etc.getLoader().addListener( PluginLoader.Hook.COMMAND, l, this, PluginListener.Priority.MEDIUM);
		etc.getLoader().addListener( PluginLoader.Hook.COMPLEX_BLOCK_CHANGE, l, this, PluginListener.Priority.MEDIUM);
		etc.getLoader().addListener( PluginLoader.Hook.COMPLEX_BLOCK_SEND, l, this, PluginListener.Priority.MEDIUM);
		etc.getLoader().addListener( PluginLoader.Hook.INVENTORY_CHANGE, l, this, PluginListener.Priority.MEDIUM);
		etc.getLoader().addListener( PluginLoader.Hook.CRAFTINVENTORY_CHANGE, l, this, PluginListener.Priority.MEDIUM);
		etc.getLoader().addListener( PluginLoader.Hook.EQUIPMENT_CHANGE, l, this, PluginListener.Priority.MEDIUM);
		etc.getLoader().addListener( PluginLoader.Hook.DISCONNECT, l, this, PluginListener.Priority.MEDIUM);
		etc.getLoader().addListener( PluginLoader.Hook.IPBAN, l, this, PluginListener.Priority.MEDIUM);
		etc.getLoader().addListener( PluginLoader.Hook.KICK, l, this, PluginListener.Priority.MEDIUM);
		etc.getLoader().addListener( PluginLoader.Hook.LOGIN, l, this, PluginListener.Priority.MEDIUM);
		etc.getLoader().addListener( PluginLoader.Hook.LOGINCHECK, l, this, PluginListener.Priority.MEDIUM);
		// etc.getLoader().addListener( PluginLoader.Hook.NUM_HOOKS, l, this, PluginListener.Priority.MEDIUM);
		etc.getLoader().addListener( PluginLoader.Hook.PLAYER_MOVE, l, this, PluginListener.Priority.MEDIUM);
		etc.getLoader().addListener( PluginLoader.Hook.SERVERCOMMAND, l, this, PluginListener.Priority.MEDIUM);
		etc.getLoader().addListener( PluginLoader.Hook.TELEPORT, l, this, PluginListener.Priority.MEDIUM);
	}
	
	public void loadAll () {
		MinecraftJSApi.bindings.clear();
		
		String dir = System.getProperty("user.dir").concat(File.separator+"js");
		
		File directory = new File(dir);
		File[] files = directory.listFiles(new FileFilter() {
			
			@Override
			public boolean accept(File pathname) {
				if(pathname.isFile()) return true;
				return false;
			}
		});
		
		PropertiesFile pf = new PropertiesFile("ScriptingApi.properties");
		try {
			pf.load();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		String group = pf.getString("min-group-level", "admin");
		pf.save();
		
		if(group != null && !group.equals("")) {
			minGroup = group;
		}
			
		// some 'init'ial setup that needs to be done FIRST
		doFile(dir+File.separator+"init.js", "js");

		for (int index = 0; index < files.length; index++) {
			if(!files[index].getName().equals("init.js")) {
				doFile(files[index].getPath(), "js");
				log.info("Processed plugin '"+files[index].getName()+"'.");
			}
		}
		
		dir = System.getProperty("user.dir").concat(File.separator+"py");
		
		directory = new File(dir);
		files = directory.listFiles(new FileFilter() {
			
			@Override
			public boolean accept(File pathname) {
				if(pathname.isFile()) return true;
				return false;
			}
		});

			
		// some 'init'ial setup that needs to be done FIRST
		doFile(dir+File.separator+"init.py", "py");

		for (int index = 0; index < files.length; index++) {
			if(!files[index].getName().equals("init.py")) {
				doFile(files[index].getPath(), "py");
				log.info("Processed plugin '"+files[index].getName()+"'.");
			}
		}
				
	}

	// Sends a message to all players!
	public void broadcast(String message) {
		for (Player p : etc.getServer().getPlayerList()) {
			p.sendMessage(message);
		}
	}
	
	public Server getJSContext () {
		return etc.getServer();
	}
	
	public void bubble (String type, String user, String text) {
		log.info("["+abbr+"] ["+type+"] "+text);		
	}

	public class Listener extends PluginListener {
		ScriptingApi p;
		
		public String join(String[] strings, String separator) {
		    StringBuffer sb = new StringBuffer();
		    for (int i=0; i < strings.length; i++) {
		        if (i != 0) sb.append(separator);
		  	    sb.append(strings[i]);
		  	}
		  	return sb.toString();
		}
		
		// This controls the accessibility of functions / variables from the main class.
		public Listener(ScriptingApi plugin) {
			p = plugin;
		}
		
		public Object[] trigger (String key, Object...args) {
			return MinecraftJSApi.trigger(key, args);
		}
				
		// remove the /* and */ from any function you want to use
		// make sure you add them to the listener above as well!
		
		public void onPlayerMove(Player player, Location from, Location to) {
			trigger("playerMove", new Object[] {getJSContext(), player, from, to});
		}

		public boolean onTeleport(Player player, Location from, Location to) {
			Object[] r = trigger("teleport", new Object[] {getJSContext(), player, from, to});
			
			for(Object o : r) {
				if(o != null && ((Boolean)o).booleanValue()) {
					return true;
				}
			}

			return false;
		}

		public String onLoginChecks(String user) {
			Object[] r = trigger("blockCreate", new Object[] {getJSContext(), user});
			
			for(Object o : r) {
				if(o != null) {
					return (String)o;
				}
			}

			return null;
		}

		public void onLogin(Player player) {
			trigger("login", new Object[] {getJSContext(), player});
		}

		public void onDisconnect(Player player) {
			trigger("disconnect", new Object[] {getJSContext(), player});
		}

		public boolean onChat(Player player, String message) {
			Object[] r = trigger("chat", new Object[] {getJSContext(), player, message});
			
			for(Object o : r) {
				if(o != null && ((Boolean)o).booleanValue()) {
					return true;
				}
			}
			// p.bubble("chat", Player, message);
			return false;
		}

		public boolean onCommand(Player player, String[] split) {
			if(split[0].equals("/reloadjs")) {
				boolean isgroup = false;
				for(String g : player.getGroups()) {
					if( g.equals(minGroup) ) {
						isgroup = true;
					}
				}
				
				if(isgroup) {
					loadAll();
					player.sendMessage("JS plugins reloaded.");
					return true;
				}
			}
			Object[] r = trigger("command", new Object[] {getJSContext(), player, split});
			
			for(Object o : r) {
				if(o != null && ((Boolean)o).booleanValue()) {
					return true;
				}
			}
			// p.bubble("command", player.getName(), join(split, " "));
			return false;
		}

		public boolean onConsoleCommand(String[] split) {
			if(split[0].equals("reloadscripts")) {
				loadAll();
				log.info("Scripted plugins reloaded.");
				return true;
			}
			Object[] r = trigger("consoleCommand", new Object[] {getJSContext(), split});
			
			for(Object o : r) {
				if(o != null && ((Boolean)o).booleanValue()) {
					return true;
				}
			}
			//p.bubble("consoleCommand", "console", join(split, " "));
			return false;
		}

		public void onBan(Player mod, Player player, String reason) {
			trigger("ban", new Object[] {getJSContext(), mod, player, reason});
		}

		public void onIpBan(Player mod, Player player, String reason) {
			trigger("ipBan", new Object[] {getJSContext(), mod, player, reason});
		}

		public void onKick(Player mod, Player player, String reason) {
			trigger("kick", new Object[] {getJSContext(), mod, player, reason});
		}

		public boolean onBlockCreate(Player player, Block blockPlaced, Block blockClicked, int itemInHand) {
			Object[] r = trigger("blockCreate", new Object[] {getJSContext(), player, blockPlaced, blockClicked, itemInHand});
			
			for(Object o : r) {
				if(o != null && ((Boolean)o).booleanValue()) {
					return true;
				}
			}
			
			return false;
		}

		public boolean onBlockDestroy(Player player, Block block) {
			Object[] r = trigger("blockDestroy", new Object[] {getJSContext(), player, block});
			
			for(Object o : r) {
				if(o != null && ((Boolean)o).booleanValue()) {
					return true;
				}
			}

			return false;
		}

		public void onArmSwing(Player player) {
			trigger("armSwing", new Object[] {getJSContext(), player});
		}

		public boolean onInventoryChange(Player player) {
			Object[] r = trigger("inventoryChange", new Object[] {getJSContext(), player});
			
			for(Object o : r) {
				if(o != null && ((Boolean)o).booleanValue()) {
					return true;
				}
			}

			return false;
		}

		public boolean onComplexBlockChange(Player player, ComplexBlock block) {
			Object[] r = trigger("complexBlockChange", new Object[] {getJSContext(), player, block});
			
			for(Object o : r) {
				if(o != null && ((Boolean)o).booleanValue()) {
					return true;
				}
			}

			return false;
		}

		public boolean onSendComplexBlock(Player player, ComplexBlock block) {
			Object[] r = trigger("sendComplexBlock", new Object[] {getJSContext(), player, block});
			
			for(Object o : r) {
				if(o != null && ((Boolean)o).booleanValue()) {
					return true;
				}
			}

			return false;
		}

		public boolean onCraftInventoryChange(Player player ) {
			Object[] r = trigger("craftInventoryChange", new Object[] {getJSContext(), player});
			
			for(Object o : r) {
				if(o != null && ((Boolean)o).booleanValue()) {
					return true;
				}
			}

			return false;
		}

		public boolean onEquipmentChange(Player player ) {
			Object[] r = trigger("equipmentChange", new Object[] {getJSContext(), player});
			
			for(Object o : r) {
				if(o != null && ((Boolean)o).booleanValue()) {
					return true;
				}
			}

			return false;
		}
		
		
	}
}