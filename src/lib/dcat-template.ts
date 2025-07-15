export interface EnumerationValue {
  key: string;
  value: string;
}

export interface DataType {
  label: string;
  enumerationValues?: EnumerationValue[];
}

export const dcatTemplate: {
  dataModel: {
    label: string;
    description: string;
    dataTypes: DataType[];
    childDataClasses: unknown[];
  };
} = {
  dataModel: {
    label: '',
    description: '',
    dataTypes: [
      {
        label: 'Níveis_Acesso',
        enumerationValues: [
          { key: 'public', value: 'Público' },
          { key: 'restricted', value: 'Restrito' },
          { key: 'private', value: 'Privado' },
        ],
      },
      {
        label: 'Categoria',
        enumerationValues: [
            { key: 'demografia', value: 'Demografia' },
            { key: 'educacao', value: 'Educação' },
            { key: 'saude', value: 'Saúde' },
        ],
      },
      {
        label: 'Tipo_Acto_Jurídico',
        enumerationValues: [
            { key: 'lei', value: 'Lei' },
            { key: 'decreto', value: 'Decreto' },
            { key: 'regulamento', value: 'Regulamento' },
        ],
      },
      {
        label: 'String',
      },
      {
        label: 'Text',
      },
      {
        label: 'Date',
      },
      {
        label: 'Decimal',
      },
    ],
    childDataClasses: [],
  },
};