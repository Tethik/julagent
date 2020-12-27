# Julagent

This was a small game I made for my nieces and nephews to play over the Christmas holiday 2020. The game involved running around capturing and holding "zones" via scanning QR codes, which I had placed in various places around our properties.

The app itself is a progressive web app (PWA) and can be "added to homescreen". It uses NextJS for both frontend and backend, with a postgres database to store data in. Deployment was done on a simple AWS EC2 instance, with RDS for the database and a nice ssh script to deploy it with.

There's a lot of kludgy code in it, but it wasn't important thing since the game only ran for about a week.
