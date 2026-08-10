# Rules for Vinnavar Fullstack

<RULE>
## Database Safety and Data Preservation
When working on the backend database (Spring Boot / JPA / PostgreSQL):
1. **NEVER** use `spring.jpa.hibernate.ddl-auto=create` or `create-drop` in production or default profiles, as this will wipe all existing data.
2. Always use `ddl-auto=update` or `validate`.
3. When adding or modifying columns programmatically or running SQL scripts, **never** drop existing tables or columns unless explicitly instructed by the user after confirming they have backups.
4. Data loss is unacceptable since people are entering data continuously.
</RULE>
