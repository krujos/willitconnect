package willitconnect.service;

import com.sun.deploy.util.StringUtils;
import willitconnect.model.TracedEntry;

public class Tracer {

    public TracedEntry trace(TracedEntry entry, ProcessExecutor executor) {
        String[] command = new String[]{"traceroute", entry.getEntry()};
        return entry.setTrace(StringUtils.join(executor.execute(command), "\n"));
    }
}
