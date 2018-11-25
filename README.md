# LibreHealth Atlas
## Easy to use Atlas for LibreHealth written in NodeJS and Express

#### [DEMO](https://lh-atlas.glitch.me/)

### How To Run Yourself : 
* Fork the repo
* Clone it locally
* To Use Your Own Database
    * Create your own mysql database
    * Create two tables `newmarkers` and `admins` with these commands 
    
    ```sql
        create table newmarkers (
            id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            tool VARCHAR(30) NOT NULL,
            version VARCHAR(30) NOT NULL,
            location VARCHAR(255) NOT NULL,
            intro VARCHAR(255) NOT NULL,
            lat VARCHAR(255) NOT NULL,
            lng VARCHAR(255) NOT NULL,
            phone VARCHAR(255),
            email VARCHAR(50),
            c_date TIMESTAMP
        );
	
        CREATE TABLE admins(
            id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            EMAIL VARCHAR(255) NOT NULL,
            PASSWORD VARCHAR(255) NOT NULL,
            tstamp TIMESTAMP
        );

	 ```
    * Open `index.js`
    * On Line `48` edit these with your own database info
    
	```javascript
        var connection = mysql.createConnection({
            host: 'YOUR_HOST_NAME',
            user: 'DB_USERNAME',
            password: 'DB_PASSWORD',
            database: 'DB_NAME'
        });
	```
    * run `npm install`
    * run `npm start`
