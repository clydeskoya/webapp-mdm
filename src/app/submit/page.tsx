'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray, SubmitHandler, FormProvider, useFormContext } from 'react-hook-form';
import ProtectedRoute from '@/components/ProtectedRoute';

import styles from './submit.module.css';
import { DistributionFormSection } from '@/components/DistributionFormSection';
import { AgentFormSection } from '@/components/AgentFormSection';
import { RecursoLegalFormSection } from '@/components/RecursoLegalFormSection';

// Type Definitions
type Distribution = {
  title: string;
  description: string;
  license: string;
  format: string;
  modified: string;
  created: string;
  accessURL: string;
  downloadURL: string;
};

type Dataset = {
  id: string;
  title: string;
  description: string;
  access: string;
  category: string;
  version: number;
  modified: string;
  language: string;
  keyword: string;
  distributions: Distribution[];
};

type DataService = {
  title: string;
  downloadURL: string;
  license: string;
  description: string;
  access: string;
  format: string;
};

type Contact = {
  mail: string;
  phone: string;
};

type Agent = {
  name: string;
  description: string;
  url: string;
  id: string;
  contacts: Contact[];
};

type RecursoLegal = {
  jurisdiction: string;
  legalAct: string;
  agents: Agent[];
};

type Catalogue = {
  title: string;
  description: string;
  language: string;
  modified: string;
  homepage: string;
  datasets: Dataset[];
  dataServices: DataService[];
};

type FormValues = {
  catalogues: Catalogue[];
  agents: Agent[];
  recursosLegais: RecursoLegal[];
};

// Helper to create a new Data Class
const createDataClass = (label: string, description: string, multiplicity = { min: 0, max: -1 }) => ({
    id: crypto.randomUUID(),
    label,
    description,
    lastUpdated: new Date().toISOString(),
    index: 0, // This might need to be managed better
    maxMultiplicity: multiplicity.max,
    minMultiplicity: multiplicity.min,
    dataClasses: [],
    dataElements: [],
});

// Helper to create a new Data Element
const createDataElement = (label: string, description: string, value: string, dataTypeLabel: string, multiplicity = { min: 0, max: 1 }) => {
    // Find the dataType from the template
    const dataType = dcatTemplate.dataModel.dataTypes.find((dt: any) => dt.label === dataTypeLabel);
    if (!dataType) {
        // Fallback to string if not found
        console.warn(`Data type "${dataTypeLabel}" not found. Falling back to "String".`);
        const stringType = dcatTemplate.dataModel.dataTypes.find((dt: any) => dt.label === 'String');
        return {
            id: crypto.randomUUID(),
            label,
            description: value, // The value from the form is put into the description
            lastUpdated: new Date().toISOString(),
            index: 0, // This might need to be managed better
            dataType: stringType,
            maxMultiplicity: multiplicity.max,
            minMultiplicity: multiplicity.min,
        };
    }

    return {
        id: crypto.randomUUID(),
        label,
        description: value, // The value from the form is put into the description
        lastUpdated: new Date().toISOString(),
        index: 0, // This might need to be managed better
        dataType,
        maxMultiplicity: multiplicity.max,
        minMultiplicity: multiplicity.min,
    };
};


