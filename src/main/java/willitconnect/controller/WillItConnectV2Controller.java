package willitconnect.controller;

import org.apache.log4j.Logger;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import willitconnect.model.CheckedEntry;
import willitconnect.service.EntryChecker;

import static org.apache.log4j.Logger.getLogger;

/**
 * The goal is to have an intuitive api that just does the right thing.
 *
 * To that end, every request must supply a payload in the format of
 *
 * {
 *     "target": "something"
 * }
 *
 * Something is looseley interperated to be a URI
 *
 * If it lacks a port we default to 80
 *   i.e. amazon.com ends up making a socket connection to amazon.com:80
 *
 * If it lacks a scheme we make a socket connection
 *   i.e. amazon.com:443 ends up making a socket connection to amazon.com:443
 *
 * If it has a scheme and it's http or https we try to make a get request
 *   i.e. https://amazon.com ends up making an https connection to amazon
 *   and returns the http status code. It completes the ssl handshake.
 *
 * It it has a scheme and it's not http it makes a socket connection
 *   i.e. mysql://10.0.0.10:5407 ends up making a socket connection to
 *   10.0.0.10:5407
 *
 */
@RestController()
@RequestMapping(value="/v2")
public class WillItConnectV2Controller {

    private EntryChecker entryChecker;

    @Autowired
    public WillItConnectV2Controller(EntryChecker entryChecker) {
        this.entryChecker = entryChecker;
    }

    private Logger log = getLogger(WillItConnectV2Controller.class);
    @RequestMapping(value="willitconnect")
    public @ResponseBody CheckedEntry willItConnect(
            @RequestBody String request) {

        log.info(request.toString());
        JSONObject r = new JSONObject(request);
        CheckedEntry entry = new CheckedEntry(r.getString("target"));
        return entryChecker.check(entry, null, 0, null);
    }
}
