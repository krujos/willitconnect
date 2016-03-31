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

@RestController()
@RequestMapping(value="/v2")
public class WillItConnectV2Controller {

    EntryChecker entryChecker;

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
        return entryChecker.check(entry);
    }
}