// New JSON Generation Function
const generateDcatJson = (data: FormValues) => {
    const generatedDcat = JSON.parse(JSON.stringify(dcatTemplate));

    // Clear existing dynamic data if necessary
    generatedDcat.dataModel.childDataClasses = [];

    // Process Catalogues
    data.catalogues.forEach((catalogueData, catIndex) => {
        const catalogueClass = createDataClass(`Catálogo - ${catalogueData.title}`, catalogueData.description, { min: 1, max: -1 });
        catalogueClass.index = catIndex;

        // Add catalogue-level data elements
        catalogueClass.dataElements.push(createDataElement('Título', '', catalogueData.title, 'String', { min: 1, max: -1 }));
        catalogueClass.dataElements.push(createDataElement('Descrição', '', catalogueData.description, 'Text', { min: 1, max: -1 }));
        catalogueClass.dataElements.push(createDataElement('Idioma', '', catalogueData.language, 'String', { min: 0, max: -1 }));
        catalogueClass.dataElements.push(createDataElement('Modificado', '', catalogueData.modified, 'Date', { min: 1, max: 1 }));
        catalogueClass.dataElements.push(createDataElement('Homepage', '', catalogueData.homepage, 'String', { min: 0, max: 1 }));

        // Process Datasets within the Catalogue
        catalogueData.datasets.forEach((datasetData, dsIndex) => {
            const datasetClass = createDataClass(`Dataset - ${datasetData.title}`, datasetData.description, { min: 1, max: -1 });
            datasetClass.index = dsIndex;

            datasetClass.dataElements.push(createDataElement('ID', '', datasetData.id, 'String', { min: 0, max: 1 }));
            datasetClass.dataElements.push(createDataElement('Título', '', datasetData.title, 'String', { min: 1, max: -1 }));
            datasetClass.dataElements.push(createDataElement('Descrição', '', datasetData.description, 'Text', { min: 1, max: -1 }));
            datasetClass.dataElements.push(createDataElement('Acesso', '', datasetData.access, 'Níveis_Acesso', { min: 1, max: -1 }));
            datasetClass.dataElements.push(createDataElement('Categoria', '', datasetData.category, 'Categoria', { min: 1, max: -1 }));
            datasetClass.dataElements.push(createDataElement('Versão', '', datasetData.version.toString(), 'Decimal', { min: 1, max: 1 }));
            datasetClass.dataElements.push(createDataElement('Modificado', '', datasetData.modified, 'Date', { min: 1, max: 1 }));
            datasetClass.dataElements.push(createDataElement('Idioma', '', datasetData.language, 'String', { min: 0, max: -1 }));
            datasetClass.dataElements.push(createDataElement('Etiqueta', '', datasetData.keyword, 'String', { min: 0, max: -1 }));

            // Process Distributions within the Dataset
            datasetData.distributions.forEach((distData, distIndex) => {
                const distClass = createDataClass(`Distribution - ${distData.title}`, distData.description, { min: 0, max: -1 });
                distClass.index = distIndex;

                distClass.dataElements.push(createDataElement('Título', '', distData.title, 'String', { min: 1, max: -1 }));
                distClass.dataElements.push(createDataElement('Descrição', '', distData.description, 'Text', { min: 1, max: -1 }));
                distClass.dataElements.push(createDataElement('Licença', '', distData.license, 'String', { min: 1, max: 1 }));
                distClass.dataElements.push(createDataElement('Formato', '', distData.format, 'String', { min: 0, max: 1 }));
                distClass.dataElements.push(createDataElement('Modificado', '', distData.modified, 'Date', { min: 1, max: 1 }));
                distClass.dataElements.push(createDataElement('Criado', '', distData.created, 'Date', { min: 0, max: 1 }));
                distClass.dataElements.push(createDataElement('URL_acesso', '', distData.accessURL, 'String', { min: 0, max: -1 }));
                distClass.dataElements.push(createDataElement('URL_Download', '', distData.downloadURL, 'String', { min: 0, max: -1 }));

                datasetClass.dataClasses.push(distClass);
            });

            catalogueClass.dataClasses.push(datasetClass);
        });

        // Process DataServices within the Catalogue
        catalogueData.dataServices.forEach((serviceData, serviceIndex) => {
            const serviceClass = createDataClass(`DataService - ${serviceData.title}`, serviceData.description, { min: 0, max: -1 });
            serviceClass.index = serviceIndex;

            serviceClass.dataElements.push(createDataElement('Título', '', serviceData.title, 'String', { min: 1, max: -1 }));
            serviceClass.dataElements.push(createDataElement('URL_Download', '', serviceData.downloadURL, 'String', { min: 0, max: -1 }));
            serviceClass.dataElements.push(createDataElement('Licença', '', serviceData.license, 'String', { min: 1, max: 1 }));
            serviceClass.dataElements.push(createDataElement('Descrição', '', serviceData.description, 'Text', { min: 1, max: -1 }));
            serviceClass.dataElements.push(createDataElement('Acesso', '', serviceData.access, 'Níveis_Acesso', { min: 1, max: -1 }));
            serviceClass.dataElements.push(createDataElement('Formato', '', serviceData.format, 'String', { min: 1, max: 1 }));

            catalogueClass.dataClasses.push(serviceClass);
        });

        generatedDcat.dataModel.childDataClasses.push(catalogueClass);
    });

    // Process Agents
    data.agents.forEach((agentData, agentIndex) => {
        const agentClass = createDataClass(`Agente - ${agentData.name}`, agentData.description, { min: 1, max: -1 });
        agentClass.index = agentIndex;

        agentClass.dataElements.push(createDataElement('Nome', '', agentData.name, 'String', { min: 1, max: 1 }));
        agentClass.dataElements.push(createDataElement('Descrição', '', agentData.description, 'Text', { min: 1, max: -1 }));
        agentClass.dataElements.push(createDataElement('URL', '', agentData.url, 'String', { min: 0, max: -1 }));
        agentClass.dataElements.push(createDataElement('ID', '', agentData.id, 'String', { min: 0, max: 1 }));

        // Process Contacts within Agent
        const contactClass = createDataClass('Contacto', 'Informações de contacto do agente', { min: 1, max: -1 });
        agentData.contacts.forEach(contactData => {
            contactClass.dataElements.push(createDataElement('Mail', '', contactData.mail, 'String', { min: 0, max: -1 }));
            contactClass.dataElements.push(createDataElement('Telef.', '', contactData.phone, 'String', { min: 0, max: -1 }));
        });
        if (agentData.contacts.length > 0) {
            agentClass.dataClasses.push(contactClass);
        }

        generatedDcat.dataModel.childDataClasses.push(agentClass);
    });

    // Process Recursos Legais (if needed, following the same pattern)
    // This part is left as an exercise if the structure is needed.
    // The logic would be similar to agents and catalogues.

    return generatedDcat;
};


