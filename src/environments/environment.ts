// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  gatewayServerUrl: 'http://localhost:8028',
  eurekaUrl: 'http://localhost:8027',
  zipkinUrl: 'http://localhost:9411',
  kibanaUrl: 'http://localhost:5601',
  rabbitMqUrl: 'http://localhost:15672',
  configServerUrl: 'http://localhost:8029',
  eurekaServerUrl: 'http://localhost:8027'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
