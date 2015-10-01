package willitconnect.model;

import org.junit.Test;

import java.sql.Date;
import java.time.Instant;

public class CheckedEntryTest {

    @Test(expected = NullPointerException.class)
    public void cannotHaveANullEntry() {
        new CheckedEntry(Date.from(Instant.EPOCH), null, false);
    }
}