package willitconnect.controller.service.util;

/**
 * Matches the word host in a string, attended to be used against the keys in
 * VCAP_SERVICES
 */
public class HostMatcher {

    public static boolean isHost(String toBeChecked) {
        return toBeChecked.toLowerCase().contains("host");
    }

    //TODO This should go somewhere else.
    public static boolean hasPort(String host) {
        if (!host.contains(":")) return false;

        String port = host.substring(host.indexOf(":") + 1);
        try {
            Integer.parseInt(port);
            return true;
        } catch(Exception e) {}

        return false;
    }
}
