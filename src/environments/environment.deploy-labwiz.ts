// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  name: 'TEST',
  production: false,
  identityServerUrl: 'https://id.leanda.io/auth/realms/OSDR',
  apiUrl: 'https://api-labwiz.leanda.io/core-api/v1/api',
  blobStorageApiUrl: 'https://api-labwiz.leanda.io/blob/v1/api',
  imagingUrl: 'http://api.leanda.io/imaging/v1/api',
  signalrUrl: 'https://api-labwiz.leanda.io/core-api/v1/signalr',
  metadataUrl: 'http://api.leanda.io/metadata/v1/api',
  notificationTimeOut: 60 * 60 * 1 * 1000,
  proxyJSMOL: 'https://api.leanda.io/core-api/v1/api/proxy/jsmol',
  ketcher: 'https://core.leanda.io/ketcher/indigo/layout',
  maxBlobUploadingFileSize: 10240 * 1024,
  capabilities: {
    chemical: true,
    crystal: true,
    image: true,
    machineLearning: false,
    microscopy: true,
    office: true,
    pdf: true,
    reaction: true,
    spectrum: true,
    datasets: true,
    webPage: true,
    login: true,
    fvc: false,
    ssp: false,
    labwiz: true,
  },
  distribution:
  {
    code: 'labwiz',
    title: 'LabWiz',
  },
};
