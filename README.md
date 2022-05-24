# mHealth Prototyp (mhealth-proto)

The purpose of this app is to demonstrate  mHealth use cases related to the Swiss electronic health record.

- Try out the latest version of this webapp: http://epd-uc.pages.ti.bfh.ch/epd-use-case-prototypen/ (use `test@e.id` with passwort `test` for mock login).

## Content Table
- [1 EPD Playground](#1-epd-playground)
  - [1.1 Mobile Access Gateway](#11-mobile-access-gateway)
- [2 Core functionalities](#2-core-functionalities)
  - [2.1 epdPlaygroundUtils.ts](#21-epdplaygroundutilsts)
  - [2.2 fhirUtils.ts](#22-fhirutilsts)
- [3 Components](#3-components)
  - [3.1 Document Search](#31-document-search)
  - [3.2 Document Upload](#32-document-upload)
  - [3.3 Local Patients](#33-local-patients)
  - [3.4 Login Mock](#34-login-mock)
  - [3.5 Patient Search](#35-patient-search)
  - [3.6 Patient View](#36-patient-view)
  - [3.7 Register Patient](#37-register-patient)
- [4 Build & run app](#4-build-run-app)
- [5 Automatic deployment & hosting](#5-automatic-deployment-hosting)
 - [5.1 GitHub Pages](#51-github-pages)
- [6 Submit issues](#6-submit-issues)
- [7 Changelog](#7-changelog)

## 1 EPD Playground
The EPD Playground is a low-threshold "test and play" implementation of a Swiss electronic health record for demonstrating key use cases of mHealth. It is a source of inspiration for developers, managers and healthcare personal in Switzerland. For easier testing, no authentication is needed on the EPD Playground. See more on the [project page of the EPD Playground](https://epdplayground.ch/index.php?title=Main_Page).

### 1.1 Mobile Access Gateway
The [Mobile Access Gateway](https://epdplayground.ch/index.php?title=Mobile_Access_Gateway) is a FHIR endpoint that allows us to communicate with the EPD Playground using mHealth Profiles.

## 2 Core functionalities
To provide core functionalities in a reusable manner, several util classes have been created:
- **epdPlaygroundUtils.ts**: Implements query functions based on FHIR profiles PIXm, PDQm and MHD required for the profile "Mobile access to Health Documents (MHD) by using the [Mobile Access Gateway](https://epdplayground.ch/index.php?title=Mobile_Access_Gateway).
- **fhirUtils.ts**: Provides necessary SNOMED codes in FHIR format, mapping functions and a functionality to create FHIR resources, e.g. Document Bundle.
- **fileUtils.ts**: Provides helper methods concerning files, e.g. converting binary to Base64.
- **storeService.ts**: Provides functions for saving to local storage, default settings, locale, mockup patients, etc.
- **i18n.ts**: Handles interationalization. DE (de-CH) is the default and currently only language. Note: Each component has a string interface to be independant from a i18n setup.

### 2.1 epdPlaygroundUtils.ts

Following FHIR transactions are provided by the epdPlaygroundUtils class:

| Function    | Description | FHIR Transaction |  Params     |  Returns    |
| ----------- | ----------- | --------------   | ----------- | ----------  |
| useITI65(_documentBundle: iti65DocumentBundle) | Uploads a document. | [ITI-65 Provide Document Bundle](http://fhir.ch/ig/ch-epr-mhealth/iti-65.html)  | **_documentBundle**: a Document Bundle representing a document, can be created with *createIti65Bundle()* from fhirUtils.ts  | A Promise with the uploaded Document Bundle with servers IDs  |
| useITI66(_params: Partial\<iti66Params>) | Search for Submission Sets by given search parameters. | [ITI-66 Find Document Lists](http://fhir.ch/ig/ch-epr-mhealth/iti-66.html) | **_params**: the FHIR search parameters (see [ihe.net](https://profiles.ihe.net/ITI/TF/Volume2/ITI-18.html#3.18.4.1.2.3.7.2) for more details). The _params object can contain one or more of following properties: <br />- code  (as string)<br />- date (as string)<br />- designationType (as string)<br />- identifier (as string)<br />- patient (as string)<br />- sourceId (as string)<br />- status  (as string or ListStatus when using [@i4mi/fhir_r4](https://github.com/i4mi/fhir-resources-r4))<br />- 'patient.identifier' (as string)<br />- 'source.given' (as string)<br />- 'source.family' (as string) | A Promise with an Array of List resources matching the parameters |
| useITI67(_params: Partial\<iti67Params>) | Searches for documents of given patient and search parameters. | 	[ITI-67 Find Document References](http://fhir.ch/ig/ch-epr-mhealth/iti-67.html) | **_params**: the FHIR search parameters (see [ihe.net](https://profiles.ihe.net/ITI/TF/Volume2/ITI-18.html#3.18.4.1.2.3.7.1) for more details). The _params object can contain one or more of following properties:<br />- 'author.given' (as string)<br />- 'author.family' (as string)<br />- category (as string)<br />- creation (as string)<br />- date (as string)<br />- event (as string)<br />- facility (as string)<br />- format (as string)<br />- identifier (as string)<br />- patient (as string)<br />- 'patient.identifier' (as string)<br />- period (as string)<br />- related (as string)<br />- 'security-label' (as string)<br />- setting (as string)<br />- sourceId (as string)<br />- status (as string or DocumentReferenceStatus when using [@i4mi/fhir_r4](https://github.com/i4mi/fhir-resources-r4))<br />- type (as string) | A Promise with an array of DocumentReference resources matching the search parameters |
| useITI68(_reference: DocumentReference \| string) | Downloads document by given DocumentReference or URL. | [ITI-68 Retrieve Document](https://fhir.ch/ig/ch-epr-mhealth/iti-68.html) | **_reference**: a DocumentReference resource or a string containing and URL to a document | A Promise with the document as a string |
| useITI78(_params: Partial\<iti78Params>) | Search patients by demographic characteristics. | [ITI-78 Mobile Patient Demographics Query](https://profiles.ihe.net/ITI/PDQm/ITI-78.html) | **_params**: the FHIR search parameters (see [ihe.net](https://profiles.ihe.net/ITI/PDQm/ITI-78.html#23784121-search-parameters) for more details). The _params object can contain one or more of following properties:<br />- gender (as string)<br />- family (as string)<br />- given (as string)<br />- 'address-city' (as string)<br />- 'address-country' (as string)<br />- 'address-postalcode' (as string)<br />- 'address-state' (as string)<br />Currently, not all IHE parameters are supported by the Mobile Access Gateway. | A Promise with an array of Patient resources matching the search parameters. |
| useITI83(_sourceIdentifier: string, _targetSystems?: string[]) | Request the MPI-PID and the EPR-SPID identifier for a given local patient identifier. | [ITI-83 Mobile Patient Identifier Cross-Reference Query](http://fhir.ch/ig/ch-epr-mhealth/iti-83.html) | **_sourceIdentifier**: local patient identifier (as string)<br />**_targetSystems?**: target systems as OIDs (optional, as Array of strings) | A Promise with a FHIR resource Parameters |
| useITI93(_patient: Patient, _action: ITI_93_ACTION, _mergePatient?: Patient) | Adds or edits patient data. | [CH:PIXm ITI-93 Mobile Patient Identity Feed](http://fhir.ch/ig/ch-epr-mhealth/iti-93.html) | **_patient**: the Patient resource to add / update / merge / delete<br />**_action**: wether to ADD / UPDATE or RESOLVE DUPLICATE (REMOVE is not supported by EPD Playground / MAG) (as string or ITI_93_ACTION)<br />**_mergePatient?**: optional, only needed when _action is merge: Patient resource for the patient to replace the original _patient when merging. | A Promise with a the server response (the uploaded Bundle with servers IDs). |


### 2.2 fhirUtils.ts
| Function    | Description |  Params     |  Returns    |
| ----------- | ----------- | ----------- | ----------  |
| createIti65Bundle(patient: Patient, file: File, metaData: iti65Metadata) | Creates a document bundle with a binary file according to [ITI-65](https://fhir.ch/ig/ch-epr-mhealth/iti-65.html). | **patient**: the patient FHIR resource the document belongs to<br /> **file**: the file to upload <br /> **metaData**: meta data describing the content of the file:<br />- title (as string)<br />- description (as string)<br />- isFhir? indicates that a .json file has FHIR content (as boolean)<br />- contentLanguage (as string)<br />- sourceIdentifier (as string)<br />- categoryCoding (as SystemCode)<br />- typeCoding (as SystemCode)<br />- facilityCoding (as SystemCode)<br />- practiceSettingCoding (as SystemCode) | A promise with a document bundle resource that can be used for the upload. |
| findClassTypeCombination(classCode: string) | Returns possible types for a given class code according to this mapping: [ehealthsuisse.art-decor.org](http://ehealthsuisse.art-decor.org/ch-epr-html-20200226T180620/voc-2.16.756.5.30.1.127.3.10.1.30-2020-02-26T174502.html) | **classCode**: class code to look for possible type codes | An Array of SystemCodeExtensions which contain possible type codes. |
| getClassCodeString(code: string, language: FhirUtilLanguageType) | Returns a display string for a given DocumentReference category (DocumentEntry.classCode) code. | **code**: SNOMED CT code of a category as string<br />**language**: The shorthand of the language of the display string ('en', de','fr', 'it' or 'rm') | The display property of the class, respectively category coding. |
| getTypeCodeString(code: string, language: FhirUtilLanguageType) | Returns a display string for a given DocumentReference type (DocumentEntry.typeCode) code. | **code**: SNOMED CT code of a type as string<br />**language**: The shorthand of the language of the display string ('en', de','fr', 'it' or 'rm') | The display property of the type coding. |
| getFacilityClassCodeString(code: string, language: FhirUtilLanguageType) | Returns a display string for a given DocumentReference context facility code. | **code**: SNOMED CT code of a facility as string<br />**language**: The shorthand of the language of the display string ('en', de','fr', 'it' or 'rm') | The display property of a facility class coding. |
| createFhirOrganization(_name: string, _identifier: Identifier, _contact: OrganizationContact, _address?: Address) | Creates an Organization resource from the given parameters. | **_name**: name of the organization<br />**_identifier**: identifier of the organization<br />**_contact**: contact information of the organization:<br />- given (as string)<br />- family (as string)<br />- phone? (as string)<br />- mail? (as string)<br />**_address**: address of the organization | An Organization FHIR resource with random UUID as id. |

Following codes are listed in the fhirUtils class:
- [DocumentEntry.classCode](https://fhir.ch/ig/ch-epr-term/ValueSet-DocumentEntry.classCode.html#logical-definition-cld) (is mapped to DocumentReference.category) as CLASS_CODES
- [DocumentEntry.typeCode](http://build.fhir.org/ig/hl7ch/ch-epr-term/ValueSet-DocumentEntry.typeCode.html#logical-definition-cld) (is mapped to DocumentReference.type) as TYPE_CODES
- [DocumentEntry.healthcareFacilityTypeCode](https://fhir.ch/ig/ch-epr-term/ValueSet-DocumentEntry.healthcareFacilityTypeCode.html) (is mapped to DocumentReference.facilityType) as FACILITY_CLASS_CODES
- [DocumentEntry.practiceSettingCode](https://fhir.ch/ig/ch-epr-term/ValueSet-DocumentEntry.practiceSettingCode.html) (is mapped to DocumentReference.practiceSetting) as PRACTICE_SETTING_CODES

## 3 Components
The mHealth prototype app consists of encapsulated components for typically needed functions, which can be easily reused in other apps based on the same technology stack. All components take use of a utils class [epdPlaygroundUtils.ts](../src/utils/epdPlaygroundUtils.ts) which implements the core functions to access the EPD Playground / Mobile Access Gateway using mHealth profiles.

Following components are currently available:

### 3.1 Document Search
[DocumentSearch.vue](../src/components/DocumentSearch.vue)

#### Description

Loads & displays documents that belong to a patient.

#### mHealth transactions used
- ITI-67 Find Document References
- ITI-68 Retrieve Document
- ITI-83 Mobile Patient Identifier Cross-Reference Query

#### Props
| Name        | Description | Type        |  required   |
| ----------- | ----------- | ----------- | ----------- |
| patient     | The Patient resource of the person the documents shall be searched for.  | Patient (FHIR resource)  | yes   |
| translations   | Strings for displaying on the page.   | DocumentSearchTranslationStrings | yes   |
| addedDocuments   | Array of documents added on client (e.g. with DocumentUpload.vue) after data was fetched from server. | Array<DocumentReference> | no  |
| locale   | The shorthand for the local language (e.g. de-CH). Default is de-CH. | String | no  |
| demoMode   | Slows down the transactions to make the transactions more visible in the GUI. Default: no. | Boolean | no  |

#### Events emitted
- found-document: Make available selected document to parent component e.g. for download or display. Emitted when the user selects a document from the search result list.

### 3.2 Document Upload
[DocumentUpload.vue](../src/components/DocumentUpload.vue)

#### Description

Provides UI to describe a document with meta data and uploads it.

#### mHealth transactions used
- ITI-65 Provide Document Bundle

#### Props
| Name        | Description | Type        |  required   |
| ----------- | ----------- | ----------- | ----------- |
| translations   | Strings for displaying on the page.   | DocumentUploadTranslationStrings | yes   |
| patient     | The patient resource the file belongs to.  | Patient (FHIR resource)  | yes   |
| onDone | Function to be called when the upload process is done. | A function returning a boolean "success" | yes  |
| locale   | The shorthand for the local language (e.g. de-CH). Default is de-CH. | String | no  |

#### Events emitted
- upload-result: Notify parent component about upload result. Emitted after successful upload of document bundle.

### 3.3 Local Patients
[LocalPatients.Vue](../src/components/LocalPatients.vue)

#### Description

Generates & displays random local patients for use in app and upload to EPD Playground.

#### mHealth transactions used
- ITI-83 Mobile Patient Identifier Cross-Reference Query

#### Props
| Name        | Description | Type        |  required   |
| ----------- | ----------- | ----------- | ----------- |
| localIdSystem | System of the local Identifier.  | An object containing a "urn" property e.g. for OID and a "display" property for a name.  | yes  |
| translations   | Strings for displaying on the page.   | LocalPatientsListTranslationStrings | yes   |
| options  | Options for the component. | LocalPatientsOptions | no |
| patients | Array of patients to be displayed as local patients. When none are provided, random generated patients are provided. | no |

#### Events emitted
- select-patient: Notify parent component about selected patient. Emitted when the user selects a patient from the list.

### 3.4 Login Mock
[LoginMock.vue](../src/components/LoginMock.vue)

#### Description

Mocks the login to the platform with a token displayed in the UI.

#### mHealth transactions used
- none

#### Props
| Name        | Description | Type        |  required   |
| ----------- | ----------- | ----------- | ----------- |
| acceptedLogins | Accepted username, password combinations for login. | Array<LoginType> | yes |
| onLogin | Function that returns user that was logged in. | (user: LoginType) | no |

#### Events
- message: Notify parent component about token message to display. Emitted when mocked message for 2FA is "sent".

### 3.5 Patient Search
[PatientSearch.vue](../src/components/PatientSearch.vue)

#### Description

Searches & displays patients on the EPD Playground.

#### mHealth transactions used
- ITI-78 Mobile Patient Demographics Query

#### Props
| Name        | Description | Type        |  required   |
| ----------- | ----------- | ----------- | ----------- |
| localIdSystem | System of the local Identifier.  | An object containing a "urn" property e.g. for OID and a "display" property for a name.  | yes |
| translations   | Strings for displaying on the page.   | PatientSearchTranslationStrings | yes   |
| options  | Options for the component. | PatientSearchOptions | no |

#### Events emitted
- found-patient: Notify parent component about found patient data. Emitted when user selects a patient from the search result list.

### 3.6 Patient View
[PatientView.vue](../src/components/PatientView.vue)

#### Description

Shows patient details including documents. Also provides functionality to edit patient & upload documents (uses DocumentUpload.vue & DocumentSearch.vue).

#### mHealth transactions used
- CH:PIXm ITI-93 Mobile Patient Identity Feed

#### Props
| Name        | Description | Type        |  required   |
| ----------- | ----------- | ----------- | ----------- |
| patient     | The Patient resource to be displayed (and possibly edited).  | Patient (FHIR resource)  | yes   |
| translations   | Strings for displaying on the page.   | PatientViewTranslationStrings | yes   |
| options  | Options for the component. | PatientViewOptions | no |
| locale   | The shorthand for the local language (e.g. de-CH). Default is de-CH. | String | no  |

#### Events emitted
- edited-patient: Notifies parent components about updated patient. Emitted after successful upload of patient data.

### 3.7 Register Patient
[RegisterPatient.vue](../src/components/RegisterPatient.vue)

#### Description

Registers a patient in the EPD Playground.

#### mHealth transactions used
- CH:PIXm ITI-93 Mobile Patient Identity Feed

#### Props
| Name        | Description | Type        |  required   |
| ----------- | ----------- | ----------- | ----------- |
| patient     | Prefills the register form with a given Patient resource.  | Patient (FHIR resource)  | no   |
| localIdSystem | System of the local Identifier.  | An object containing a "urn" property e.g. for OID and a "display" property for a name.  | yes |
| translations   | Strings for displaying on the page.   | RegisterPatientTranslationStrings | yes   |

#### Events emitted
- uploaded-patient: Notifies parent component about registered patient. Emitted after successful upload of patient data.

## 4 Build & run app

### Install dependencies

```bash
npm i
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)

```bash
npm run start
```

### Build the app for production

```bash
npm run build
```

### Lint the files (static code analysis)

```bash
npm run lint
```

### Format the files (code formatter)

```bash
npm run format
```

### Customize the configuration

See [Configuring quasar.conf.js](https://quasar.dev/quasar-cli/quasar-conf-js).

## 5 Automatic deployment & hosting

### 5.1 GitHub Pages

When hosted on GitHub the app is being automatically deployed to the GitHub Pages by using the GitHub Actions function when a commit on the default branch "main" is performed. Configurations can be made in the [main.yml file](../.github/workflows/main.yml). The static web files produced from the build command is published here (domain pattern automatically generated): http://epd-uc.pages.ti.bfh.ch/epd-use-case-prototypen/.

Things to consider:

### Edit main.yml

Depending on your ssh token permissions you may only be able to edit files in the ".github" folder via browser.

### Check publicPath

When the app is served in a subdirectory (in this case: epd-use-case-prototypen), you need to set the variable "publicPath" in [quasar.conf.js](../quasar.conf.js) to the name of the subdirectory (the default value corresponds to your repository name).

### Enable GitHub Pages

1. If it doesn't exist yet, push a new branch to your repository called "gh-pages"
2. Open repository settings (you must be administrator) > Pages
3. Select Source: "gh-pages", /root -> Save

### Check default branch

Make sure the name of your default branch is listed as trigger in the [main.yml file](../.github/workflows/main.yml). Currently it uses the branch "main" to trigger the "build_and_deploy" job.

### Enable HTTPS

Follow this documentation (you must be administrator): [Securing your GitHub Pages site with HTTPS](https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https).

## 6 Submit issues
Go to the issue site of the repository. [github.com](https://github.com/mHealth-Prototyp/Basic-Prototyp/issues)

## 7 Changelog

| Version     | Date        | Changes     |
| ----------- | ----------- | ----------- |
| 1.0.0       | 23-05-2022  | Initial version |