const DistributionsArray = ({ datasetIndex }: { datasetIndex: number }) => {
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: `catalogues.0.datasets.${datasetIndex}.distributions`,
  });

  return (
    <div className={styles.formSection}>
      <h4 className={styles.sectionTitle}>Distribuições para Dataset {datasetIndex + 1}</h4>
      <p className={styles.sectionDescription}>
        Especifique as distribuições para este conjunto de dados.
      </p>
      {fields.map((field, distIndex) => (
        <DistributionFormSection
          key={field.id}
          datasetIndex={datasetIndex}
          distIndex={distIndex}
          removeDistribution={() => remove(distIndex)}
        />
      ))}
      <button
        type="button"
        onClick={() => append({ title: '', description: '', license: '', format: '', modified: '', created: '', accessURL: '', downloadURL: '' })}
        className={styles.addButton}
      >
        Adicionar Distribuição
      </button>
    </div>
  );
};

const CollapsibleSection = ({ title, section, openSection, toggleSection, children }) => (
  <div className={styles.formSection}>
    <h2 className={styles.sectionTitle} onClick={() => toggleSection(section)}>
      {title}
    </h2>
    <div className={`${styles.collapsibleContent} ${openSection === section ? styles.open : ''}`}>
      {children}
    </div>
  </div>
);

