package willitconnect.service;

import java.util.List;

public interface ProcessExecutor {
    public List<String> execute(final String[] command);
}
