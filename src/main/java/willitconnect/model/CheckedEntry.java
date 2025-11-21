package willitconnect.model;

import org.springframework.http.HttpStatusCode;

import java.net.URL;
import java.time.Instant;
import java.util.Date;
import java.util.Objects;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Holds a hostname or url that is checked to see if we can connect to it.
 */
public class CheckedEntry {
    public static long DEFAULT_RESPONSE_TIME = -1L;
    private static final Pattern HOST_WITH_OPTIONAL_PORT =
            Pattern.compile("^([\\w\\.-]+)(?::(\\d+))?$");
    private Date lastChecked;
    private String entry;
    private String hostname;
    private Integer explicitPort;
    private boolean canConnect;
    private int httpStatus;
    private String httpProxy;
    private long responseTime = DEFAULT_RESPONSE_TIME;

    public boolean isCanConnect() {
        return canConnect();
    }

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
        // Strings are immutable, so parsing cannot mutate the stored value.
        parseEntry(this.entry);
    }

    public boolean canConnect() {
        return canConnect;
    }

    public void setCanConnect(boolean canConnect) {
        this.canConnect = canConnect;
    }

    public CheckedEntry(String entry) {
        Objects.requireNonNull(entry);
        this.lastChecked = Date.from(Instant.EPOCH);
        this.entry = entry;
        parseEntry(entry);
        this.canConnect = false;
    }

    public boolean isValidHostname() {
        return hostname != null;
    }

    public boolean isValidUrl() {
        try {
            new URL(entry);
            return true;
        } catch (Exception e) {}
        return false;
    }

    /**
     * give back the status as an int to avoid forcing consumers to understand
     * how java marshals status codes to something other than an int.
     * @return the status
     */
    public int getHttpStatus() {
        return httpStatus;
    }

    /**
     * Set the status of the request
     * @param statusCode in an HttpStatusCode to save ourselves validation headache
     */
    public void setHttpStatus(HttpStatusCode statusCode) {
        httpStatus = statusCode.value();
    }

    public void setHttpProxy(String proxy) {
        this.httpProxy = proxy;
    }

    public String getHttpProxy() {
        return httpProxy;
    }


    public long getResponseTime() {
        return responseTime;
    }

    public void setResponseTime(long responseTime) {
        this.responseTime = responseTime;
    }

    private void parseEntry(String entry) {
        Matcher matcher = HOST_WITH_OPTIONAL_PORT.matcher(entry);
        if (matcher.matches()) {
            hostname = matcher.group(1);
            String portGroup = matcher.group(2);
            if (portGroup == null) {
                explicitPort = null;
            } else {
                explicitPort = Integer.parseInt(portGroup);
            }
        } else {
            hostname = null;
            explicitPort = null;
        }
    }

    public String getHostname() {
        return hostname;
    }

    public boolean hasExplicitPort() {
        return explicitPort != null;
    }

    public int getResolvedPort() {
        if (hasExplicitPort()) {
            return explicitPort;
        }
        return 80;
    }
}
