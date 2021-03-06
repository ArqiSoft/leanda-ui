export const environment = {
  name: 'UAT',
  production: false,
  identityServerUrl: 'https://id.uat.your-company.com/auth/realms/leanda',
  apiUrl: 'https://api.uat.your-company.com/core/v1/api',
  blobStorageApiUrl: 'https://api.uat.your-company.com/blob/v1/api',
  imagingUrl: 'https://api.uat.your-company.com/imaging/v1/api',
  signalrUrl: 'https://api.uat.your-company.com/core/v1/signalr',
  metadataUrl: 'https://api.uat.your-company.com/metadata/v1/api',
  notificationTimeOut: 60 * 60 * 24 * 1000,
  proxyJSMOL: 'https://api.uat.your-company.com/core/v1/api/proxy/jsmol',
  ketcher: 'https://core.uat.your-company.com/ketcher/indigo/layout',
  capabilities: {
    chemical: true,
    crystal: true,
    image: true,
    machineLearning: true,
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
    labwiz: false
  },
  distribution: {
    code: 'leanda',
    title: 'Leanda'
  }
};
