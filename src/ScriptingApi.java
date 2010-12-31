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
	private String version = "rev 9";
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
			if(engines.get("py") != null)
				engines.get("py").put("Minecraft", new MinecraftJSApi());
		}
		
		//if()
		
		loadAll();
		
		log.info(name + " initialized ("+version+")");
		// Uncomment as needed.
		etc.getLoader().addListener( PluginLoader.Hook.ARM_SWING, l, this, PluginListener.Priority.MEDIUM);
		etc.getLoader().addListener( PluginLoader.Hook.ATTACK, l, this, PluginListener.Priority.MEDIUM);
		etc.getLoader().addListener( PluginLoader.Hook.BAN, l, this, PluginListener.Priority.MEDIUM);
		etc.getLoader().addListener( PluginLoader.Hook.BLOCK_BROKEN, l, this, PluginListener.Priority.MEDIUM);
		etc.getLoader().addListener( PluginLoader.Hook.BLOCK_CREATED, l, this, PluginListener.Priority.MEDIUM);
		etc.getLoader().addListener( PluginLoader.Hook.BLOCK_DESTROYED, l, this, PluginListener.Priority.MEDIUM);
		etc.getLoader().addListener( PluginLoader.Hook.BLOCK_PHYSICS, l, this, PluginListener.Priority.MEDIUM);
		etc.getLoader().addListener( PluginLoader.Hook.BLOCK_PLACE, l, this, PluginListener.Priority.MEDIUM);
		etc.getLoader().addListener( PluginLoader.Hook.BLOCK_RIGHTCLICKED, l, this, PluginListener.Priority.MEDIUM);
		etc.getLoader().addListener( PluginLoader.Hook.CHAT, l, this, PluginListener.Priority.MEDIUM);
		etc.getLoader().addListener( PluginLoader.Hook.COMMAND, l, this, PluginListener.Priority.MEDIUM);
		etc.getLoader().addListener( PluginLoader.Hook.DAMAGE, l, this, PluginListener.Priority.MEDIUM);
		etc.getLoader().addListener( PluginLoader.Hook.DISCONNECT, l, this, PluginListener.Priority.MEDIUM);
		etc.getLoader().addListener( PluginLoader.Hook.EXPLODE, l, this, PluginListener.Priority.MEDIUM);
		etc.getLoader().addListener( PluginLoader.Hook.FLOW, l, this, PluginListener.Priority.MEDIUM);
		etc.getLoader().addListener( PluginLoader.Hook.HEALTH_CHANGE, l, this, PluginListener.Priority.MEDIUM);
		etc.getLoader().addListener( PluginLoader.Hook.IGNITE, l, this, PluginListener.Priority.MEDIUM);
		etc.getLoader().addListener( PluginLoader.Hook.IPBAN, l, this, PluginListener.Priority.MEDIUM);
		etc.getLoader().addListener( PluginLoader.Hook.ITEM_DROP, l, this, PluginListener.Priority.MEDIUM);
		etc.getLoader().addListener( PluginLoader.Hook.ITEM_PICK_UP, l, this, PluginListener.Priority.MEDIUM);
		etc.getLoader().addListener( PluginLoader.Hook.ITEM_USE, l, this, PluginListener.Priority.MEDIUM);
		etc.getLoader().addListener( PluginLoader.Hook.KICK, l, this, PluginListener.Priority.MEDIUM);
		etc.getLoader().addListener( PluginLoader.Hook.LIQUID_DESTROY, l, this, PluginListener.Priority.MEDIUM);
		etc.getLoader().addListener( PluginLoader.Hook.LOGIN, l, this, PluginListener.Priority.MEDIUM);
		etc.getLoader().addListener( PluginLoader.Hook.LOGINCHECK, l, this, PluginListener.Priority.MEDIUM);
		etc.getLoader().addListener( PluginLoader.Hook.OPEN_INVENTORY, l, this, PluginListener.Priority.MEDIUM);
		etc.getLoader().addListener( PluginLoader.Hook.MOB_SPAWN, l, this, PluginListener.Priority.MEDIUM);
		etc.getLoader().addListener( PluginLoader.Hook.PLAYER_MOVE, l, this, PluginListener.Priority.MEDIUM);
		etc.getLoader().addListener( PluginLoader.Hook.REDSTONE_CHANGE, l, this, PluginListener.Priority.MEDIUM);
		etc.getLoader().addListener( PluginLoader.Hook.SERVERCOMMAND, l, this, PluginListener.Priority.MEDIUM);
		etc.getLoader().addListener( PluginLoader.Hook.SIGN_CHANGE, l, this, PluginListener.Priority.MEDIUM);
		etc.getLoader().addListener( PluginLoader.Hook.SIGN_SHOW, l, this, PluginListener.Priority.MEDIUM);		
		etc.getLoader().addListener( PluginLoader.Hook.TELEPORT, l, this, PluginListener.Priority.MEDIUM);
		etc.getLoader().addListener( PluginLoader.Hook.VEHICLE_COLLISION, l, this, PluginListener.Priority.MEDIUM);
		etc.getLoader().addListener( PluginLoader.Hook.VEHICLE_CREATE, l, this, PluginListener.Priority.MEDIUM);
		etc.getLoader().addListener( PluginLoader.Hook.VEHICLE_DAMAGE, l, this, PluginListener.Priority.MEDIUM);
		etc.getLoader().addListener( PluginLoader.Hook.VEHICLE_DESTROYED, l, this, PluginListener.Priority.MEDIUM);
		etc.getLoader().addListener( PluginLoader.Hook.VEHICLE_ENTERED, l, this, PluginListener.Priority.MEDIUM);
		etc.getLoader().addListener( PluginLoader.Hook.VEHICLE_POSITIONCHANGE, l, this, PluginListener.Priority.MEDIUM);
		etc.getLoader().addListener( PluginLoader.Hook.VEHICLE_UPDATE, l, this, PluginListener.Priority.MEDIUM);
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
		String group = pf.getString("min-group-level", "admins");
		pf.save();
		
		if(group != null && !group.equals("")) {
			minGroup = group;
		}
			
		// some 'init'ial setup that needs to be done FIRST
		doFile(dir+File.separator+"init.js", "js");

		for (int index = 0; index < files.length; index++) {
			if(!files[index].getName().equals("init.js")) {
				if(files[index].getName().endsWith("js")) {
					doFile(files[index].getPath(), "js");
					log.info("Processed plugin '"+files[index].getName()+"'.");
				}
			}
		}
		
		if(engines.get("py") != null) {
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
					if(files[index].getName().endsWith("py")) {
						doFile(files[index].getPath(), "py");
						log.info("Processed plugin '"+files[index].getName()+"'.");
					}
				}
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
		
		public void onPlayerMove(Player player, Location from, Location to) {
			trigger("playerMove", new Object[] {getJSContext(), player, from, to});
		}
		
		public void onSignShow(Player player, Sign sign) {
			trigger("signShow", new Object[] {getJSContext(), player, sign});
		}
		
		public boolean onSignChange (Player player, Sign sign) {
			Object[] r = trigger("signChange", new Object[] {getJSContext(), player, sign});
			
			for(Object o : r) {
				if(o != null && ((Boolean)o).booleanValue()) {
					return true;
				}
			}

			return false;
			
		}
		
		public boolean onOpenInventory (Player player, Inventory inventory) {
			Object[] r = trigger("openInventory", new Object[] {getJSContext(), player, inventory});
			
			for(Object o : r) {
				if(o != null && ((Boolean)o).booleanValue()) {
					return true;
				}
			}

			return false;
			
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
			return false;
		}

		public boolean onCommand(Player player, String[] split) {
			if(split[0].equals( "/reloadscripts")) {
				boolean isgroup = false;
				for(String g : player.getGroups()) {
					if( g.equals(minGroup) ) {
						isgroup = true;
					}
				}
				
				if(isgroup) {
					loadAll();
					player.sendMessage("Scripted plugins reloaded.");
					return true;
				}
			}
			Object[] r = trigger("command", new Object[] {getJSContext(), player, split});
			
			for(Object o : r) {
				if(o != null && ((Boolean)o).booleanValue()) {
					return true;
				}
			}
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
		
		
		public boolean onConsoleCommand(LivingEntity attacker, LivingEntity defender, java.lang.Integer amount) {
			Object[] r = trigger("attack", new Object[] {getJSContext(), attacker, defender, amount});
			
			for(Object o : r)
				if(o != null && ((Boolean)o).booleanValue())
					return true;
			return false;
		}

		public boolean onBlockBreak(Player player, Block block) {
			Object[] r = trigger("blockBreak", new Object[] {getJSContext(), player, block});
			
			for(Object o : r)
				if(o != null && ((Boolean)o).booleanValue())
					return true;
			return false;
		}

		public boolean onBlockPlace(Player player, Block blockPlaced, Block blockClicked, Item itemInHand) {
			Object[] r = trigger("blockPlace", new Object[] {getJSContext(), player, blockPlaced, blockClicked, itemInHand});
			
			for(Object o : r)
				if(o != null && ((Boolean)o).booleanValue())
					return true;
			return false;
		}

		public boolean onBlockPhysics(Block block, boolean placed) {
			Object[] r = trigger("blockPhysics", new Object[] {getJSContext(), block, placed});
			
			for(Object o : r)
				if(o != null && ((Boolean)o).booleanValue())
					return true;
			return false;
		}

		public void onBlockRightClicked(Player player, Block blockClicked, Item item) {
			Object[] r = trigger("blockRightClicked", new Object[] {getJSContext(), player, blockClicked, item});
		}

		public boolean onDamage(PluginLoader.DamageType type, BaseEntity attacker, BaseEntity defender, int amount) {
			Object[] r = trigger("damage", new Object[] {getJSContext(), type, attacker, defender, amount});
			
			for(Object o : r)
				if(o != null && ((Boolean)o).booleanValue())
					return true;
			return false;
		}

		public boolean onExplode(Block block) {
			Object[] r = trigger("explode", new Object[] {getJSContext(), block});
			
			for(Object o : r)
				if(o != null && ((Boolean)o).booleanValue())
					return true;
			return false;
		}

		public boolean onFlow(Block blockFrom, Block blockTo) {
			Object[] r = trigger("flow", new Object[] {getJSContext(), blockFrom, blockTo});
			
			for(Object o : r)
				if(o != null && ((Boolean)o).booleanValue())
					return true;
			return false;
		}

		public boolean onHealthChange(Player player, int oldValue, int newValue) {
			Object[] r = trigger("healthChange", new Object[] {getJSContext(), player, oldValue, newValue});
			
			for(Object o : r)
				if(o != null && ((Boolean)o).booleanValue())
					return true;
			return false;
		}

		public boolean onIgnite(Block block, Player player) {
			Object[] r = trigger("ignite", new Object[] {getJSContext(), block, player});
			
			for(Object o : r)
				if(o != null && ((Boolean)o).booleanValue())
					return true;
			return false;
		}

		public boolean onItemDrop(Player player, Item item) {
			Object[] r = trigger("itemDrop", new Object[] {getJSContext(), player, item});
			
			for(Object o : r)
				if(o != null && ((Boolean)o).booleanValue())
					return true;
			return false;
		}

		public boolean onItemPickUp(Player player, Item item) {
			Object[] r = trigger("itemPickUp", new Object[] {getJSContext(), player, item});
			
			for(Object o : r)
				if(o != null && ((Boolean)o).booleanValue())
					return true;
			return false;
		}

		public boolean onItemUse(Player player, Block blockPlaced, Block blockClicked, Item item) {
			Object[] r = trigger("itemUse", new Object[] {getJSContext(), player, blockPlaced, blockClicked, item});
			
			for(Object o : r)
				if(o != null && ((Boolean)o).booleanValue())
					return true;
			return false;
		}

		public PluginLoader.HookResult onLiquidDestroy(PluginLoader.HookResult currentState, int liquidBlockId, Block targetBlock) {
			Object[] r = trigger("liquidDestroy", new Object[] {getJSContext(), currentState, liquidBlockId, targetBlock});
			
			for(Object o : r)
				if(o != null && ((Boolean)o).booleanValue())
					return PluginLoader.HookResult.PREVENT_ACTION;
			return PluginLoader.HookResult.DEFAULT_ACTION;
		}

		public boolean onMobSpawn(Mob mob) {
			Object[] r = trigger("mobSpawn", new Object[] {getJSContext(), mob});
			
			for(Object o : r)
				if(o != null && ((Boolean)o).booleanValue())
					return true;
			return false;
		}

		public int onRedstoneChange(Block block, int oldLevel, int newLevel)  {
			Object[] r = trigger("redstoneChange", new Object[] {getJSContext(), block, oldLevel, newLevel});
			
			for(Object o : r)
				if(o != null && ((Integer)o).intValue() != newLevel)
					return ((Integer)o).intValue();
			return newLevel;
		}

		public java.lang.Boolean onVehicleCollision(BaseVehicle vehicle, BaseEntity collisioner)  {
			Object[] r = trigger("vehicleCollision", new Object[] {getJSContext(), vehicle, collisioner});
			
			for(Object o : r)
				if(o != null && ((Boolean)o).booleanValue())
					return (Boolean)o;
			return false;
		}

		public boolean onVehicleDamage(BaseVehicle vehicle, BaseEntity attacker, int damage) {
			Object[] r = trigger("vehicleDamage", new Object[] {getJSContext(), vehicle, attacker, damage});
			
			for(Object o : r)
				if(o != null && ((Boolean)o).booleanValue())
					return true;
			return false;
		}

		public void onVehicleCreate(BaseVehicle vehicle) {
			trigger("vehicleCreate", new Object[] {getJSContext(), vehicle});
		}

		public void onVehicleDestroyed(BaseVehicle vehicle) {
			trigger("vehicleDestroyed", new Object[] {getJSContext(), vehicle});
		}

		public void onVehicleEnter(BaseVehicle vehicle) {
			trigger("vehicleEnter", new Object[] {getJSContext(), vehicle});
		}

		public void onVehiclePositionChange(BaseVehicle vehicle, int x, int y, int z) {
			trigger("vehiclePositionChange", new Object[] {getJSContext(), vehicle, x, y, z});
		}

		public void onVehicleUpdate(BaseVehicle vehicle) {
			trigger("vehicleUpdate", new Object[] {getJSContext(), vehicle});
		}		
	}
}
