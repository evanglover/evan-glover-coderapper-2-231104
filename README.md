# Evan Glover Coderapper Challenge Part 2

This is a REST API that stores track data and also communicates with the Spotify external API to get track data by ISRC.

The project uses the following technologies:
1. Typescript
2. Node
3. Express
4. TypeORM
5. dotenv
6. PostgresSQL (Docker Container)

See API endpoint docs here: https://app.swaggerhub.com/apis-docs/evanglover/coderapper-p2/1.0.0

## How to keep API endpoint secure
1. Use different roles for endpoint access/permissions. With assigned roles, different groups of users will only have access to use the endpoints that they are authorized to access. Additionally, authorization will use a standard such as OAuth 2.0.
2. Use a firewall or API gateway to check for a valid identity of the user as well as an API rate limit to protect against overuse.
3. Encrypt requests and responses by using and requiring HTTPS protocol.
4. Regularly assess and test the API for security flaws and vulnerabilities.
5. Only deliver what the user requires. This is easier to manage using GraphQL, but doing this will reduce vulnerabilities and reduce packet size.
6. Register the API with an API Registry. This will ensure that the API is not forgotten, which may lead to a security breach over time.
7. Keep API keys out of files or code. Keeping API keys in these locations puts them at risk of being exposed. Additionally, regenerate keys and delete old ones after a long period of time or god forbid after a suspected breach.
8. Use threat detection services. There are services that provide powerful insight into API and software security, it would be wise to use one.
9. Continued education: always stay on top of the newest secure API trends in order to be aware of when a change needs to be made.