import {SymptomLocation} from 'src/model/interfaces';

export const SYMPTOM_LOCATIONS: SymptomLocation[] = [
  {
    name: 'eye',
    sct: '81745001',
    image: 'eye.json',
    defaultCoding: {
      system: 'http://snomed.info/sct',
      code: '81745001',
      display: 'Eye'
    }
  },
  {
    name: 'nose',
    sct: '45206002',
    image: 'nose.json',
    defaultCoding: {
      system: 'http://snomed.info/sct',
      code: '45206002',
      display: 'Nose'
    }
  },
  {
    name: 'mouth',
    sct: '312533001',
    image: 'throat.json',
    defaultCoding: {
      system: 'http://snomed.info/sct',
      code: '312533001',
      display: 'Structure of mouth and/or pharynx'
    }
  },
  {
    name: 'lung',
    sct: '39607008',
    image: 'lung.json',
    defaultCoding: {
      system: 'http://snomed.info/sct',
      code: '39607008',
      display: 'Lung'
    }
  },
  {
    name: 'skin',
    sct: '39937001',
    image: 'skin.json',
    defaultCoding: {
      system: 'http://snomed.info/sct',
      code: '39937001',
      display: 'Skin'
    }
  },
  {
    name: 'gastro',
    sct: '122865005',
    image: 'digestive.json',
    defaultCoding: {
      system: 'http://snomed.info/sct',
      code: '122865005',
      display: 'Gastrointestinal tract'
    }
  }
];
