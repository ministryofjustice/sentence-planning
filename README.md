# Sentence Planning UI

This is a Node.js app running on [Express] with [Nunjucks] as a template engine.

It includes:
- [GOV.UK Frontend]
- [Browserify] with babelify and Nunjucksify
- Jest for testing
- Middleware to set correlation headers
- i18n language support
- [StandardJS] for linting
- [nvm] (optional) for nodejs version

To get started clone the repo and run

``` bash
$ npm install
$ npm run start:local
```

Then go to [http://localhost:3000/individual-id/1](http://localhost:3000/individual-id/1) to see it in action.

Use `docker-compose up` to run the associated back end services the UI needs to link to. There is also a mock server included to make local development more straightforward. To use this, edit `common\config.js` and change the `apis.sentenceplanning.url` to `http://localhost:18081`

### Prerequisites

Run the required backend services using the supplied docker-compose config. Before starting you must add the following line to your `/etc/hosts` file to allow the authentication service to function:

```
127.0.0.1 oauth
```

### Validating the helm templates

You can validate the helm configuration and template rendering locally using the helm CLI tool:

```bash
brew install helm
helm template helm_deploy/sentence-planning --values helm_deploy/values-development.yaml \
                                            --values helm_deploy/secrets-example.yaml
```

The output of the above command is the full manifest file for the 'development' context (with the secret keys stubbed using the values in `secrets-example.yaml`).

### Using nvm (optional)
If you work across multiple Node.js projects there's a good chance they require different Node.js and npm versions.

To enable this we use [nvm (Node Version Manager)](https://github.com/creationix/nvm) to switch between versions easily.

1. [install nvm](https://github.com/creationix/nvm#installation)
2. Run `nvm install` in the project directory (this will use [.nvmrc](/../../.nvmrc))
3. Follow the steps above to install and start

[Express]: https://expressjs.com/
[Nunjucks]: https://mozilla.github.io/nunjucks/
[Snyk]: https://snyk.io/
[GOV.UK Frontend]: https://design-system.service.gov.uk/
[Browserify]: http://browserify.org/
[StandardJS]: https://standardjs.com/
[nvm]: https://github.com/creationix/nvm

