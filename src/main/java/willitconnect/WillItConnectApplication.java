package willitconnect;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class WillItConnectApplication {
    private static final Logger log = LoggerFactory.getLogger(WillItConnectApplication.class);

    public static void main(String[] args) {
        SpringApplication.run(WillItConnectApplication.class, args);
    }
}
