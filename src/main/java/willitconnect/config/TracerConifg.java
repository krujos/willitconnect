package willitconnect.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import willitconnect.service.Tracer;

@Configuration
public class TracerConifg {

    @Bean
    Tracer tracer() {
        return new Tracer();
    }
}
