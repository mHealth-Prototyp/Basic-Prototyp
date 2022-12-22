import {Coding, Medication, Organization} from '@i4mi/fhir_r4';
import {AllergySystemCodeExtension} from '@i4mi/mhealth-proto-components';
import {APP_LANGUAGES} from 'src/boot/i18n';

export interface LoginType {
  username: string;
  password: string;
  phone: string;
  prefix?: string;
  givenName: string;
  familyName: string;
}

export enum UIMessageType {
  SMS = 'sms',
  ERROR = 'error'
}

export interface UIMessage {
  type: UIMessageType;
  title: string;
  text: string;
}

export interface Settings {
  language: APP_LANGUAGES;
  organization: Organization;
  facilityType: Coding;
  practiceSetting: Coding;
}

export enum SymptomIntensity {
  NONE = '260413007', // None (Qualifier value)
  LOW = '255604002', // Mild (Qualifier value)
  MEDIUM = '6736007', // Moderate (severity modifier) (qualifier value)
  HIGH = '24484000' // Severe (severity modifier) (qualifier value)
}

export interface SymptomLocation {
  name: string;
  sct: string;
  image: string;
  defaultCoding: Coding;
}

export interface Symptom {
  intensity: SymptomIntensity;
  location: SymptomLocation;
}

export interface DefaultCoding extends Coding {
  system: string;
  code: string;
  display: string;
}

export interface DiaryEntry {
  date: Date;
  symptoms: Symptom[];
  note?: string;
  allergy?: AllergySystemCodeExtension;
  medications: Medication[];
}

export interface LanguageDisplays {
  en: string;
  de: string;
  fr: string;
  it: string;
  rm: string;
}

export interface Parameter {
  languageDisplays: LanguageDisplays;
  defaultCoding: DefaultCoding;
  unit: {
    unit: string;
    system: string;
    code: string;
  };
  pollen?: {
    icon: string;
    scale: {
      level_1: number[];
      level_2: number[];
      level_3: number[];
    };
  };
}

export interface Station {
  id: string;
  lngLat: number[];
  languageDisplays: LanguageDisplays;
}

export interface Measurement {
  station: string;
  date: number;
  values: {
    parameter: DefaultCoding;
    value: number;
  }[];
}
