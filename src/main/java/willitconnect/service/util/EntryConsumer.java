package willitconnect.service.util;

import org.apache.log4j.Logger;
import org.json.JSONArray;
import org.json.JSONObject;
import willitconnect.model.CheckedEntry;

import java.net.MalformedURLException;
import java.net.URL;
import java.util.List;
import java.util.function.Consumer;
import java.util.stream.IntStream;

import static org.springframework.core.io.support.ResourcePatternUtils.isUrl;
import static willitconnect.service.util.HostMatcher.hasPort;
import static willitconnect.service.util.HostMatcher.isHost;

public class EntryConsumer implements Consumer<String> {
    private Logger log = Logger.getLogger(EntryConsumer.class);
    private final JSONObject vcapServices;
    private final List<CheckedEntry> entries;

    public EntryConsumer(List<CheckedEntry> entries, JSONObject vcapServices) {
        this.entries = entries;
        this.vcapServices = vcapServices;
    }

    @Override
    public void accept(String key) {
        if (isHost(key)) {
            String host = vcapServices.optString(key);
            if (hasPort(host))
                addNewEntry(host);
            else
                addNewEntry(host + ":" + getPort());
        } else {
            if (isUrl(vcapServices.optString(key))) {
                try {
                    URL url = new URL(vcapServices.getString(key));
                    addNewEntry(url.getHost() + ":" + url.getPort());
                } catch (MalformedURLException e) {
                    log.error("Mailformed URL -- How did we get here?");
                }
            };
            //Check over any sub json objects.
            if (handleJSONObject(key)) return;
            if (handleJSONArray(key)) return;
        }
    }

    private int getPort() {
        int port = -1;
        if ( vcapServices.has("port") ) {
            String sPort = vcapServices.optString("port");
            if ( null != sPort ) {
                port = Integer.parseInt(sPort);
            } else {
                vcapServices.optInt("port", -1);
            }
        }
        return port;
    }

    private boolean handleJSONArray(String key) {
        JSONArray array = vcapServices.optJSONArray(key);
        if (null == array) return false;

        IntStream.range(0, array.length())
                .filter(i -> array.optJSONObject(i) != null)
                .forEach(i -> array.getJSONObject(i).keys().forEachRemaining(
                        new EntryConsumer(entries, array.getJSONObject(i))));
        return true;
    }

    private boolean handleJSONObject(String key) {
        JSONObject possibleObject = vcapServices.optJSONObject(key);
        if ( null != possibleObject ) {
            possibleObject.keys().forEachRemaining(
                    new EntryConsumer(entries, possibleObject));
            return true;
        }
        return false;
    }

    private void addNewEntry(String host) {
        CheckedEntry entry;
        log.info("Entry To Add == " + host);
        entry = new CheckedEntry(host);
        entries.add(entry);
    }
}
