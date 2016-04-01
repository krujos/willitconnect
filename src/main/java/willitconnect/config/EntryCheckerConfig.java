package willitconnect.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;
import willitconnect.service.EntryChecker;

@Configuration
public class EntryCheckerConfig {

    @Bean
    public EntryChecker entryChecker() {
        return new EntryChecker(new RestTemplate());
    }
}
