<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->
<a name="readme-top"></a>
<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
-->



<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->
<!--
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]
-->

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/othneildrew/Best-README-Template">
    <img src="images/logo_orange_circle.png" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">Axone Books</h3>

  <p align="center">
    <br />
    <a href="http://www.axone.network/">View Demo</a>
    ·
    <a href="http://www.axone.network/">Report Bug</a>
    ·
    <a href="http://www.axone.network/">Request Feature</a>
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#local-setup">Local Setup</a></li>
        <li><a href="#production-setup">Production Setup</a></li>
      </ul>
    </li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

[![Product Name Screen Shot][product-screenshot]](https://example.com)

Axone is a platform for content creators to collaborate in a unique way. Inspired by the theory of “parallel universes”, Axone allows content to have alternative parallel paths. Through collaboration, different creators can expand a piece of content by creating an alternate version of it! Alternate versions of the alternate version can be created resulting in an alternative path of a content’s evolution! Features on Axone include Web Monetization and NFT Minting.

We started with books for our POC (proof of concept) which can be found [here](http://www.axone.network/). Authors can create or extend books by contributing chapters to them. An author can create a chapter with a different plot to an existing one resulting in a new trajectory of the book and thus a different ending. Other cool stuff that can be done is adding background stories, explanations, illustrations, animations and voice overs. These will be implemented in preceding versions of Axone.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

This section should list any major frameworks/libraries used to bootstrap your project. Leave any add-ons/plugins for the acknowledgements section. Here are a few examples.

* [![Vue][Vue.js]][Vue-url]
* [![Bootstrap][Bootstrap.com]][Bootstrap-url]
* [![JQuery][JQuery.com]][JQuery-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->
## Getting Started

This repository is for the backend. The backend provides the API for the front end repository which can be found [here](https://github.com/takundachirema/axone-books-frontend).

### Prerequisites

This is an example of how to list things you need to use the software and how to install them.
* npm
  ```sh
  sudo npm install -g n
  sudo n 14.18.1
  ```
* docker

### Local Setup 

1. Clone the repo
   ```sh
   git clone https://github.com/takundachirema/axone-books-backend.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Start the server
   ```sh
   npm run start
   ```
4. Clone the Bigchaindb repo. Bigchaindb is a blockchain database that can be used for representing real world assets as digital assets. Ownership is   enforced through cryptographic keys and it uses Tendermint for consensus and MongoDB for storage.
  ```sh
  git clone https://github.com/bigchaindb/bigchaindb.git
  cd bigchaindb
  make run &> log.out &
  ```
5. Axone backend app will connect to the local instance of bigchaindb at http://localhost:9984/api/v1/

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Production Setup 

<details>

<summary>Click to see details</summary>

### Setup SSL

- Install nginx: 
```
sudo apt update
sudo apt install nginx
```
- update the http and https to redirect to port 9984:
```
sudo nano /etc/nginx/sites-enabled/default
```
- Then paste this:
```
server {
    ...
    location / {
        proxy_pass http://127.0.0.1:9984;
    }
    ...
```
- Also increase the file size max that can be sent
```
sudo nano /etc/nginx/nginx.conf
```
- Then add this into the http tag:
```
http {
    ...
    client_max_body_size 20M;
} 
```
- Then reload nginx:
```
sudo service nginx reload
```
- For errors in connection logs are here:
```
nano /var/log/nginx/error.log
```
- Now install lets encrypt and we'll use it for obtaining a certificate for https connection to the node
```
sudo apt update && sudo apt install certbot python3-certbot-nginx
```
- Get SSL certificate
```
sudo certbot --nginx
```
- When asked about your domain names put like this:
```
nececity.net www.nececity.net
```

### Install MongoDB:
```
sudo apt-get update
sudo apt install mongodb
```
- For remote access change; bind_ip from 127.0.0.1 to 0.0.0.0:
- Also change the port as a measure to stop attacks but you can do more for access restrictions
```
sudo nano /etc/mongodb.conf
```

- The restart the service. Its mongodb on ubuntu 20.04 and mongod on others:
```
sudo service mongodb restart
```

### Install Bigchaindb and Tendermint
- http://docs.bigchaindb.com/projects/server/en/latest/simple-deployment-template/set-up-node-software.html OR:
```
sudo apt install -y python3-pip libssl-dev
sudo pip3 install -U pip
sudo pip3 install bigchaindb==2.2.2
```
- Install tendermint
```
sudo apt install -y unzip
wget https://github.com/tendermint/tendermint/releases/download/v0.31.5/tendermint_v0.31.5_linux_amd64.zip
unzip tendermint_v0.31.5_linux_amd64.zip
rm tendermint_v0.31.5_linux_amd64.zip
sudo mv tendermint /usr/local/bin
```
- Initialize tendermint
```
sudo tendermint init
```
- If you see port already in use after starting mongodb run this:
```
sudo lsof -iTCP -sTCP:LISTEN -n -P
```
- Then kill the mongodb process:
```
sudo kill <process_id>
```

### Start Bigchaindb Using Monit - Recommended
- Monit can be used to make sure that both the bigchaindb process is started and that tendermint are running
```
sudo apt-get update
sudo apt install monit 
bigchaindb-monit-config 
```
- These create the .bigchaindb-monit folder
- The script that is run is called .bigchaindb-monit/monit_script
- Create the config file needed for bigchaindb and put it in .bigchaindb-monit folder
```
bigchaindb -y configure localmongodb
cp .bigchaindb .bigchaindb-monit/bigchaindb_config.json
```
- Then change the port of mongodb in the bigchaindb_config.json to be 52527
- put this in that script:
```
#!/bin/bash
case $1 in

  start_bigchaindb)

    pushd $3

      nohup bigchaindb -c $4/bigchaindb_config.json start > $3/bigchaindb.out.log 2>&1 &

      echo $! > $2
    popd

    ;;

  stop_bigchaindb)

    kill -2 `cat $2`
    rm -f $2

    ;;

  start_tendermint)

    pushd $3
      sudo nohup tendermint node >> $3/tendermint.out.log 2>> $3/tendermint.err.log &
      
      sudo bigchaindb init
      
      echo $! > $2
    popd

    ;;

  stop_tendermint)

    kill -2 `cat $2`
    rm -f $2

    ;;

esac
exit 0
```
- The script that takes care of logs is called: .bigchaindb-monit/monit_script_logrotate
```
#!/bin/bash
case $1 in
  rotate_tendermint_logs)
    /bin/rm $2.tar.gz
    /bin/tar -cvf $2.tar.gz $2    
    /bin/cp /dev/null $2
    ;;
