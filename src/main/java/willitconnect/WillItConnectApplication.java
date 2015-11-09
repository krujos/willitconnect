package willitconnect;

import org.apache.log4j.Logger;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class WillItConnectApplication {
    private Logger log = Logger.getLogger(WillItConnectApplication.class);

    public static void main(String[] args) {
        SpringApplication.run(WillItConnectApplication.class, args);
    }
}
