package com.brian.website.config;

import org.springframework.beans.BeansException;
import org.springframework.beans.factory.config.BeanFactoryPostProcessor;
import org.springframework.beans.factory.config.ConfigurableListableBeanFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;

/**
 * Runs before Hibernate schema update: drops cv_documents if it was created
 * with the wrong @Lob mapping (oid instead of bytea). Hibernate ddl-auto=update
 * will then recreate it correctly.
 */
@Configuration
public class CvTableMigration {

    @Bean
    static BeanFactoryPostProcessor cvTableFixer(Environment env) {
        return new BeanFactoryPostProcessor() {
            @Override
            public void postProcessBeanFactory(ConfigurableListableBeanFactory beanFactory) throws BeansException {
                String url = env.getProperty("spring.datasource.url");
                String user = env.getProperty("spring.datasource.username");
                String pass = env.getProperty("spring.datasource.password", "");
                if (url == null) return;

                try (Connection conn = DriverManager.getConnection(url, user, pass);
                     Statement stmt = conn.createStatement()) {
                    ResultSet rs = stmt.executeQuery(
                        "SELECT data_type FROM information_schema.columns " +
                        "WHERE table_name = 'cv_documents' AND column_name = 'data'"
                    );
                    if (rs.next() && !"bytea".equals(rs.getString(1))) {
                        stmt.execute("DROP TABLE cv_documents");
                    }
                } catch (Exception e) {
                    // Table doesn't exist or DB not reachable — Hibernate will handle it
                }
            }
        };
    }
}
