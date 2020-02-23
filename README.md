# Introduction 
This is Wastechain, a Blockchain-based, decentralized Operating System for the Waste industry using Hyperledger Fabric. 

# How to run the Test-Network
Note: The system only runs on Linux (only tested on Debian 9 and Ubuntu 16+) or Mac!

1. Download and install docker (https://docs.docker.com/install/) and docker-compose (https://docs.docker.com/compose/install/) --> Version 8.x.x!
2. Download and install npm (https://www.npmjs.com/get-npm) --> Version 5.x.x or higher!

(see Prerequisites of Hyperledger Fabric for more Information: https://hyperledger-fabric.readthedocs.io/en/release-1.4/prereqs.html)

3. Navigate into the "contract" directoy and execute the command "npm install" (using a shell)
4. Navigate into the "application" directoy and execute "npm install"
5. Navigate into the "test-network" directory
6. If using a Mac, execute "./recreate_complete.sh"
7. If using a Linux-based OS, execute "sudo ./recreate_complete.sh"
8. Wait for the command to finish
6. If using a Mac, execute "./start_api.sh"
7. If using a Linux-based OS, execute "sudo ./start_api.sh"
8. Wait for the command to finish and continue to wait for a minute after that, in order for the API and Web-Frontend to start up.

# Access API
When everything is up and running, the API for the different Organisations are available at:
- Ordering Org: http://localhost:10000
- Subcontractor Org: http://localhost:30000
- Third Party Org: http://localhost:50000

# Access Web-Frontend
When everything is up and running, the Web-Frontend for the different Organisations are available at:
- Ordering Org: http://localhost:8080
- Subcontractor Org: http://localhost:10800
- Third Party Org: http://localhost:12080

