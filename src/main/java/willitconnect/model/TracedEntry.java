package willitconnect.model;

public class TracedEntry {
    private final String entry;
    private String trace;

    public TracedEntry(String entry) {
        this.entry = entry;
    }

    public String getEntry() {
        return entry;
    }

    public String getTrace() {
        return trace;
    }

    public TracedEntry setTrace(String trace) {
        this.trace = trace;
        return this;
    }
}
