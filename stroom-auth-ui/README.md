# stroom-auth-ui

Pre-release version of the login page.

## Packaging
Currently the application is mounted at `/auth`. It's here because that's the path we want it to have when accessed via NGINX. If you want to change this then I'm afraid it needs to be changed in several places

In this repository:
* `./package.json`, in the `homepage` section
* ``./Dockerfile`, in the Release section, where it copies from the previous build stage.

In the `stroom-resources` repository:
* The NGINX config in `./deploy/template/nginx.conf`, currently the `location /auth` block.
* In the `stroom-auth-service` container, in `./compose/containers/stroomAuthService.yml`, in the `AUTH_UI` environment variable.
