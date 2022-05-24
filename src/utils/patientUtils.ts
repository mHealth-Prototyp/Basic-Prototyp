import { Identifier, Organization, Patient, PatientAdministrativeGender } from '@i4mi/fhir_r4';
import { Oids } from 'src/services/storeService';

// TODO: enhance for french and italian part of Switzerland ;-)
const SAMPLE_GIVEN_M = [
  'Daniel', 'Peter', 'Thomas',
  'Hans', 'Christian', 'Martin',
  'Andreas', 'Michael', 'Markus',
  'Marco', 'David', 'Patrick',
  'Stefan', 'Bruno', 'Urs',
  'Walter', 'René', 'Marcel',
  'Roland', 'Simon']; // most common male first names in Switzerland
const SAMPLE_GIVEN_F = [
  'Maria', 'Anna', 'Sandra',
  'Ursula', 'Elisabeth', 'Ruth',
  'Monika', 'Claudia', 'Nicole',
  'Verena', 'Barbara', 'Andrea',
  'Silvia', 'Daniela', 'Marie',
  'Christine', 'Karin', 'Marianne',
  'Laura', 'Sarah']; // most common female first names in Switzerland
const SAMPLE_GIVEN_O = [
  'Sasha', 'Kim', 'Toni', 'Kay', 'Finn', 'Nikita' // some gender neutral names
];
const SAMPLE_FAMILY = [
  'Müller', 'Meier', 'Schmid',
  'Keller', 'Weber', 'Huber',
  'Schneider', 'Meyer', 'Steiner',
  'Fischer', 'Gerber', 'Brunner',
  'Baumann', 'Frei', 'Zimmermann',
  'Moser', 'Widmer', 'Wyss',
  'Graf', 'Roth']; // most common family names in Switzerland
const SAMPLE_STREETS = [
  'Dorfstrasse', 'Hauptstrasse', 'Bahnhofstrasse', 'Birkenweg',
  'Schulstrasse', 'Oberdorfstrasse', 'Kirchweg', 'Industriestrasse',
  'Schulhausstrasse', 'Rosenweg' ]; // most common street names in Switzerland
const SAMPLE_CITIES = [
  {
    name: 'Zürich',
    zip: '8001',
    state: 'ZH',
    weight: 421 // weight is currently ignored
  },
  {
    name: 'Basel',
    zip: '4001',
    state: 'BS',
    weight: 421
  },
  {
    name: 'Bern',
    zip: '3001',
    state: 'BE',
    weight: 421
  },
  {
    name: 'Winterthur',
    zip: '8400',
    state: 'ZH',
    weight: 421
  },
  {
    name: 'Luzern',
    zip: '6001',
    state: 'LU',
    weight: 421
  },
  {
    name: 'St. Gallen',
    zip: '9000',
    state: 'SG',
    weight: 421
  },
  {
    name: 'Biel',
    zip: '2401',
    state: 'BE',
    weight: 421
  },
  {
    name: 'Thun',
    zip: '3600',
    state: 'BE',
    weight: 421
  },
  {
    name: 'Köniz',
    zip: '3098',
    state: 'BE',
    weight: 421
  },
  {
    name: 'Freiburg',
    zip: '1700',
    state: 'FR',
    weight: 421
  },
  {
    name: 'Schaffhausen',
    zip: '8200',
    state: 'SH',
    weight: 421
  },
  {
    name: 'Chur',
    zip: '7000',
    state: 'GB',
    weight: 421
  },
  {
    name: 'Uster',
    zip: '8610',
    state: 'ZH',
    weight: 421
  },
  {
    name: 'Emmen',
    zip: '6032',
    state: 'LU',
    weight: 421
  },
  {
    name: 'Zug',
    zip: '6300',
    state: 'ZG',
    weight: 421
  },
  {
    name: 'Dübendorf',
    zip: '8600',
    state: 'ZH',
    weight: 421
  },
  {
    name: 'Kriens',
    zip: '6010',
    state: 'LU',
    weight: 421
  }
]; // some cities in (german speaking) Switzerland

function getRandomGiven(gender: PatientAdministrativeGender): string {
  switch(gender) {
    case PatientAdministrativeGender.MALE:
      return SAMPLE_GIVEN_M[Math.floor(Math.random() * SAMPLE_GIVEN_M.length)];
    case PatientAdministrativeGender.FEMALE:
      return SAMPLE_GIVEN_F[Math.floor(Math.random() * SAMPLE_GIVEN_F.length)];
    default:
      return SAMPLE_GIVEN_O[Math.floor(Math.random() * SAMPLE_GIVEN_O.length)];;
  }
}

function getRandomFamily(): string {
  return SAMPLE_FAMILY[Math.floor(Math.random() * SAMPLE_FAMILY.length)];
}

