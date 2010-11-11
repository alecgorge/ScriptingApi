import java.sql.Connection;
import java.util.ArrayList;
import java.util.Hashtable;
import java.util.logging.Logger;

import javax.script.ScriptException;

import net.minecraft.server.MinecraftServer;

public class MinecraftJSApi {
	public static Hashtable<String, ArrayList<Object>> bindings = new Hashtable<String, ArrayList<Object>>();
	
	public static String getPluginName () {
		return JSApi.pluginName;
	}
	
	public static String getPluginVersion () {
		return JSApi.pluginVersion;
	}
	
	public static Logger getLog () {
		return JSApi.log;
	}
	
	public static etc getEtc () {
		return etc.getInstance();
	}
	
	public static Connection getSQLConnection() {
		return etc.getSQLConnection();
	}
	
	public static Server getServer() {
		return etc.getServer();
	}
	
	public static PluginLoader getLoader() {
		return etc.getLoader();
	}
	
	public static MinecraftServer getMCServer() {
		return etc.getMCServer();
	}
	
	public static HitBlox createHitBlox(Object p) {
		return new HitBlox((Player) p);
	}
	
	public static Item createItem(int a, int b, int c) {
		return new Item(a,b,c);
	}
	
	public static Item createItem(int a, int b) {
		return new Item(a,b);
	}
	
	public static Item createItem() {
		return new Item();
	}
	
	public static Location createLocation(double a, double b, double c, float x, float y) {
		return new Location(a,b,c,x,y);
	}
	
	public static Location createLocation(double a, double b, double c) {
		return new Location(a,b,c);
	}
	
	public static Location createLocation() {
		return new Location();
	}
	
	public static void broadcast(String message, String group, boolean reverse) {
		for (Player p : etc.getServer().getPlayerList()) {
			if(group.equals("") || (!reverse && p.isInGroup(group))) {
				p.sendMessage(message);
			}
		}		
	}
	
	public static void bind (String key, Object o) {
		if(!bindings.containsKey(key)) {
			bindings.put(key, new ArrayList<Object>());
		}
		//System.out.println(o);
		
		bindings.get(key).add(o);
		// trigger(key, new Object[] {}, "alecgorge", System.currentTimeMillis()/1000);
	}
	
	public static Object[] trigger (String key, Object...args) {
		ArrayList<Object> results = new ArrayList<Object>();
		if(bindings.containsKey(key)) {
			for(Object o : bindings.get(key)) {
				if(o.getClass().toString().endsWith("InterpretedFunction")) {
					try {
						// System.out.println(o.getClass().toString());
						results.add(JSApi.js_func.invokeMethod(o, "call", args));
					} catch (ScriptException e) {
						e.printStackTrace();
					} catch (NoSuchMethodException e) {
						e.printStackTrace();
					}
				}
				//System.out.println(o);
				/*if(type.endsWith("InterpretedFunction")) {
					((InternalFunction) o).call();
				}*/
			}
		}
		return results.toArray();
	}
}
