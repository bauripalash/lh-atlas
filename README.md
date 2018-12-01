# LibreHealth Atlas
## Easy to use Atlas for LibreHealth written in NodeJS and Express

#### [DEMO](https://lh-atlas.glitch.me/)



## How To Run Yourself : 
* Fork the repo
* Clone it locally
* Install Dependencies : 
    * run `yarn`
* Rename `example.env` to `.env` and fill up the enviorment variables
```
DB_NAME= Your Database name
DB_USER= You Database Username with read/write access
DB_PASS= Your Database user password
DB_HOST= Your Database host url
JWT_SECRET= Your Very Secret Key (Keep it safe)
```
* Start the application
    * run `yarn start`


## API Docs :
|URL|Usage|Token Needed|
|---|---|---|
|`/api/markers`| Returns JSON list of all markers|No|
|`/api/markers/product/<product>`|Returns JSON list of specific product where product can be `ehr` , `toolkit` or `radiology`| Yes|
|`/api/markers/product/<product>/?country=<country>`|Returns JSON list of specific product of specific country where product can be `ehr` , `toolkit` or `radiology` and country must be the Initials of slected country| Yes|
|`/api/markers/product/<product>/pnum`|Returns patient count of specific product where product can be `ehr` , `toolkit` or `radiology`| Yes|
|`/api/markers/product/<product>/pnum/?country=<country>`|Returns patient count of specific product of specific country where product can be `ehr` , `toolkit` or `radiology`  and country must be the Initials of slected country| Yes|
|`/api/markers/country/<country>`|Returns JSON list of specific country where country should be first two initial of country name| Yes|
|`/api/markers/creator/<email>`|Returns JSON list of markers created by user with the mentioned email address|Yes|
|`/api/nonadmins`| Returns JSON list of users who are not admins/super user| Yes|
|`/api/admins`|Returns JSON list of all admins/super users|Yes|
|`/api/allusers/`|Returns JSON list of all users|Yes|


**Note** : Logged in Users don't need to generate token to use api

### How To Use API :
* To Use APIs you must have a account in LH Atlas
* To Generate token visit admin panel and click on **Get Access Token** button , copy the shown long key
* Modify your urls like this ;
**`/api/<api name>/?token=<your access token>`**
    * > Example : `https://lh-atlas.glitch.me/api/admins/?token=myblablatoken`
    
---
## Special Thanks To : 
* Map Marker Icons made by [SimpleIcon](https://www.flaticon.com/authors/simpleicon) from [Flaticon](https://www.flaticon.com/) are licensed under [CC 3.0 BY](http://creativecommons.org/licenses/by/3.0/)
                
* All the LibreHealth icons used are owned by [LibreHealth](http://librehealth.io)

* Robby O'Connor , for giving me some precious advise on my project