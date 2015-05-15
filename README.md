This is an example server that shows how kotrans could be used.

You have been provided with a server AS is, but first we need to download some dependencies. 

###This example is not meant for developers as a means to use kotrans. There is a separate module that is intended for developers [on github](https://github.com/cinnamonbagels/kotrans) and [on the npm registry](https://npmjs.org/package/kotrans)

#Node.js

on the Terminal as root or sudo, enter these commands:
```
$ curl -sL https://deb.nodesource.com/setup | sudo bash -
$ apt-get install -y nodejs
```

To ensure that node is installed properly, enter
```
$ node -v
```
and you should see a node version that is greater than 0.10.

##Git
In order to get the code, you must install git:
```
$ apt-get install -y git
```
and then grab the repository
```
$ git clone https://github.com/cinnamonbagels/kotransExample.git
```

#Setting up the server

##app.config.js
`$ cd kotransExample/config/` and edit the file `app.config.js`

```javascript
module.exports = {
	secure : false,
	cert : '',
	key : '',
	port : 9000,
	path : '/sendData',
	allowed_directory : ''
}
```
* `secure` : Set this flag to true if you wish to access your website through `https://`. Otherwise, you will access your website through `http://`.
* `cert` : If you choose to connect to this server through SSL, you must provide the absolute path to your server certificate. `seucre` flag must be set to true.
* `key` : If you choose to connect to this server through SSL, you must provide the aboslute path to your server key. `secure` flag must be set to true.
* `port` : can be changed to a different number, or left as is.
* `path` : can be any path you want except `/`. You may leave it as it is.
* `allowed_directory` : This will be the directory that transferred files will go. You must provide the absolute path to the directory you wish to put your files. Make sure that the file has the correct permissions (See node permissions below). If left as is, files will be placed in `kotransExample/node_modules/kotrans/Server/`.

##client.config.js
`$ cd kotransExample/static/js/` and edit the file `client.config.js`

```javascript
var configParams = {};

configParams = {
	no_streams : 4,
	host : '',
	port : '',
	path : '/sendData'
};
```
* `no_streams` : Number of concurrent streams. More streams means faster data transfer, but too many streams causes diminishing returns. We left it at 4.
* `host` : The IP/domain that your server is running on. Leave it as is, and you may test it locally on localhost.
* `port` : The port that your server is running on. It should match the port that you specified in `app.config.js`.
* `path` : The path that you specified in `app.config.js`. You may leave it as it is.


#Setting node permissions
We want to make sure that when you transfer files to the server, that node has the requisite permissions to perform tasks.

Ensure that `kotransExample/` is not under root control by typing `ls -la` just outside of the `kotransExample/` directory.
```
user@User-Linux ~/someDirectory $ ls -la
drwxr-xr-x  6 user  user    4096 May  7 19:42 kotransExample
```
* owner must not be root

And the folder that you want to store uploaded content to is under user control
```
user@User-Linux ~/someDirectory $ ls -la
drwxr-xr-x  6 user  user    4096 May  7 19:42 folderToPutFilesIn
```

#Starting the Server
To start the server, `cd kotransExample/` and enter:
```
$ node app.js
```

It is working properly if you see something similar:
```
Web server listening on port 9000
```

##You can now open up your browser and drag-and-drop files into the black box provided.

#Benchmarking
I have added some simple statistics to benchmark kotrans. In order to view this on your browser, open up your developer console.

* Chrome
  * Windows `ctrl + shift + j`
  * Mac `cmd + opt + j`
* Safari
  * [Enable developer tools](https://developer.apple.com/library/mac/documentation/AppleApplications/Conceptual/Safari_Developer_Guide/GettingStarted/GettingStarted.html)
* Firefox (Best performance so far)
  * Windows `ctrl + shift + k`
  * Mac `cmd + opt + k`

When you drag and drop a file, it will initialize and upon successful transfer, show the time it took to transfer in seconds, with a rough estimate of the amount transferred in MB/s.