esac
exit 0
```
- Now to start the monit service we need to show it what processes to start:
```
sudo nano /etc/monit/monitrc
```
- First make the monit be 5 seconds: set daemon 5
- Make log files go to: set log /var/log/monit.log
- If you have to remove the monitrc file run this command:
```
sudo chmod 600 /etc/monit/monitrc
```
- Then fill that file with the below in the SERVICES section:
```
check process bigchaindb_process
    with pidfile /home/takundachirema/.bigchaindb-monit/monit_processes/bigchaindb.pid
    start program "/home/takundachirema/.bigchaindb-monit/monit_script start_bigchaindb /home/takundachirema/.bigchaindb-monit/monit_processes/bigchaindb.pid /home/takundachirema/.bigchaindb-monit/logs /home/takundachirema/.bigchaindb-monit"
    restart program "/home/takundachirema/.bigchaindb-monit/monit_script start_bigchaindb /home/takundachirema/.bigchaindb-monit/monit_processes/bigchaindb.pid /home/takundachirema/.bigchaindb-monit/logs /home/takundachirema/.bigchaindb-monit"
    stop program "/home/takundachirema/.bigchaindb-monit/monit_script stop_bigchaindb /home/takundachirema/.bigchaindb-monit/monit_processes/bigchaindb.pid /home/takundachirema/.bigchaindb-monit/logs /home/takundachirema/.bigchaindb-monit"

