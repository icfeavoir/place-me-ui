# start in dev

nodemon index.js

# db

Utilisation de `sequelize`

Init DB:
`CREATE USER 'place_me'@'localhost' IDENTIFIED BY 'place_me';`
`GRANT ALL PRIVILEGES ON place_me.* TO 'place_me'@'localhost';`

Create tables:
cd server
npx sequelize db:migrate

Créer un model => la DB se met à jour automatiquement selon config/index.js
(penser à include le model dans le fichier seeder.service)

Run seeder
Restart with env var create db and seed db to true
