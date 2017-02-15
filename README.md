# NodeTestBench
Intentionally Vulnerable Node Applications

## Running Locally

Make sure you have [Node.js](http://nodejs.org/) installed or install a version on node from [nvm](https://github.com/creationix/nvm).

```sh
git clone git@github.com:Contrast-Security-OSS/NodeTestBench.git # or clone your own fork
cd NodeTestBench
npm install
npm start
```

Your app should now be running on [localhost:3000](http://localhost:3000/).

## Running with Contrast

### Installation
After downloading from your account, install the agent from your application's root directory as follows:
``` sh
npm install node_contrast-#.#.#.tar.gz
```
This will add the agent to your ```node_modules``` folder without creating an entry in the dependencies list of your ```package.json```.

### Setup
Unlike the other agents, the Node agent requires you to have set up a configuration file before running it for the first time. By default, the agent looks for this configuration file in your application's root directory and expects the file to be called ```contrast.json```.
The minimum required contrast.json setup should look like this:
``` javascript
{
    "apiKey":"api_key",
    "user": {
        "id":"<contrast_id>",
        "serviceKey":"<contrast_apiKey>"
    },
    "uri":"http://app.contrastsecurity.com"
}
```

---

 Property               | Description 
------------------------|------------
apiKey     | Organization's API key     
id         | Contrast user account ID (In most cases, this is your login ID)
serviceKey | Contrast user account service key
uri        | Address of the TeamServer installation you would like your agent to report to

---

The API key and service key can be retrieved within the dropdown menu on your user name (upper right). Navigate to **Organization Settings** and then select **API** in the left column.

For a full list of configuration options that can be placed in this file, see [Node Agent Configuration](user_nodeconfig.html#config).

### Running the agent
After installation, the agent can be run with ```node-contrast <app-main>.js```.

If you prefer to run your app with **npm**, you can add a run script to your application's ```package.json```.

``` javascript
"scripts": {
	"contrast": "node-contrast index.js",
	"start": ...,
	"test": ...
}
```

Then, the agent can simply be run with ```npm run contrast```. This npm script can be changed to include other runtime configurations, such as an alternate configuration file location. For more information, see [Node Agent Configuration](user_nodeconfig.html#config).
