package willitconnect.controller.service.util;

import org.apache.log4j.Logger;
import org.json.JSONObject;
import willitconnect.controller.model.CheckedEntry;

import java.sql.Date;
import java.time.Instant;
import java.util.List;
import java.util.function.Consumer;

import static willitconnect.controller.service.HostMatcher.isHost;


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
        log.info("Cheking " + key);
        if (!isHost(key)) {
            //Check over any sub json objects.
            JSONObject possibleObject = vcapServices.optJSONObject(key);
            if ( null != possibleObject ) {
                possibleObject.keys().forEachRemaining(
                        new EntryConsumer(entries, possibleObject));
            }
        };

        CheckedEntry entry = new CheckedEntry(Date.from(Instant.now()),
                vcapServices.optString(key), false);

        entries.add(entry);
    }
}
