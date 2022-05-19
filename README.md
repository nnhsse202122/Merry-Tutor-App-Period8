## Merry Tutor Web App 
A webapp for the student non-profit Merry Tutor. 

## Brief Overview
The Merry Tutor webapp allows for tutoring session summaries to be submitted, stored, and retrieved by different users of the app. Because there are multiple roles (Tutors, Tutees, Parents, and Board Members), different users, depending on their role, could have varying levels of access when using the app. Using predominantly Node.js for the backend and EJS for the frontend, the webapp first allows users to register and login and then interact with the session summary interface.

## Motivation
Project undertaken for NNHS Software Engineering Class 2020-21. We collaborated with founder Jane Boettcher to replace the less efficient system.

## Tech/framework used
Ex. -

<b>Built with</b>
- [Visual Studio Code](https://code.visualstudio.com/)

<b>Backend built using</b>
- [Express](https://expressjs.com/) & [Node.js](https://nodejs.org/en/)

<b>Data stored in</b>
- [MongoDB](https://www.mongodb.com/)

<b>Frontend built using</b>
- [ejs](https://ejs.co/)
- CSS + JavaScript

## Features
- Variable HTML output from database informaiton via EJS 
- Implements Google OAuth2.0 Login API

## Platform Requirements
The app itself is not specific to one operating system, and can be used cross-platform. Node.js v14.15.4+ is required, as well as
an editing software such as Virtual Studio Code.

## Installation
Visual Studio Code can be installed here: https://code.visualstudio.com/download
Node.js can be installed here: https://nodejs.org/en/download/

## Development Configuration and Running
1. Clone the project repository and open in VSCode
2. Open a terminal window and use "npm i" to install the packages
3. Once packages are installed, use "npm start" to run the application
4. Navigate to localhost:8080 to see the app running in a web browser
5. Use "CTRL + c" to stop the application run

## Installing Necessary Dependencies
In order to ensure that the new onboarding features work as intended, future programmers will likely have to install a few dependencies when they first launch their editor. Now, with the command "npm i," we can install the dependencies required to run an elementary version of the program. However, after completing the login/register process, there could be extra dependencies that we specifically need to install to ensure a functional program. To install any dependency, we must first type in

```
npm i (dependency)
```

The dependencies that likely need to be installed, if they don't show up within the file "package.json" include

- Passport
- Express
- EJS
- BCrypt
- Mongoose

This website has a number of other dependencies that CAN be installed but don't necessarily have to be installed.
[LogRocket Blog](https://blog.logrocket.com/using-passport-authentication-node-js/)

If the necessary dependencies are NOT installed, then the project may not run because the onboarding process (login/register) requires specific dependencies to be installed to function.

## Architectural Overview

### Client Side
Client-side code is the code that runs in the user's web client (e.g., Chrome browser). This includes HTML, CSS, and Javascript. The client-side Javascript and CSS files are in the public folder in this repository. The HTML is generated from the EJS files in the views folder. EJS is a "templating language that lets you generate HTML markup with plain JavaScript".

Most of the EJS files are associated with a single page in the web app (e.g., index, login, profile). A few of the EJS files are more general. The head.ejs file is included at the top of all other EJS files. Similarly, the footer.ejs file is included at the bottom of all other EJS files. This allows app-wide user interface elements to be defined in only one file. Similarly, the navbar.ejs file is included near the top of all other EJS files and encapsulates the navigation bar for the app. The client-server distinction can be a bit confusing when it comes to EJS files. The EJS files reside on the sever. The server processes the EJS files and sends the resulting HTML code to be executed on the client-side. So, while the EJS files reside on the serve, they define code that is executed on the client.

Some of the client-side Javascript files are associated with a dynamic page in the web app (e.g., login, managetutor, profile). Other Javascript files support a specific feature that may be used in multiple pages (e.g., autocomplete, card-filter).

Client-side code interacts with the web application server via various endpoints and HTTP commands. It is important to understand clearly which code runs on the client side nad which code runs on the server side. This is especially important when it comes to security as client-side is an untrusted environment (a malicious user can change the code in any manner they desire) and server-side is a trusted environment (only developers have access to the code running on the server).

### Server Side
Server-side code is the code that runs on the web server (e.g., Amazon Web Services elastic container or your local development machine). This code consists entirely of Javascript. The main file is app.js, which performs initialization and defines all the routes (endpoints) for the app. While an entire app can be defined in the app.js file, various responsibilities are decomposed into other files.

The db.js file encapsulates everything related to the database. It handles database access for production (local MongDB instance) and development (Atlas MongoDB server). It defines the schema for Users and Sessions. It also provides methods to access these models.

The other Javascript files are located in the routes folder and support one or more routes. While the specifics are unique to each route, in general, HTTP GET commands perform user authentication, then database access, and finally renders the corresponding EJS file. In general, HTTP POST commands perform user authentication, then database access, and finally return a result to indicate success or failure.

## Production Server Deployment

1. Create a new EC2 instance used on Ubuntu.
2. Open ports for HTTP and HTTPS when walking through the EC2 wizard.
3. Generate a key pair for this EC2 instance. Download and save the private key, which is needed to connect to the instance in the future.
4. After the EC2 instance is running, click on the Connect button the EC2 Management Console for instructions on how to ssh into the instance.
5. On the EC2 instance, install Node.js v14

```
    curl -fsSL https://deb.nodesource.com/setup_14.x | sudo -E bash -
    sudo apt-get install -y nodejs
```

6. On the EC2 instance, install nginx: `sudo apt-get -y install nginx`
7. Create a reverse proxy for the The Merry Tutor node server. In the file /etc/nginx/sites-enabled/themerrytutor:

```
server {
	# listen on port 80 (http)
	listen 80;
	server_name themerrytutor.nnhsse.org;

	# write access and error logs to /var/log
	access_log /var/log/themerrytutor_access.log;
	error_log /var/log/themerrytutor_error.log;

	location / {
		# forward application requests to the node server
		proxy_pass http://localhost:8080;
		proxy_redirect off;
		proxy_set_header Host $host;
		proxy_set_header X-Real-IP $remote_addr;
		proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
	}
}
```

8. Restart the nginx server: `sudo service nginx reload`
9. Install and configure [certbot](https://certbot.eff.org/lets-encrypt/ubuntufocal-nginx)
10. Clone this repository from GitHub.
11. Inside of the directory for this repository install the node dependencies: `npm install`
12. [Install mongoDB locally](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/) using apt.
13. [Secure the installation](https://docs.mongodb.com/guides/server/auth/) of mongoDB.
14. Update /etc/mongod.conf with [security.authorization enabled](https://docs.mongodb.com/manual/reference/configuration-options/#mongodb-setting-security.authorization).
15. Update the .env file:

```
PRODUCTION=TRUE
MONGO_PASSWORD=admin-user-password
```

16. Create the admin user for the merry-tutor database via mongo shell:

```
> use merry-tutor
switched to db merry-tutor
> db.createUser(
...   {
...     user: "admin",
...     pwd: "admin-user-password",
...     roles: ["readWrite", "dbAdmin"]
...   }
... )
```

17. While still in the mongo shell, create the Users and Summaries collections:

```
> use merry-tutor
switched to db merry-tutor
> db.createCollection("Users")
{ "ok" : 1 }
> db.createCollection("Summaries")
{ "ok" : 1 }
```

18. Install Production Manager 2, which is used to keep the node server running and restart it when changes are pushed to master:

```
sudo npm install pm2 -g
sudo pm2 start app.js
```

19. Verify that the node server is running: `sudo pm2 list`
20. Configure pm2 to automatically run when the EC2 instance restarts: `sudo pm2 startup`
21. Add a crontab entry to pull from GitHub every minute: `crontab -e`

```
*/1 * * * * cd /home/ubuntu/merry-tutor && git pull
```

22. Restart the node server: `sudo pm2 restart app`


## Contribute
Pull requests are currently welcome.

## Issues
All current issues and enhancements are listed in Github issues. For a sentence description of the issue, click the issue to view the comment.

## License
TBD

## Credits
[_A Beginners Guide to writing a Kickass README_](https://meakaakka.medium.com/a-beginners-guide-to-writing-a-kickass-readme-7ac01da88ab3)

