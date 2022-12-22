import {HumanName, HumanNameNameUse} from '@i4mi/fhir_r4';
import {
  AllergySystemCodeExtension,
  CHAllergyIntolerance,
  ALLERGY_IDENTIFICATION_CODES,
  FhirUtilLanguageType
} from '@i4mi/mhealth-proto-components';
import {date} from 'quasar';
import {DiaryEntry} from 'src/model/interfaces';

const REG_EXP_UUID = new RegExp(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);

function dateTimeToDate(date: Date = new Date()): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/**
 * Filters the list in a way to return the entries from the specified date to the specified date minus the offset.
 * @param diaryEntries A list of entries that will be filtered.
 * @param date  The date that we will calculate the offset.
 */
function filterByDate(diaryEntries: DiaryEntry[], dayOffset: number, dateTo: Date = new Date()): DiaryEntry[] {
  const dateFrom = date.subtractFromDate(dateTo, {days: dayOffset});

  diaryEntries = diaryEntries.filter((x) =>
    date.isBetweenDates(x.date, dateFrom, dateTo, {
      onlyDate: true,
      inclusiveFrom: false,
      inclusiveTo: true
    })
  );

  return diaryEntries;
}

/**
 * Converts a list of CHAllergyIntolerance documents to a list of AllergySystemCodeExtension.
 * @param allergiesAndIntolerances a list of CHAllergyIntolerance documents.
 * @returns a list of AllergySystemCodeExtension.
 */
function CHAllergyIntoleranceToAllergySystemCodeExtension(
  allergiesAndIntolerances: CHAllergyIntolerance[]
): AllergySystemCodeExtension[] {
  const allergies = [] as AllergySystemCodeExtension[];

  allergiesAndIntolerances.forEach((allergyAndIntolerance) => {
    const snomedSct = allergyAndIntolerance.code.coding?.find((x) => x.system === 'http://snomed.info/sct');

    if (snomedSct?.code) {
      const allergy = ALLERGY_IDENTIFICATION_CODES.find((x) => x.defaultCoding.code === snomedSct.code);
      allergy && allergies.push(allergy);
    }
  });

  if (allergies.length === 0) {
    const noKnownAllergy = ALLERGY_IDENTIFICATION_CODES.find((x) => x.defaultCoding.code === '716186003');
    noKnownAllergy && allergies.push(noKnownAllergy);
  }

  return allergies;
}

/**
 * Merges the given arrays.
 * @param firstArray a list of AllergySystemCodeExtension.
 * @param secondArray a list of AllergySystemCodeExtension that may contains duplicates present in firstArray.
 * @returns the concatenation of both array without duplicates.
 */
function MergeAllergySystemCodeExtension(
  firstArray: AllergySystemCodeExtension[],
  secondArray: AllergySystemCodeExtension[],
  lang: FhirUtilLanguageType
): AllergySystemCodeExtension[] {
  return firstArray
    .concat(
      secondArray.filter((x) => firstArray.findIndex((y) => x.defaultCoding.code === y.defaultCoding.code) === -1)
    )
    .filter((x) => x.defaultCoding.code !== '716186003')
    .sort((x, y) => x.languageDisplays[lang].localeCompare(y.languageDisplays[lang]));
}

/**
 * Checks if the given value is a valid uuid.
 * @param potentialUUID the value that will be tested.
 * @returns the result of the regular expression test.
 */
function isUUID(potentialUUID: string): boolean {
  return REG_EXP_UUID.test(potentialUUID);
}

/**
 * Generates the full name according the given HumanName.
 * @param name the HumanName that will be used to generate the full name.
 * @returns the name concatenated to a string.
 */
function getFullName(name: HumanName | undefined) {
  let text = '';
  if (name) {
    name.given?.forEach((x) => (text += `${x} `));
    text += name.family;
    text.trimEnd();
  }
  return text;
}

/**
 * Chooses which supplied HumanName is the best suited.
 * @param names an array of HumanName.
 * @returns the best suited name.
 */
function selectName(names: HumanName[]) {
  let name: HumanName | undefined = undefined;
  if (names.length > 0) {
    name = names.find((x) => x.use === HumanNameNameUse.OFFICIAL);
    if (name) return name;
    name = names.find((x) => x.use === HumanNameNameUse.USUAL);
    if (name) return name;
    name = names.find((x) => x.use === HumanNameNameUse.TEMP);
    if (name) return name;
    name = names.find((x) => x.use === HumanNameNameUse.ANONYMOUS);
    if (name) return name;
    name = names.find((x) => x.use !== HumanNameNameUse.OLD);
    if (name) return name;
  }
  return name;
}

export default {
  dateTimeToDate,
  filterByDate,
  CHAllergyIntoleranceToAllergySystemCodeExtension,
  MergeAllergySystemCodeExtension,
  isUUID,
  getFullName,
  selectName
};
