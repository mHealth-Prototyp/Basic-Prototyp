<template>
  <!-- Timeline card. Only displayed when width >= 600px. -->
  <q-card class="dashboard-card-wide gt-xs">
    <q-card-section class="card-title">
      <q-icon
        name="fas fa-chart-line"
        class="big-icon" />
      {{ $t('timeline.title') }}
    </q-card-section>
    <q-card-section>
      <q-select
        v-model="filter"
        dense
        multiple
        :options="availableAllergies"
        :option-label="(o) => (o ? o.languageDisplays[lang] : $t('allergy.noAllergy'))"
        options-dense
        use-chips
        stack-label
        :label="$t('timeline.filter')"
        @update:model-value="getChartData()" />
    </q-card-section>
    <q-card-section v-if="series.length > 0">
      <apexchart
        height="400"
        type="line"
        :options="chartOptions"
        :series="series" />
    </q-card-section>
    <q-card-section v-if="series.length === 0">
      <InformationBanner :text="$t('diary.noData')" />
    </q-card-section>
  </q-card>
  <!-- Card to display when width is < 600px. -->
  <q-card class="dashboard-card lt-sm">
    <q-card-section class="card-title">
      <q-icon
        name="fas fa-chart-line"
        class="big-icon" />
      {{ $t('timeline.title') }}
    </q-card-section>
    <q-card-section>
      <InformationBanner :text="$t('timeline.noShowText')" />
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import {defineComponent, PropType} from 'vue';
import {date} from 'quasar';
import {ApexOptions} from 'apexcharts';

import {AllergySystemCodeExtension, CHAllergyIntolerance} from '@i4mi/mhealth-proto-components';

import {getLangStringFromLocale} from 'src/boot/i18n';
import Utils from 'src/services/utils';

import {DiaryEntry} from 'src/model/interfaces';
import {SYMPTOM_LOCATIONS} from 'src/assets/symptoms';
import {Medication, readI18N} from '@i4mi/fhir_r4';

