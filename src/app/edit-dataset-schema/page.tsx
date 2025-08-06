'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import styles from './edit-dataset-schema.module.css';
import { modelsAPI } from '@/lib/api';

export default function EditDatasetSchemaPage() {
  const router = useRouter();
  const [dataModels, setDataModels] = useState<any[]>([]);
  const [selectedDataModel, setSelectedDataModel] = useState<string>('');
  const [catalogues, setCatalogues] = useState<any[]>([]);
  const [selectedCatalogue, setSelectedCatalogue] = useState<string>('');
  const [datasets, setDatasets] = useState<any[]>([]);
  const [selectedDataset, setSelectedDataset] = useState<string>('');
  const [schema, setSchema] = useState<any[]>([]);
  const [schemaDataClassId, setSchemaDataClassId] = useState<string>('');
  const [dataTypes, setDataTypes] = useState<any[]>([]);
  const [popup, setPopup] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const defaultSchemaRow = () => ({
    label: '',
    description: '',
    dataType: { id: dataTypes.length > 0 ? dataTypes[0].id : '', label: dataTypes.length > 0 ? dataTypes[0].label : '' },
  });

  useEffect(() => {
    async function fetchDataModels() {
      try {
        const folderId = process.env.NEXT_PUBLIC_MDM_DATAMODELS_FOLDER_ID;
        if (!folderId) {
          console.error('NEXT_PUBLIC_MDM_DATAMODELS_FOLDER_ID is not defined');
          return;
        }
        const response = await modelsAPI.getFromFolder(folderId);
        setDataModels(response.items || []);
      } catch (error: any) {
        console.error('Failed to fetch data models:', error.response?.data || error.message);
      }
    }
    fetchDataModels();
  }, []);

  useEffect(() => {
    if (selectedDataModel) {
      async function fetchCatalogues() {
        try {
          const response = await modelsAPI.listDataClasses(selectedDataModel);
          setCatalogues(response.items.filter((item: any) => item.label.startsWith('Catálogo')) || []);
        } catch (error: any) {
          console.error('Failed to fetch catalogues:', error.response?.data || error.message);
        }
      }
      fetchCatalogues();
    } else {
      setCatalogues([]);
      setSelectedCatalogue('');
    }
  }, [selectedDataModel]);

  useEffect(() => {
    if (selectedCatalogue) {
      async function fetchDatasets() {
        try {
          const response = await modelsAPI.listChildDataClasses(selectedDataModel, selectedCatalogue);
          setDatasets(response.items.filter((item: any) => item.label.startsWith('Dataset')) || []);
        } catch (error: any) {
          console.error('Failed to fetch datasets:', error.response?.data || error.message);
        }
      }
      fetchDatasets();
    } else {
      setDatasets([]);
      setSelectedDataset('');
    }
  }, [selectedCatalogue, selectedDataModel]);

  useEffect(() => {
    async function fetchSchemaAndDataTypes() {
      if (selectedDataset) {
        try {
          const dataTypesResponse = await modelsAPI.getDataTypesFromModel(selectedDataModel);
          setDataTypes(dataTypesResponse.items || []);

          const selectedDatasetObject = datasets.find(d => d.id === selectedDataset);
          const datasetName = selectedDatasetObject ? selectedDatasetObject.label.replace('Dataset - ', '') : '';
          const schemaLabel = `Schema - ${datasetName}`;

          const childDataClasses = await modelsAPI.listChildDataClasses(selectedDataModel, selectedDataset);
          const schemaDataClass = (childDataClasses.items || []).find((item: any) => item.label === schemaLabel);

          if (schemaDataClass) {
            setSchemaDataClassId(schemaDataClass.id);
            // Use the new listDataElements function to get the schema's fields
            const response = await modelsAPI.listDataElements(selectedDataModel, schemaDataClass.id);
            const existingSchema = response.items || []; // The elements are in the 'items' property
            setSchema(existingSchema.length > 0 ? existingSchema : [defaultSchemaRow()]);
          } else {
            setSchema([defaultSchemaRow()]);
            setSchemaDataClassId('');
          }
        } catch (error: any) {
          if (error.response?.status === 404) {
            setSchema([defaultSchemaRow()]);
            setSchemaDataClassId('');
          } else {
            console.error('Failed to fetch schema or data types:', error.response?.data || error.message);
            setPopup({ message: 'Falha ao carregar o esquema ou tipos de dados.', type: 'error' });
          }
        }
      } else {
        setSchema([]);
        setSchemaDataClassId('');
      }
    }
    fetchSchemaAndDataTypes();
  }, [selectedDataset, selectedDataModel, datasets]);

  const handleGoBack = () => router.push('/menu');

  const handleSchemaChange = (index: number, field: string, value: any) => {
    const newSchema = [...schema];
    if (field === 'dataType') {
      newSchema[index].dataType = value;
    } else {
      newSchema[index][field] = value;
    }
    setSchema(newSchema);
  };

  const handleAddField = (index: number) => {
    const newSchema = [...schema];
    newSchema.splice(index + 1, 0, defaultSchemaRow());
    setSchema(newSchema);
  };

  const handleRemoveField = (index: number) => {
    const newSchema = [...schema];
    newSchema.splice(index, 1);
    setSchema(newSchema);
  };

  const handleSubmit = async () => {
    try {
      let currentSchemaId = schemaDataClassId;
      const selectedDatasetObject = datasets.find(d => d.id === selectedDataset);
      const datasetName = selectedDatasetObject ? selectedDatasetObject.label.replace('Dataset - ', '') : '';
      const schemaLabel = `Schema - ${datasetName}`;

      // First, check if the schema data class already exists to avoid creating a duplicate.
      const childDataClasses = await modelsAPI.listChildDataClasses(selectedDataModel, selectedDataset);
      const existingSchema = (childDataClasses.items || []).find((item: any) => item.label === schemaLabel);

      if (existingSchema) {
        currentSchemaId = existingSchema.id;
        if (currentSchemaId !== schemaDataClassId) {
          setSchemaDataClassId(currentSchemaId);
        }
      } else {
        // If it does not exist, create it.
        const newSchemaDataClass = await modelsAPI.createChildDataClass(selectedDataModel, selectedDataset, {
          label: schemaLabel,
          description: `Schema for the ${datasetName} dataset`,
          minMultiplicity: 1,
          maxMultiplicity: 1,
        });
        currentSchemaId = newSchemaDataClass.id;
        setSchemaDataClassId(currentSchemaId);
      }

      if (!currentSchemaId) {
        throw new Error('Could not find or create a schema data class.');
      }

      for (const element of schema) {
        if (!element.label || !element.dataType?.id) {
          continue; // Skip empty or incomplete rows
        }

        const payload = {
          label: element.label,
          description: element.description,
          dataType: element.dataType.id,
          minMultiplicity: '0',
          maxMultiplicity: '1',
        };

        if (element.id) {
          await modelsAPI.updateDataElement(selectedDataModel, currentSchemaId, element.id, payload);
        } else {
          await modelsAPI.createDataElement(selectedDataModel, currentSchemaId, payload);
        }
      }

      setPopup({ message: 'Esquema atualizado com sucesso!', type: 'success' });

      // Try to refetch the schema to get the latest state with new IDs.
      // If this fails, we log the error but don't show an error popup to the user,
      // as the submission itself was successful.
      try {
        const response = await modelsAPI.getDataClassById(selectedDataModel, currentSchemaId);
        const existingSchemaElements = response.dataElements || [];
        setSchema(existingSchemaElements.length > 0 ? existingSchemaElements : [defaultSchemaRow()]);
      } catch (refetchError: any) {
        console.error('Failed to refetch schema after update, but submission was successful:', refetchError);
      }

    } catch (error: any) {
      const rawErrorMessage = error.response?.data ? JSON.stringify(error.response.data) : error.message || 'An unknown error occurred.';
      console.error('Failed to update schema:', rawErrorMessage);

      if (rawErrorMessage.includes('Property [label]') && rawErrorMessage.includes('must be unique')) {
        setPopup({ message: 'Um elemento com o mesmo nome já pertence ao schema', type: 'error' });
      } else {
        setPopup({ message: `Falha ao atualizar o esquema: ${rawErrorMessage}`, type: 'error' });
      }
    }
  };

  return (
    <ProtectedRoute>
      <div className={styles.container}>
        <button onClick={handleGoBack} className={styles.backButton}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
        </button>
        <header className={styles.header}>
          <h1 className={styles.title}>Editar Esquemas de Conjuntos de Dados</h1>
          <p className={styles.subtitle}>Selecione um modelo de dados e um catálogo para editar os esquemas dos conjuntos de dados.</p>
        </header>

        {/* Dropdowns for selection */}
        <div className={styles.formGroup}>
          <label htmlFor="dataModel" className={styles.label}>Modelo de Dados</label>
          <div className={styles.selectWrapper}>
            <select id="dataModel" value={selectedDataModel} onChange={(e) => setSelectedDataModel(e.target.value)} className={styles.select}>
              <option value="">Selecione um modelo de dados</option>
              {dataModels.map((model) => <option key={model.id} value={model.id}>{model.label}</option>)}
            </select>
          </div>
        </div>

        {selectedDataModel && (
          <div className={styles.formGroup}>
            <label htmlFor="catalogue" className={styles.label}>Catálogo</label>
            <div className={styles.selectWrapper}>
              <select id="catalogue" value={selectedCatalogue} onChange={(e) => setSelectedCatalogue(e.target.value)} className={styles.select}>
                <option value="">Selecione um catálogo</option>
                {catalogues.map((catalogue) => <option key={catalogue.id} value={catalogue.id}>{catalogue.label.replace('Catálogo - ', '')}</option>)}
              </select>
            </div>
          </div>
        )}

        {selectedCatalogue && (
          <div className={styles.formGroup}>
            <label htmlFor="dataset" className={styles.label}>Conjunto de Dados</label>
            <div className={styles.selectWrapper}>
              <select id="dataset" value={selectedDataset} onChange={(e) => setSelectedDataset(e.target.value)} className={styles.select}>
                <option value="">Selecione um conjunto de dados</option>
                {datasets.map((dataset) => <option key={dataset.id} value={dataset.id}>{dataset.label.replace('Dataset - ', '')}</option>)}
              </select>
            </div>
          </div>
        )}

        {selectedDataset && (
          <div>
            <h2 className={styles.sectionTitle}>Esquema do Conjunto de Dados</h2>
            <table className={styles.schemaTable}>
              <thead>
                <tr>
                  <th>Rótulo</th>
                  <th>Descrição</th>
                  <th>Tipo de Dados</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {schema.map((element, index) => (
                  <tr key={element.id || index}>
                    <td>
                      <input type="text" value={element.label} onChange={(e) => handleSchemaChange(index, 'label', e.target.value)} className={styles.transparentInput} />
                    </td>
                    <td>
                      <input type="text" value={element.description} onChange={(e) => handleSchemaChange(index, 'description', e.target.value)} className={styles.transparentInput} />
                    </td>
                    <td>
                      <select value={element.dataType?.id || ''} onChange={(e) => handleSchemaChange(index, 'dataType', dataTypes.find(dt => dt.id === e.target.value))} className={styles.select}>
                        <option value="">Selecione um tipo</option>
                        {dataTypes.map((dt) => <option key={dt.id} value={dt.id}>{dt.label}</option>)}
                      </select>
                    </td>
                    <td className={styles.actionsCell}>
                      <button onClick={() => handleAddField(index)} className={styles.iconButton}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                      </button>
                      {schema.length > 1 && (
                        <button onClick={() => handleRemoveField(index)} className={`${styles.iconButton} ${styles.removeButton}`}>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.067-2.09 1.02-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className={styles.formActions}>
              <button onClick={handleSubmit} className={styles.submitButton}>Guardar Alterações</button>
            </div>
          </div>
        )}

        {popup && (
          <div className={styles.popupOverlay}>
            <div className={`${styles.popup} ${styles[popup.type]}`}>
              <p>{popup.message}</p>
              <button onClick={() => setPopup(null)}>Fechar</button>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
