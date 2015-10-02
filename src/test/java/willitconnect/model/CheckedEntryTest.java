package willitconnect.model;

import org.junit.Test;

public class CheckedEntryTest {

    @Test(expected = NullPointerException.class)
    public void cannotHaveANullEntry() {
        new CheckedEntry(null);
    }
}