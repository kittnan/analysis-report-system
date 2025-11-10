// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  // UrlApi: "http://localhost:8787",
  // UrlApi: "http://10.200.90.152:8787",

  UrlApi: "http://localhost:4026",
  // UrlApi: "http://10.200.90.152:4026",
  master: 'equipment/master',
  country: 'equipment/country',
  equipment: 'equipment',
  IdModelNumber: "6188a3a852435d450fa8355f",
  IdProductPhase: "6188a3c852435d450fa83561",
  IdDefectCategory: "6188a3e052435d450fa83563",
  IdAbnormalLevel: "6188a3f152435d450fa83565",
  IdSource: "6188a41152435d450fa8356b",
  IdAnalysisLevel: "6188a41852435d450fa8356d",
  IdCause: "6188a42352435d450fa8356f",
  MasterCauseOfDefective: "63a514d136895b117bc81296",
  MasterMakerSupplierName: "63a514d236895b117bc81298",



  ModelNumber: "KTC Model Number",
  Defective: "DefectCode & DefectName",
  Occur: "Occur Place",
  Cause: "Category Root Cause",
  ProductionPhase: "Production Phase",
  DefectCategory: "Defect Category",
  Abnormal: "Abnormal Lot Level",
  Source: "Source Of Defect",
  TreatmentNG: "Treatment of NG",
  AnalysisLevel: "Analysis Level",
  JudgementDefect: "Judgement Defect",
  appVersion: require('../../package.json').version + '-dev',
};
