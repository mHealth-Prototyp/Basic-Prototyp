# mHealth Prototyp (mhealth-proto)

The purpose of this app is to demonstrate  mHealth use cases related to the Swiss electronic health record.

- Try out the latest version of this webapp: http://epd-uc.pages.ti.bfh.ch/epd-use-case-prototypen/ (use `test@e.id` with passwort `test` for mock login).

## Content Table
- [1 EPD Playground](#1-epd-playground)
  - [1.1 Mobile Access Gateway](#11-mobile-access-gateway)
- [2 Core functionalities](#2-core-functionalities)
- [3 Components](#3-components)
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
For accessing core functionalities, the util classes of the [mHealth Component Library](https://github.com/mHealth-Prototyp/Basic-Components) are used.
- - **epdPlaygroundUtils.ts**: Implements query functions based on FHIR profiles PIXm, PDQm and MHD required for the profile "Mobile access to Health Documents (MHD) by using the [Mobile Access Gateway](https://epdplayground.ch/index.php?title=Mobile_Access_Gateway). For details, see the library's documentation.
- **fhirUtils.ts**: Provides necessary SNOMED codes in FHIR format, mapping functions and a functionality to create FHIR resources, e.g. Document Bundle. For details, see the library's documentation.
- **patientUtils**: Provides methods for generating demo patient data. For details, see the library's documentation.
Further, following services are available.
- **storeService.ts**: Provides functions for saving to local storage, default settings, locale, mockup patients, etc.
- **i18n.ts**: Handles interationalization. DE (de-CH) is the default and currently only language. Note: Each component has a string interface to be independant from a i18n setup.

## 3 Components
The mHealth prototype app consists of encapsulated components for typically needed functions, which can be easily reused in other apps based on the same technology stack. All components take use of the utils provided by the [mHealth Component Library](https://github.com/mHealth-Prototyp/Basic-Components#2-utils).

Following components are used. For details concerning these components, see the [library's documentation](https://github.com/mHealth-Prototyp/Basic-Components).

- **AllergyUpload**: Display a form for entering the data needed for CHAllergyIntolerance profile.
- **AllergyView**: Display the relevant data from a CHAllergyIntolerance resource.
- **DocumentSearch**: Displays a mask for documents on a given patient's EPR and emits a selected document as event.
- **DocumentUpload**: Displays a form for selecting a file to upload to a patient's EPR and provide additional metadata.
- **LocalPatients**: Mocks a set of local patients in a demo system.
- **PatientSearch**: Displays a mask for searching for patients that have an EPR and emits an event if a patient is found and selected.
- **PatientView**: Displays the data of a patient with the possibility of editing this data.
- **RegisterPatient**: Component for registering new patient data on the EPR.

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
| 1.2.0       | 2022-09-06  | - Add form for saving CH AllergyIntolerance to a patient record<br />- Add popup window for displaying CHAllergyIntolerance documents<br /> - Update dependencies |
| 1.1.1       | 2022-07-20  | Update README and use new version of library. |
| 1.1.0       | 2022-07-19  | Use component library. |
| 1.0.1       | 2022-05-25  | - Hotfix: Download of file was not working when app running on https.<br />- Added version number to About page. |
| 1.0.0       | 2022-05-23  | Initial version |
