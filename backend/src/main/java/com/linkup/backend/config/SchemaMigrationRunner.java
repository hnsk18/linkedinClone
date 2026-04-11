package com.linkup.backend.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class SchemaMigrationRunner implements CommandLineRunner {

    private final JdbcTemplate jdbcTemplate;

    public SchemaMigrationRunner(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void run(String... args) {
        jdbcTemplate.execute("ALTER TABLE `users` MODIFY COLUMN `profile_picture` LONGTEXT NULL");
        jdbcTemplate.execute("ALTER TABLE `users` MODIFY COLUMN `cover_picture` LONGTEXT NULL");
    }
}
