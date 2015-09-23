package willitconnect.controller.service;

import org.apache.log4j.Logger;
import org.json.JSONObject;
import willitconnect.controller.model.CheckedEntry;
import willitconnect.controller.service.util.EntryConsumer;

import java.util.ArrayList;

/**
 * Checks VCAP_SERVICES for keys named host and values that look like URI's
 */
public class VcapServicesChecker {

    public static volatile ArrayList<CheckedEntry> results;

    private static Logger log = Logger.getLogger(VcapServicesChecker.class);

    public static void check(JSONObject vcapServices) {
        java.util.Objects.requireNonNull(vcapServices);

        log.info(vcapServices);
        if ( 0 == vcapServices.length())
            return;

        ArrayList<CheckedEntry> entries = new ArrayList<CheckedEntry>();

        vcapServices.keys().forEachRemaining(new EntryConsumer(entries, vcapServices));
        results = entries;
    }
}
