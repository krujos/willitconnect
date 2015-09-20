package willitconnect.controller.service;

import org.apache.log4j.Logger;
import org.json.JSONObject;
import willitconnect.controller.model.CheckedEntry;
import willitconnect.controller.service.util.EntryConsumer;

import java.sql.Date;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.function.Consumer;

import static willitconnect.controller.service.HostMatcher.isHost;

/**
 * Checks VCAP_SERVICES for keys named host and values that look like URI's
 */
public class VcapServicesChecker {

    public List<CheckedEntry> check(JSONObject vcapServices) {
        java.util.Objects.requireNonNull(vcapServices);
        if ( 0 == vcapServices.length())
            throw new IllegalArgumentException("VCAP_SERVICES has no entries");

        ArrayList<CheckedEntry> entries = new ArrayList<CheckedEntry>();

        vcapServices.keys().forEachRemaining(new EntryConsumer(entries, vcapServices));
        return entries;
    }
}
