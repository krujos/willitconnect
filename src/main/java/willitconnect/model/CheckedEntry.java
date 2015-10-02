package willitconnect.model;

import java.util.Date;
import java.util.Objects;

/**
 * Holds a hostname or url that is checked to see if we can connect to it.
 */
public class CheckedEntry {
    private Date lastChecked;
    private String entry;
    boolean canConnect;

    public Date getLastChecked() {
        return lastChecked;
    }

    public void setLastChecked(Date lastChecked) {
        this.lastChecked = lastChecked;
    }

    public String getEntry() {
        return entry;
    }

    public void setEntry(String entry) {
        this.entry = entry;
    }

    public boolean isCanConnect() {
        return canConnect;
    }

    public void setCanConnect(boolean canConnect) {
        this.canConnect = canConnect;
    }

    public CheckedEntry(Date lastChecked, String entry, boolean canConnect) {
        Objects.requireNonNull(entry);
        this.lastChecked = lastChecked;
        this.entry = entry;
        this.canConnect = canConnect;
    }

    public boolean isValidHostname() {
        return entry.matches("[\\w\\.]+:\\d+");
    }
}
