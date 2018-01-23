# stroom-auth-ui

This package contains:

* The login UI
* The UI for maintaining user accounts
* The UI for maintaining tokens

## Running
To run in dev use `yarn start`. 

This will create your config in `public/auth/config.json`. It will be created using `config.template.json` and `config.template.sh`. 

## The problem of hosting at a non-root location

`create-react-app` run in dev mode doesn't support hosting at non-root locations. `homepage` in `package.json` is ignored and it is always serve at `/`. This means `bundle.js` is expected to be at `http://domain/static/js/bundle.js`. This works if going directly to the app on the port, but not if we want to get there from NGINX, which send everything that arrives to `/auth` to `http://<IP_ADDRESS>:5000` -- the static files at the root will never be reverse proxied because `/static` isn't a route in our `nginx.conf`.

This means that in dev all references to `stroom-auth-ui` must bypass nginx. 