check process tendermint
    with pidfile /home/takundachirema/.bigchaindb-monit/monit_processes/tendermint.pid
    start program "/home/takundachirema/.bigchaindb-monit/monit_script start_tendermint /home/takundachirema/.bigchaindb-monit/monit_processes/tendermint.pid /home/takundachirema/.bigchaindb-monit/logs /home/takundachirema/.bigchaindb-monit /home/takundachirema/.bigchaindb-monit/monit_processes/bigchaindb.pid"
    restart program "/home/takundachirema/.bigchaindb-monit/monit_script start_tendermint /home/takundachirema/.bigchaindb-monit/monit_processes/tendermint.pid /home/takundachirema/.bigchaindb-monit/logs /home/takundachirema/.bigchaindb-monit /home/takundachirema/.bigchaindb-monit/monit_processes/bigchaindb.pid"
    stop program "/home/takundachirema/.bigchaindb-monit/monit_script stop_tendermint /home/takundachirema/.bigchaindb-monit/monit_processes/tendermint.pid /home/takundachirema/.bigchaindb-monit/logs /home/takundachirema/.bigchaindb-monit"

check file bigchaindb.out.log with path /home/takundachirema/.bigchaindb-monit/logs/bigchaindb.out.log
    if size > 20 MB then
        exec "/home/takundachirema/.bigchaindb-monit/monit_script_logrotate rotate_tendermint_logs /home/takundachirema/.bigchaindb-monit/logs/bigchaindb.out.log /home/takundachirema/.bigchaindb-monit/monit_processes/bigchaindb.pid"

check file tendermint.out.log with path /home/takundachirema/.bigchaindb-monit/logs/tendermint.out.log
    if size > 20 MB then
        exec "/home/takundachirema/.bigchaindb-monit/monit_script_logrotate rotate_tendermint_logs /home/takundachirema/.bigchaindb-monit/logs/tendermint.out.log /home/takundachirema/.bigchaindb-monit/monit_processes/tendermint.pid"

check file tendermint.err.log with path /home/takundachirema/.bigchaindb-monit/logs/tendermint.err.log
    if size > 20 MB then
        exec "/home/takundachirema/.bigchaindb-monit/monit_script_logrotate rotate_tendermint_logs /home/takundachirema/.bigchaindb-monit/logs/tendermint.err.log /home/takundachirema/.bigchaindb-monit/monit_processes/tendermint.pid"

