package willitconnect.controller.service;

import org.apache.log4j.Logger;
import org.json.JSONObject;
import willitconnect.controller.model.CheckedEntry;
import willitconnect.controller.service.util.EntryConsumer;

import java.util.ArrayList;
import java.util.List;

/**
 * Checks VCAP_SERVICES for keys named host and values that look like URI's
 */
public class VcapServicesChecker {
    private Logger log = Logger.getLogger(VcapServicesChecker.class);
    public List<CheckedEntry> check(JSONObject vcapServices) {
        java.util.Objects.requireNonNull(vcapServices);

        log.info(vcapServices);
        if ( 0 == vcapServices.length())
            throw new IllegalArgumentException("VCAP_SERVICES has no entries");

        ArrayList<CheckedEntry> entries = new ArrayList<CheckedEntry>();

        vcapServices.keys().forEachRemaining(new EntryConsumer(entries, vcapServices));
        return entries;
    }
}
