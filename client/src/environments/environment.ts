// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  envName: 'dev',
  production: false,
  API_URL: 'http://localhost:4567/api/',
  backendless: {
    APP_ID: 'D5959C41-1602-21D6-FFF0-AC7FF58B9F00',
    API_KEY: 'B1D6F4C8-534A-7536-FF4F-9C5A44A36800'
  }
};