const CatalogueFormSection = ({ catalogueIndex, removeCatalogue, niveisAcesso, categorias }) => {
  const { control, register, formState: { errors } } = useFormContext();

  const { fields: datasetFields, append: appendDataset, remove: removeDataset } = useFieldArray({
    control,
    name: `catalogues.${catalogueIndex}.datasets`,
  });

  const { fields: dataServiceFields, append: appendDataService, remove: removeDataService } = useFieldArray({
    control,
    name: `catalogues.${catalogueIndex}.dataServices`,
  });

  return (
    <div className={styles.fieldArrayItem}>
      <div className={styles.fieldArrayHeader}>
        <h3>Catálogo {catalogueIndex + 1}</h3>
        <button type="button" onClick={() => removeCatalogue(catalogueIndex)} className={styles.removeButton}>
          Remover
        </button>
      </div>
      <div className={styles.formGroup}>
        <label htmlFor={`catalogues.${catalogueIndex}.title`} className={styles.label}>
          Título do Catálogo
        </label>
        <input
          id={`catalogues.${catalogueIndex}.title`}
          {...register(`catalogues.${catalogueIndex}.title` as const, { required: 'O título é obrigatório' })}
          className={styles.input}
          placeholder="Ex: Catálogo de Dados Abertos da Cidade"
        />
        {errors.catalogues?.[catalogueIndex]?.title && <p className={styles.errorMessage}>{errors.catalogues[catalogueIndex].title.message}</p>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor={`catalogues.${catalogueIndex}.description`} className={styles.label}>
          Descrição do Catálogo
        </label>
        <textarea
          id={`catalogues.${catalogueIndex}.description`}
          {...register(`catalogues.${catalogueIndex}.description` as const, { required: 'A descrição é obrigatória' })}
          className={styles.input}
          placeholder="Ex: Este catálogo contém dados abertos sobre a cidade..."
          rows={4}
        />
        {errors.catalogues?.[catalogueIndex]?.description && <p className={styles.errorMessage}>{errors.catalogues[catalogueIndex].description.message}</p>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor={`catalogues.${catalogueIndex}.language`} className={styles.label}>
          Idioma do Catálogo (ISO 639-2)
        </label>
        <input
          id={`catalogues.${catalogueIndex}.language`}
          {...register(`catalogues.${catalogueIndex}.language` as const)}
          className={styles.input}
          placeholder="Ex: por (Português)"
        />
        {errors.catalogues?.[catalogueIndex]?.language && <p className={styles.errorMessage}>{errors.catalogues[catalogueIndex].language.message}</p>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor={`catalogues.${catalogueIndex}.modified`} className={styles.label}>
          Data de Modificação
        </label>
        <input
          id={`catalogues.${catalogueIndex}.modified`}
          type="date"
          {...register(`catalogues.${catalogueIndex}.modified` as const, { required: 'A data de modificação é obrigatória' })}
          className={styles.input}
        />
        {errors.catalogues?.[catalogueIndex]?.modified && <p className={styles.errorMessage}>{errors.catalogues[catalogueIndex].modified.message}</p>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor={`catalogues.${catalogueIndex}.homepage`} className={styles.label}>
          Homepage do Catálogo (URL)
        </label>
        <input
          id={`catalogues.${catalogueIndex}.homepage`}
          type="url"
          {...register(`catalogues.${catalogueIndex}.homepage` as const)}
          className={styles.input}
          placeholder="https://dados.gov.pt/catalogo"
        />
        {errors.catalogues?.[catalogueIndex]?.homepage && <p className={styles.errorMessage}>{errors.catalogues[catalogueIndex].homepage.message}</p>}
      </div>

      {/* Datasets within Catalogue */}
      <div className={styles.nestedFormSection}>
        <h4 className={styles.nestedSectionTitle}>Conjuntos de Dados (Datasets)</h4>
        <p className={styles.sectionDescription}>
          Especifique os conjuntos de dados que pertencem a este catálogo.
        </p>
        {datasetFields.map((field, datasetIndex) => (
          <div key={field.id} className={styles.fieldArrayItem}>
            <div className={styles.fieldArrayHeader}>
              <h3>Dataset {datasetIndex + 1}</h3>
              <button type="button" onClick={() => removeDataset(datasetIndex)} className={styles.removeButton}>
                Remover
              </button>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor={`catalogues.${catalogueIndex}.datasets.${datasetIndex}.id`} className={styles.label}>
                ID do Dataset
              </label>
              <input
                id={`catalogues.${catalogueIndex}.datasets.${datasetIndex}.id`}
                {...register(`catalogues.${catalogueIndex}.datasets.${datasetIndex}.id` as const)}
                className={styles.input}
                placeholder="Ex: dataset-001"
              />
              {errors.catalogues?.[catalogueIndex]?.datasets?.[datasetIndex]?.id && <p className={styles.errorMessage}>{errors.catalogues[catalogueIndex].datasets[datasetIndex].id.message}</p>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor={`catalogues.${catalogueIndex}.datasets.${datasetIndex}.title`} className={styles.label}>
                Título do Dataset
              </label>
              <input
                id={`catalogues.${catalogueIndex}.datasets.${datasetIndex}.title`}
                {...register(`catalogues.${catalogueIndex}.datasets.${datasetIndex}.title` as const, { required: 'O título do dataset é obrigatório' })}
                className={styles.input}
                placeholder="Ex: Dados de População por Concelho"
              />
              {errors.catalogues?.[catalogueIndex]?.datasets?.[datasetIndex]?.title && <p className={styles.errorMessage}>{errors.catalogues[catalogueIndex].datasets[datasetIndex].title.message}</p>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor={`catalogues.${catalogueIndex}.datasets.${datasetIndex}.description`} className={styles.label}>
                Descrição do Dataset
              </label>
              <textarea
                id={`catalogues.${catalogueIndex}.datasets.${datasetIndex}.description`}
                {...register(`catalogues.${catalogueIndex}.datasets.${datasetIndex}.description` as const, { required: 'A descrição do dataset é obrigatória' })}
                className={styles.input}
                placeholder="Ex: Este conjunto de dados contém informações demográficas..."
                rows={4}
              />
              {errors.catalogues?.[catalogueIndex]?.datasets?.[datasetIndex]?.description && <p className={styles.errorMessage}>{errors.catalogues[catalogueIndex].datasets[datasetIndex].description.message}</p>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor={`catalogues.${catalogueIndex}.datasets.${datasetIndex}.access`} className={styles.label}>
                Nível de Acesso
              </label>
              <select
                id={`catalogues.${catalogueIndex}.datasets.${datasetIndex}.access`}
                {...register(`catalogues.${catalogueIndex}.datasets.${datasetIndex}.access` as const, { required: 'O nível de acesso é obrigatório' })}
                className={styles.select}
              >
                <option value="">Selecione um nível de acesso</option>
                {niveisAcesso.map((option: any) => (
                  <option key={option.key} value={option.value}>
                    {option.value}
                  </option>
                ))}
              </select>
              {errors.catalogues?.[catalogueIndex]?.datasets?.[datasetIndex]?.access && <p className={styles.errorMessage}>{errors.catalogues[catalogueIndex].datasets[datasetIndex].access.message}</p>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor={`catalogues.${catalogueIndex}.datasets.${datasetIndex}.category`} className={styles.label}>
                Categoria
              </label>
              <select
                id={`catalogues.${catalogueIndex}.datasets.${datasetIndex}.category`}
                {...register(`catalogues.${catalogueIndex}.datasets.${datasetIndex}.category` as const, { required: 'A categoria é obrigatória' })}
                className={styles.select}
              >
                <option value="">Selecione uma categoria</option>
                {categorias.map((option: any) => (
                  <option key={option.key} value={option.value}>
                    {option.value}
                  </option>
                ))}
              </select>
              {errors.catalogues?.[catalogueIndex]?.datasets?.[datasetIndex]?.category && <p className={styles.errorMessage}>{errors.catalogues[catalogueIndex].datasets[datasetIndex].category.message}</p>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor={`catalogues.${catalogueIndex}.datasets.${datasetIndex}.version`} className={styles.label}>
                Versão
              </label>
              <input
                id={`catalogues.${catalogueIndex}.datasets.${datasetIndex}.version`}
                type="number"
                step="0.1"
                {...register(`catalogues.${catalogueIndex}.datasets.${datasetIndex}.version` as const, { required: 'A versão é obrigatória', valueAsNumber: true })}
                className={styles.input}
                placeholder="Ex: 1.0"
              />
              {errors.catalogues?.[catalogueIndex]?.datasets?.[datasetIndex]?.version && <p className={styles.errorMessage}>{errors.catalogues[catalogueIndex].datasets[datasetIndex].version.message}</p>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor={`catalogues.${catalogueIndex}.datasets.${datasetIndex}.modified`} className={styles.label}>
                Data de Modificação
              </label>
              <input
                id={`catalogues.${catalogueIndex}.datasets.${datasetIndex}.modified`}
                type="date"
                {...register(`catalogues.${catalogueIndex}.datasets.${datasetIndex}.modified` as const, { required: 'A data de modificação é obrigatória' })}
                className={styles.input}
              />
              {errors.catalogues?.[catalogueIndex]?.datasets?.[datasetIndex]?.modified && <p className={styles.errorMessage}>{errors.catalogues[catalogueIndex].datasets[datasetIndex].modified.message}</p>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor={`catalogues.${catalogueIndex}.datasets.${datasetIndex}.language`} className={styles.label}>
                Idioma do Dataset
              </label>
              <input
                id={`catalogues.${catalogueIndex}.datasets.${datasetIndex}.language`}
                {...register(`catalogues.${catalogueIndex}.datasets.${datasetIndex}.language` as const)}
                className={styles.input}
                placeholder="Ex: por"
              />
              {errors.catalogues?.[catalogueIndex]?.datasets?.[datasetIndex]?.language && <p className={styles.errorMessage}>{errors.catalogues[catalogueIndex].datasets[datasetIndex].language.message}</p>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor={`catalogues.${catalogueIndex}.datasets.${datasetIndex}.keyword`} className={styles.label}>
                Etiquetas (separadas por vírgula)
              </label>
              <input
                id={`catalogues.${catalogueIndex}.datasets.${datasetIndex}.keyword`}
                {...register(`catalogues.${catalogueIndex}.datasets.${datasetIndex}.keyword` as const)}
                className={styles.input}
                placeholder="Ex: população, demografia, censos"
              />
              {errors.catalogues?.[catalogueIndex]?.datasets?.[datasetIndex]?.keyword && <p className={styles.errorMessage}>{errors.catalogues[catalogueIndex].datasets[datasetIndex].keyword.message}</p>}
            </div>

            <DistributionsArray datasetIndex={datasetIndex} />
          </div>
        ))}

        <button
          type="button"
          onClick={() => appendDataset({
            id: '',
            title: '',
            description: '',
            access: '',
            category: '',
            version: 0,
            modified: '',
            language: '',
            keyword: '',
            distributions: [{
              title: '',
              description: '',
              license: '',
              format: '',
              modified: '',
              created: '',
              accessURL: '',
              downloadURL: '',
            }],
          })}
          className={styles.addButton}
        >
          Adicionar Dataset
        </button>
      </div>

      {/* DataServices within Catalogue */}
      <div className={styles.nestedFormSection}>
        <h4 className={styles.nestedSectionTitle}>Serviços de Dados (DataServices)</h4>
        <p className={styles.sectionDescription}>
          Especifique os serviços de dados associados a este catálogo.
        </p>

        {dataServiceFields.map((field, dataServiceIndex) => (
          <div key={field.id} className={styles.fieldArrayItem}>
            <div className={styles.fieldArrayHeader}>
              <h3>DataService {dataServiceIndex + 1}</h3>
              <button type="button" onClick={() => removeDataService(dataServiceIndex)} className={styles.removeButton}>
                Remover
              </button>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor={`catalogues.${catalogueIndex}.dataServices.${dataServiceIndex}.title`} className={styles.label}>
                Título do Serviço de Dados
              </label>
              <input
                id={`catalogues.${catalogueIndex}.dataServices.${dataServiceIndex}.title`}
                {...register(`catalogues.${catalogueIndex}.dataServices.${dataServiceIndex}.title` as const, { required: 'O título do serviço de dados é obrigatório' })}
                className={styles.input}
                placeholder="Ex: API de Dados Meteorológicos"
              />
              {errors.catalogues?.[catalogueIndex]?.dataServices?.[dataServiceIndex]?.title && <p className={styles.errorMessage}>{errors.catalogues[catalogueIndex].dataServices[dataServiceIndex].title.message}</p>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor={`catalogues.${catalogueIndex}.dataServices.${dataServiceIndex}.downloadURL`} className={styles.label}>
                URL de Download/Endpoint
              </label>
              <input
                id={`catalogues.${catalogueIndex}.dataServices.${dataServiceIndex}.downloadURL`}
                type="url"
                {...register(`catalogues.${catalogueIndex}.dataServices.${dataServiceIndex}.downloadURL` as const)}
                className={styles.input}
                placeholder="https://api.example.com/weather"
              />
              {errors.catalogues?.[catalogueIndex]?.dataServices?.[dataServiceIndex]?.downloadURL && <p className={styles.errorMessage}>{errors.catalogues[catalogueIndex].dataServices[dataServiceIndex].downloadURL.message}</p>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor={`catalogues.${catalogueIndex}.dataServices.${dataServiceIndex}.license`} className={styles.label}>
                Licença
              </label>
              <input
                id={`catalogues.${catalogueIndex}.dataServices.${dataServiceIndex}.license`}
                {...register(`catalogues.${catalogueIndex}.dataServices.${dataServiceIndex}.license` as const, { required: 'A licença é obrigatória' })}
                className={styles.input}
                placeholder="Ex: Creative Commons Attribution 4.0 International"
              />
              {errors.catalogues?.[catalogueIndex]?.dataServices?.[dataServiceIndex]?.license && <p className={styles.errorMessage}>{errors.catalogues[catalogueIndex].dataServices[dataServiceIndex].license.message}</p>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor={`catalogues.${catalogueIndex}.dataServices.${dataServiceIndex}.description`} className={styles.label}>
                Descrição do Serviço de Dados
              </label>
              <textarea
                id={`catalogues.${catalogueIndex}.dataServices.${dataServiceIndex}.description`}
                {...register(`catalogues.${catalogueIndex}.dataServices.${dataServiceIndex}.description` as const, { required: 'A descrição do serviço de dados é obrigatória' })}
                className={styles.input}
                placeholder="Ex: Este serviço fornece acesso a dados meteorológicos em tempo real."
                rows={4}
              />
              {errors.catalogues?.[catalogueIndex]?.dataServices?.[dataServiceIndex]?.description && <p className={styles.errorMessage}>{errors.catalogues[catalogueIndex].dataServices[dataServiceIndex].description.message}</p>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor={`catalogues.${catalogueIndex}.dataServices.${dataServiceIndex}.access`} className={styles.label}>
                Nível de Acesso
              </label>
              <select
                id={`catalogues.${catalogueIndex}.dataServices.${dataServiceIndex}.access`}
                {...register(`catalogues.${catalogueIndex}.dataServices.${dataServiceIndex}.access` as const, { required: 'O nível de acesso é obrigatório' })}
                className={styles.select}
              >
                <option value="">Selecione um nível de acesso</option>
                {niveisAcesso.map((option: any) => (
                  <option key={option.key} value={option.value}>
                    {option.value}
                  </option>
                ))}
              </select>
              {errors.catalogues?.[catalogueIndex]?.dataServices?.[dataServiceIndex]?.access && <p className={styles.errorMessage}>{errors.catalogues[catalogueIndex].dataServices[dataServiceIndex].access.message}</p>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor={`catalogues.${catalogueIndex}.dataServices.${dataServiceIndex}.format`} className={styles.label}>
                Formato
              </label>
              <input
                id={`catalogues.${catalogueIndex}.dataServices.${dataServiceIndex}.format`}
                {...register(`catalogues.${catalogueIndex}.dataServices.${dataServiceIndex}.format` as const, { required: 'O formato é obrigatório' })}
                className={styles.input}
                placeholder="Ex: JSON, XML"
              />
              {errors.catalogues?.[catalogueIndex]?.dataServices?.[dataServiceIndex]?.format && <p className={styles.errorMessage}>{errors.catalogues[catalogueIndex].dataServices[dataServiceIndex].format.message}</p>}
            </div>
          </div>
        ))}
        <button type="button" onClick={() => appendDataService({ title: '', downloadURL: '', license: '', description: '', access: '', format: '' })} className={styles.addButton}>
          Adicionar Serviço de Dados
        </button>
      </div>
    </div>
  );
};

export default function SubmitPage() {
  const [openSection, setOpenSection] = useState<string | null>('catalogues');
  const router = useRouter();

  const methods = useForm<FormValues>({
    defaultValues: {
      catalogues: [{
        title: '',
        description: '',
        language: '',
        modified: '',
        homepage: '',
        datasets: [{
          id: '',
          title: '',
          description: '',
          access: '',
          category: '',
          version: 0,
          modified: '',
          language: '',
          keyword: '',
          distributions: [{
            title: '',
            description: '',
            license: '',
            format: '',
            modified: '',
            created: '',
            accessURL: '',
            downloadURL: '',
          }],
        }],
        dataServices: [{
          title: '',
          downloadURL: '',
          license: '',
          description: '',
          access: '',
          format: '',
        }],
      }],
      agents: [{
        name: '',
        description: '',
        url: '',
        id: '',
        contacts: [{
          mail: '',
          phone: '',
        }],
      }],
      recursosLegais: [{
        jurisdiction: '',
        legalAct: '',
        agents: [{
          name: '',
          description: '',
          url: '',
          id: '',
          contacts: [{
            mail: '',
            phone: '',
          }],
        }],
      }],
    },
  });

  const { handleSubmit, control } = methods;

  const { fields: catalogueFields, append: appendCatalogue, remove: removeCatalogue } = useFieldArray({
    control,
    name: 'catalogues',
  });

  const { fields: agentFields, append: appendAgent, remove: removeAgent } = useFieldArray({
    control,
    name: 'agents',
  });

  const { fields: recursoLegalFields, append: appendRecursoLegal, remove: removeRecursoLegal } = useFieldArray({
    control,
    name: 'recursosLegais',
  });

  const niveisAcesso = dcatTemplate.dataModel.dataTypes.find((dt: any) => dt.label === 'Níveis_Acesso')?.enumerationValues || [];
  const categorias = dcatTemplate.dataModel.dataTypes.find((dt: any) => dt.label === 'Categoria')?.enumerationValues || [];
  const tiposActoJuridico = dcatTemplate.find((dt: any) => dt.label === 'Tipo_Acto_Jurídico')?.enumerationValues || [];

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    console.log('Form data:', data);
    const generatedDcat = generateDcatJson(data);
    console.log('Generated DCAT-AP_PT JSON:', JSON.stringify(generatedDcat, null, 2));
    // Here you would typically send the data to a server
  };

  const handleGoBack = () => {
    router.push('/menu');
  };

  const handleDownloadJson = () => {
    try {
      const data = methods.getValues();
      const generatedDcat = generateDcatJson(data);
      const json = JSON.stringify(generatedDcat, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'dcat-ap-pt.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download JSON:", error);
      alert("Failed to generate JSON. Check console for details.");
    }
  };

  return (
    <ProtectedRoute>
      <div className={styles.submitContainer}>
        <button onClick={handleGoBack} className={styles.backButton}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
        </button>
        <header className={styles.header}>
          <h1 className={styles.title}>Submeter Novo Formulário</h1>
          <p className={styles.subtitle}>
            Preencha os campos para gerar os metadados no formato DCAT-AP_PT.
          </p>
        </header>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            <CollapsibleSection title="Catálogos" section="catalogues" openSection={openSection} toggleSection={toggleSection}>
              <p className={styles.sectionDescription}>
                Especifique a quantidade de catálogos e preencha as informações para cada um.
              </p>
              {catalogueFields.map((field, index) => (
                <CatalogueFormSection
                  key={field.id}
                  catalogueIndex={index}
                  removeCatalogue={removeCatalogue}
                  niveisAcesso={niveisAcesso}
                  categorias={categorias}
                />
              ))}
              <button type="button" onClick={() => appendCatalogue({ title: '', description: '', language: '', modified: '', homepage: '', datasets: [], dataServices: [] })} className={styles.addButton}>
                Adicionar Catálogo
              </button>
            </CollapsibleSection>

            <CollapsibleSection title="Agentes" section="agents" openSection={openSection} toggleSection={toggleSection}>
              <p className={styles.sectionDescription}>
                Especifique os agentes (pessoas ou organizações) envolvidos.
              </p>
              {agentFields.map((field, index) => (
                <AgentFormSection
                  key={field.id}
                  parentFieldName="agents"
                  agentIndex={index}
                  removeAgent={removeAgent}
                />
              ))}
              <button type="button" onClick={() => appendAgent({ name: '', description: '', url: '', id: '', contacts: [{ mail: '', phone: '' }] })} className={styles.addButton}>
                Adicionar Agente
              </button>
            </CollapsibleSection>

            <CollapsibleSection title="Recursos Legais" section="recursosLegais" openSection={openSection} toggleSection={toggleSection}>
              <p className={styles.sectionDescription}>
                Especifique os recursos legais associados.
              </p>
              {recursoLegalFields.map((field, index) => (
                <RecursoLegalFormSection
                  key={field.id}
                  recursoLegalIndex={index}
                  removeRecursoLegal={removeRecursoLegal}
                  tiposActoJuridico={tiposActoJuridico}
                />
              ))}
              <button type="button" onClick={() => appendRecursoLegal({ jurisdiction: '', legalAct: '', agents: [{ name: '', description: '', url: '', id: '', contacts: [{ mail: '', phone: '' }] }] })} className={styles.addButton}>
                Adicionar Recurso Legal
              </button>
            </CollapsibleSection>

            <div className={styles.formActions}>
              <button type="submit" className={styles.submitButton}>
                Gerar e Submeter
              </button>
              <button type="button" onClick={handleDownloadJson} className={styles.submitButton}>
                Extrair JSON
              </button>
            </div>
          </form>
        </FormProvider>
      </div>
    </ProtectedRoute>
  );
}