```
- ** NB - Run the commands in the Errors for both Monit and Manual section
- Then start the monit service:
```
sudo /etc/init.d/monit restart
```
- Then check that all processes are running
```
sudo lsof -iTCP -sTCP:LISTEN -n -P
```
- To check a specific process run:
```
ps aux | grep -i tendermint
```
- If not, check the logs from the monit process
```
sudo nano /var/log/monit.log
```

### Start Bigchaindb Manual
- ** NB - Run the commands in the Errors for both Monit and Manual section
- Then start the bigchaindb:
```
nohup bigchaindb start > bigchaindb.out.log 2>&1 &
```
- Then start the tendermint node:
```
tendermint node &> tendermint.out &
```
- To stop it first check process id and then kill it as below. Don't forget the -2 parameter.
```
ps -ef | grep bigchaindb
sudo kill -2 <process_id>
```

### backups

- Its important to take some frequent snapshots of the VM in case tendermint crashes and has to rebuild the DB by committing the transactions. This takes hours if the transactions are a few hundred thousand which can be reached easily.

### Understanding Tendermint and BigchainDB

- Tendermint seeks to abstract the BFT (Bazantyne Fault Tolerance) such that it is not a monolithic structure.
- For decentralized BFT we need the brain (logic), the storage (state) and the 2 need to communicate.
- With blockchains such as Ethereum the brain and storage are all one structure with the communication hidden inside it.
- Tendermint wants to abstract that such that the brain i.e. Tendermint Node (TN) just has to get data from the storage without knowing the storage implementation.
- To do that the TN needs to have an API structure which is called the ABCI (application blockchain interface).
- So the TN is the consensus engine, which also includes the peer to peer layers (since the TN nodes need communication for BFT).
- The TN is decoupled from the storage using the ABCI. So TN is on one end and the application is on the other end of the ABCI.
- The application is responsible for giving the TN whatever it needs, e.g. the UTXO's etc. so that the TN can make decisions.sh

### Errors for both Monit and Manual

- If you get an error about itdangerous in the bigchaindb.out.log run this:
- Do for both sudo and non-sudo because of python environments:
```
pip3 install itsdangerous==2.0.1
sudo pip3 install itsdangerous==2.0.1
```
- If you get an error; cannot import name 'BaseResponse' from 'werkzeug.wrappers', run this:
```
sudo pip3 install werkzeug==2.0.3
```
- If you get a warning; RuntimeWarning: greenlet.greenlet size changed:
```
sudo pip install --upgrade gevent
```

## Reset BigchainDB

- Run these commands:
```
sudo tendermint unsafe_reset_all
```
- delete the directory:
```
sudo rm -R /root/.tendermint
```
- Then stop the tendermint process
```
ps aux | grep -i tendermint
```
- Then reset the bigchaindb
```
sudo bigchaindb drop
```
- Then stop bigchaindb process
```
ps aux | grep -i bigchaindb
```
- then re-initialize it
```
sudo tendermint init
```

### Useful queries

- Check last row in collection:
```
db.blocks.find().limit(1).sort({$natural:-1})
```
- Remove all blocks height greater than:
```
db.products.remove( { qty: { $gt: 20 } } )
```
- Drop all collections:
```
db.getCollectionNames().forEach(function(x) {db[x].drop()});
```

</details>


<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTACT -->
## Contact

Takunda Chirema - takunda.chirema@alumni.uct.ac.za

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/othneildrew/Best-README-Template.svg?style=for-the-badge
[contributors-url]: https://github.com/othneildrew/Best-README-Template/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/othneildrew/Best-README-Template.svg?style=for-the-badge
[forks-url]: https://github.com/othneildrew/Best-README-Template/network/members
[stars-shield]: https://img.shields.io/github/stars/othneildrew/Best-README-Template.svg?style=for-the-badge
[stars-url]: https://github.com/othneildrew/Best-README-Template/stargazers
[issues-shield]: https://img.shields.io/github/issues/othneildrew/Best-README-Template.svg?style=for-the-badge
[issues-url]: https://github.com/othneildrew/Best-README-Template/issues
[license-shield]: https://img.shields.io/github/license/othneildrew/Best-README-Template.svg?style=for-the-badge
[license-url]: https://github.com/othneildrew/Best-README-Template/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/othneildrew
[product-screenshot]: images/screenshot.png
[Next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Next-url]: https://nextjs.org/
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Vue.js]: https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D
[Vue-url]: https://vuejs.org/
[Angular.io]: https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white
[Angular-url]: https://angular.io/
[Svelte.dev]: https://img.shields.io/badge/Svelte-4A4A55?style=for-the-badge&logo=svelte&logoColor=FF3E00
[Svelte-url]: https://svelte.dev/
[Laravel.com]: https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white
[Laravel-url]: https://laravel.com
[Bootstrap.com]: https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white
[Bootstrap-url]: https://getbootstrap.com
[JQuery.com]: https://img.shields.io/badge/jQuery-0769AD?style=for-the-badge&logo=jquery&logoColor=white
[JQuery-url]: https://jquery.com 