export default defineComponent({
  name: 'TimelineCard',
  props: {
    diary: {
      type: Array as PropType<Array<DiaryEntry>>,
      required: true
    },
    dayOffset: {
      type: Number,
      required: true
    },
    knownAllergies: {
      type: Array as PropType<CHAllergyIntolerance[]>,
      required: true
    },
    suspAllergies: {
      type: Array as PropType<CHAllergyIntolerance[]>,
      required: true
    }
  },
  data() {
    return {
      lang: getLangStringFromLocale(this.$i18n.locale),
      filter: new Array<AllergySystemCodeExtension>(),

      knownAllergyCodes: new Array<AllergySystemCodeExtension>(),
      suspectedAllergies: new Array<AllergySystemCodeExtension>(),
      availableAllergies: new Array<AllergySystemCodeExtension>(),

      chartOptions: {
        markers: {
          size: [],
          strokeColors: '#000',
          strokeWidth: 1,
          shape: 'square'
        },
        chart: {
          id: 'symptoms-timeline',
          type: 'line',
          defaultLocale: getLangStringFromLocale(this.$i18n.locale),
          locales: this.$chartLocales
        },
        colors: [
          '#e6194B',
          '#3cb44b',
          '#ffe119',
          '#4363d8',
          '#f58231',
          '#911eb4',
          '#42d4f4',
          '#f032e6',
          '#bfef45',
          '#fabed4',
          '#469990',
          '#dcbeff',
          '#9A6324',
          '#fffac8',
          '#800000',
          '#aaffc3',
          '#808000',
          '#ffd8b1',
          '#000075',
          '#a9a9a9'
        ],
        grid: {
          padding: {
            left: 200
          }
        },
        stroke: {
          curve: 'smooth'
        },
        legend: {showForSingleSeries: true},
        xaxis: {
          type: 'datetime',
          labels: {
            datetimeUTC: true
          }
        },
        yaxis: {
          labels: {
            formatter: (val) => {
              switch (val) {
                case 3:
                  return this.$t('symptom.24484000');
                case 2:
                  return this.$t('symptom.6736007');
                case 1:
                  return this.$t('symptom.255604002');
                case 1.5:
                  return this.$t('timeline.taken');
                case -1:
                  return this.$t('timeline.notTaken');
                default:
                  return this.$t('symptom.260413007');
              }
            },
            offsetX: 190
          },
          min: 0,
          max: 3,
          tickAmount: 3,
          title: {
            text: this.$t('timeline.yAxis')
          }
        }
      } as ApexOptions,
      series: [] as {name: string; type: string; data: [number, number][]}[]
    };
  },
  mounted() {
    this.availableAllergies = Utils.MergeAllergySystemCodeExtension(
      Utils.CHAllergyIntoleranceToAllergySystemCodeExtension(this.knownAllergies),
      Utils.CHAllergyIntoleranceToAllergySystemCodeExtension(this.suspAllergies),
      this.lang
    );
    //void this.$nextTick(() => this.getChartData());
    this.getChartData();
  },
  updated() {
    // void this.$nextTick(() => this.getChartData());
    this.getChartData();
  },
  methods: {
    /**
     * Processes the diary entries into a two dimmensional array with header that can be used by the Google Charts.
     */
    getChartData() {
      let seriesIndexes: {[key: string]: number} = {};

      // Codes of intesities are converted to 0-3.
      let intensities = {
        260413007: 0,
        255604002: 1,
        6736007: 2,
        24484000: 3
      };

      // Builds the rest of the header with symptoms and also store their index for a later use.
      const series: {name: string; type: string; data: [number, number][]}[] = [];
      for (let i = 0; i < SYMPTOM_LOCATIONS.length; i++) {
        seriesIndexes[SYMPTOM_LOCATIONS[i].sct] = i;
        series[i] = {
          name: this.$t('symptom.' + SYMPTOM_LOCATIONS[i].name),
          type: 'line',
          data: []
        };
        for (let j = this.dayOffset - 1; j >= 0; j--) {
          series[i].data.push([date.subtractFromDate(this.$today, {day: j}).getTime(), 0]);
        }
      }

      let entries = Utils.filterByDate(this.diary, this.dayOffset, this.$today);

      if (this.filter.length > 0) {
        entries = entries.filter((x) =>
          this.filter.some((y) => y.defaultCoding.code === x.allergy?.defaultCoding.code)
        );
      }

      const medications: Medication[] = [];
      for (const e of entries) {
        if (e.medications) medications.push(...e.medications);
        const index = this.dayOffset - 1 - date.getDateDiff(this.$today, e.date, 'days');
        for (const s of e.symptoms) {
          const intensity = intensities[s.intensity];
          if (series[seriesIndexes[s.location.sct]].data[index][1] < intensity) {
            series[seriesIndexes[s.location.sct]].data[index][1] = intensity;
          }
        }
      }
      const uniqueMedications = Array.from(new Set(medications.map((x) => x.code?.coding?.[0].code))).map((code) => {
        return medications.find((x) => x.code?.coding?.[0].code === code);
      });

      const seriesLength = Object.keys(seriesIndexes).length;
      for (let i = seriesLength; i < seriesLength + uniqueMedications.length; i++) {
        const i2 = i - seriesLength;
        const _text = uniqueMedications[i2]?.code?._text;
        const code = uniqueMedications[i2]?.code?.coding?.[0].code;
        if (_text && code) {
          seriesIndexes[code] = i;
          series[i] = {
            name: readI18N(_text, this.lang) ?? i.toString(),
            type: 'scatter',
            data: []
          };

          for (let j = this.dayOffset - 1; j >= 0; j--) {
            series[i].data.push([date.subtractFromDate(this.$today, {day: j}).getTime(), -1]);
          }
        }
      }

      for (const e of entries) {
        if (e.medications) {
          const index = this.dayOffset - 1 - date.getDateDiff(this.$today, e.date, 'days');
          for (const m of e.medications) {
            const code = m.code?.coding?.[0].code;
            if (code) {
              series[seriesIndexes[code]].data[index][1] = 1.5;
            }
          }
        }
      }

      const seriesWithData: {name: string; type: string; data: [number, number][]}[] = [];
      const markersSize: number[] = [];
      for (const s of series) {
        if (Math.max(...s.data.map((x) => x[1])) > 0) {
          seriesWithData.push(s);
          if (s.type === 'line') {
            markersSize.push(0);
          } else {
            markersSize.push(5);
          }
        }
      }
      if (this.chartOptions.markers) {
        this.chartOptions = {...this.chartOptions, markers: {...this.chartOptions.markers, size: markersSize}};
      }
      this.series = seriesWithData;
    }
  }
});
</script>

<style scoped lang="scss"></style>