function getRandomBirthDate(): string {
  const start = new Date('1920-01-01');
  const end = new Date('2009-12-31');

  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
    .toISOString()
    .substring(0,10);
}

function getRandomCity(): {name: string, zip: string, state: string} {
  return SAMPLE_CITIES[Math.floor(Math.random() * SAMPLE_CITIES.length)];
}

function getRandomStreet(): string {
  return SAMPLE_STREETS[Math.floor(Math.random() * SAMPLE_STREETS.length)] +
         ' ' + Math.ceil((Math.random() * 10)).toString();
}

/**
 * Randomly returns a PatientAdministrative gender, with following distribution:
 *    - male: 47%
 *    - female: 48%
 *    - other: 5%
 * @returns   Either male, female or other as PatientAdministrative gender
 */
function getRandomGender(): PatientAdministrativeGender {
  const rand = Math.random();
  switch (true) {
    case rand < 0.47:
      return PatientAdministrativeGender.MALE
    case rand < 0.95:
      return PatientAdministrativeGender.FEMALE
    default:
      return PatientAdministrativeGender.OTHER
  }
}

/**
 * Generates a pseudo EPR SPID
 * @param   id: an unique input as base for generating the EPR SPID,
 *              with exactly 9 digits
 * @returns     a string that is formed like a valid EPR SPID, based
 *              on the input id
 * @throws      an Error if the given id does not have exactly 9 digits
 */
export function generateEprSpid(id: string): string {
  if (id.length !== 9) {
    throw new Error('ID must be exactly 9 digits. (is: ' + id + ')');
  }
  const COUNTRY_CODE_CH = '76';
  const PARTICIPANT_CODE_BAG = '13376';
  const PURPOSE_CODE_EPD = '1';
  let spid = COUNTRY_CODE_CH + PARTICIPANT_CODE_BAG + PURPOSE_CODE_EPD + id;

  // calculate checksum according to
  // https://www.fedlex.admin.ch/eli/cc/2017/205/de#annex_1
  let sum = 0;
  for (let i = spid.length - 1; i >= 0; i--) {
    sum += (i % 2 === 0)
      ? parseInt(spid[i]) * 3
      : parseInt(spid[i])
  }
  spid += (10 - (sum % 10));
  return spid.toString();
}

/**
 * Generates a random AHV number.
 * @param ahvOid  the OID for the AHV system
 * @returns       AHV number as Identifier with AHV OID
 */
function generateAhvIdentifier(ahvOid: string): Identifier {
  const numbers = new Array<number>();
  let checksum = 28; // checksum for the 756 part
  let numberString = '756.';
  for(let i = 0; i < 9; i++) {
    const digit = Math.floor(Math.random() * 9.999);
    numbers.push(digit);
    numberString += digit.toString();
    if (i === 3 || i === 7) {
      numberString += '.';
    }
    checksum += digit % 2 === 0
      ? 3 * digit
      : digit;
  }
  return {
    system: ahvOid,
    value: numberString + (10 - (checksum % 10)).toString()
  }
}

/**
 * Creates a random patient, based on the data above.
 * @returns   a Patient resource with typical swiss data,
 *            a random local id and the Klinik Höheweg
 *            as managing organization.
 */
export function generateRandomPatient(organization: Organization, oids: Oids): Patient {
  const patID =  Date.now().toString().substring(6,13) + Math.floor(Math.random() * 10).toString() + Math.floor(Math.random() * 10).toString();
  const patGender = getRandomGender();
  const city = getRandomCity();
  organization.id = organization.id || '1';
  if (!organization.identifier || organization.identifier.length === 0) {
    organization.identifier = [
      {
        system: oids.local
      }
    ];
  }
  const patient = {
    resourceType: 'Patient',
    id: patID,
    identifier: [
      {
        system: organization.identifier[0].system, // ID of local clinic
        value: 'PAT-' + patID
      }
    ],
    active: true,
    name: [
      {
        family: getRandomFamily(),
        given: [
          getRandomGiven(patGender)
        ]
      }
    ],
    gender: patGender,
    birthDate: getRandomBirthDate(),
    address: [
      {
        line: [getRandomStreet()],
        city: city.name,
        postalCode: city.zip,
        state: city.state,
        country: 'Switzerland'
      }
    ],
    contained: [ organization ],
    managingOrganization: {
      reference: '#' + organization.id
    }
  } as Patient;
  patient.identifier?.push(generateAhvIdentifier(oids.ahv));
  // some people have multiple given names
  if (Math.random() > 0.7) {
    const secondName = getRandomGiven(patGender);
    if (patient.name && patient.name[0] && patient.name[0].given && secondName !== patient.name[0].given[0]) {
      patient.name[0].given.push();
    }
  }
  return patient;
}
