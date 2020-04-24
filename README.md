# GDS Node.js boilerplate

This is a skeleton Node.js app running on [Express] with [Nunjucks] as a template engine.

It includes:
- Grunt for compliation of sass/js
- [GOV.UK Frontend]
- [Browserify] with babelify and Nunjucksify
- Mocha for testing
- Middleware to set correlation headers
- i18n language support
- [Snyk]
- [StandardJS] for linting
- [nvm] (optional) for nodejs version

To get started clone the repo and run

``` bash
$ npm install
$ npm run start:local
```
(`npm install` might error about Snyk if it’s not set up but ignore for now)

Then go to [http://localhost:3000/individual-id/1](http://localhost:3000/individual-id/1) to see it in action.

### Prerequisites

Run the requried backend services using the supplied docker-compose config. Before starting you must add the following line to your `/etc/hosts` file to allow the authentication service to function:

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

