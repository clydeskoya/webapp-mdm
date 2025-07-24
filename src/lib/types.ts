export type Contact = {
  mail: string;
  phone: string;
};

export type Agent = {
  name: string;
  description: string;
  url: string;
  id: string;
  contacts: Contact[];
};

export type RecursoLegal = {
  jurisdiction: string;
  legalAct: string;
  agents: Agent[];
};

export type Distribution = {
  license: string;
  format: string;
  modified: Date;
  created: Date;
  accessURL: string;
  downloadURL: string;
};

export type Dataset = {
  title: string;
  description: string;
  distributions: Distribution[];
};

export type Dataservice = {
  title: string;
  endpoint_url: string;
  license: string;
  description: string;
  access: string;
  format: string;
  owner: Agent;
  recursoLegal: RecursoLegal;
};

export type Catalogue = {
  title: string;
  description: string;
  language: string;
  modifiedDate: Date;
  homepage: string;
  owner: string;
  datasets: Dataset[];
  dataservices: Dataservice[];
};

export type FormValues = {
  recursosLegais: RecursoLegal[];
  datasets: Dataset[];
};