<template>
  <!-- Timeline card. Only displayed when width >= 600px AND station !== undefined. -->
  <q-card
    class="dashboard-card-wide gt-xs"
    v-if="station">
    <q-card-section class="card-title">
      <q-icon
        name="fas fa-smog"
        class="big-icon" />
      {{ $t('airQuality.title') }} {{ $t('airQuality.in') }}
      {{ station.languageDisplays[lang] }}
    </q-card-section>
    <q-card-section>
      <apexchart
        height="400"
        type="bar"
        :options="chartOptions"
        :series="series" />
    </q-card-section>
  </q-card>
  <!-- Missing station card. Only displayed when width >= 600px AND station === undefined. -->
  <q-card
    class="dashboard-card"
    v-if="!station">
    <q-card-section class="card-title">
      <q-icon
        name="fas fa-smog"
        class="big-icon"></q-icon>
      {{ $t('airQuality.title') }}
    </q-card-section>
    <q-card-section>
      <WarningBanner :text="$t('airQuality.noStation')" />
    </q-card-section>
  </q-card>
  <!-- Card to display when width is < 600px. -->
  <q-card class="dashboard-card lt-sm">
    <q-card-section class="card-title">
      <q-icon
        name="fas fa-smog"
        class="big-icon" />
      {{ $t('airQuality.title') }}
    </q-card-section>
    <q-card-section>
      <InformationBanner :text="$t('airQuality.noShowText')" />
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import {defineComponent, PropType} from 'vue';
import {date} from 'quasar';
import {ApexOptions} from 'apexcharts';

import {AllergySystemCodeExtension} from '@i4mi/mhealth-proto-components';

import {getLangStringFromLocale} from 'src/boot/i18n';

import {Parameter, Station} from 'src/model/interfaces';

export default defineComponent({
  name: 'AirQualityTimelineCard',
  props: {
    station: {
      type: Object as PropType<Station>,
      required: false
    },
    pollen: {
      type: Object as PropType<AllergySystemCodeExtension>,
      required: false
    },
    dayOffset: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      lang: getLangStringFromLocale(this.$i18n.locale),
      chartOptions: {
        annotations: {
          yaxis: [
            {
              y: 50,
              yAxisIndex: 2,
              borderColor: '#0C0',
              label: {
                borderColor: '#0C0',
                text: this.$t('airQuality.pm10') + ' ' + this.$t('airQuality.dailyLimitValue'),
                style: {
                  color: '#0C0'
                }
              }
            },
            {
              y: 120,
              yAxisIndex: 3,
              borderColor: '#F00',
              label: {
                borderColor: '#F00',
                text: this.$t('airQuality.o3') + ' ' + this.$t('airQuality.dailyLimitValue'),
                style: {
                  color: '#F00'
                }
              }
            }
          ]
        },
        chart: {
          id: 'air-pollution-timeline',
          defaultLocale: getLangStringFromLocale(this.$i18n.locale),
          locales: this.$chartLocales
        },
        dataLabels: {
          enabled: false
        },
        plotOptions: {
          bar: {
            columnWidth: '50%'
          }
        },
        xaxis: {
          type: 'datetime'
        },
        yaxis: [
          {
            min: 0,
            max: 150,
            title: {
              text: this.$t('airQuality.rainfall') + ' (' + this.$t('airQuality.mm') + ')',
              style: {color: '#00F'}
            }
          },
          {
            min: 0,
            max: 0,
            title: {
              text: this.$t('pollen.noPollen'),
              style: {
                color: '#efc000'
              }
            }
          },
          {
            min: 0,
            max: 200,
            title: {
              text: this.$t('airQuality.pm10') + ' (' + this.$t('airQuality.ugm3') + ')',
              style: {color: '#0C0'}
            }
          },
          {
            min: 0,
            max: 250,
            title: {
              text: this.$t('airQuality.ozone') + ' (' + this.$t('airQuality.ugm3') + ')',
              style: {color: '#F00'}
            }
          }
        ]
      } as ApexOptions,
      series: [
        {
          name: this.$t('airQuality.rainfall'),
          data: [] as [number, number][],
          color: '#00F'
        },
        {
          name: this.$t('pollen.noPollen'),
          data: [] as [number, number][],
          color: '#efc000'
        },
        {
          name: this.$t('airQuality.pm10'),
          data: [] as [number, number][],
          color: '#0C0'
        },
        {
          name: `${this.$t('airQuality.ozone')} (${this.$t('airQuality.o3')})`,
          data: [] as [number, number][],
          color: '#F00'
        }
      ]
    };
  },
  mounted() {
    void this.$nextTick(() => this.getChartData());
  },
  updated() {
    void this.$nextTick(() => this.getChartData());
  },
  methods: {
    getChartData() {
      if (this.station) {
        const from = date.subtractFromDate(this.$today, {
          days: this.dayOffset - 1
        });

        let pollenParameter: Parameter | undefined;

        if (this.pollen?.defaultCoding.code) {
          pollenParameter = this.$weatherAPIConsumer.getParameter(this.pollen.defaultCoding.code);

          if (pollenParameter?.pollen) {
            const pollenYAxis = {
              min: 0,
              max: pollenParameter.pollen.scale.level_3[1] + 1,
              title: {
                text: `${pollenParameter.languageDisplays[this.lang]} (${this.$t('airQuality.ppm')})`,
                style: {
                  color: '#efc000'
                }
              }
            } as ApexYAxis;

            if (Array.isArray(this.chartOptions.yaxis)) {
              const yaxis = this.chartOptions.yaxis;
              yaxis[1] = pollenYAxis;
              this.chartOptions = {
                ...this.chartOptions,
                ...{
                  yaxis: yaxis
                }
              };
              this.series[1].name = pollenParameter.languageDisplays[this.lang];
              this.series[1].data = this.$weatherAPIConsumer.getValues(
                this.station.id,
                pollenParameter.defaultCoding.code,
                from,
                this.$today
              );
            }
          }

          this.series[0].data = this.$weatherAPIConsumer.getValues(this.station.id, 'rainfall', from, this.$today);
          this.series[2].data = this.$weatherAPIConsumer.getValues(this.station.id, 'pm10', from, this.$today);
          this.series[3].data = this.$weatherAPIConsumer.getValues(this.station.id, 'ozone', from, this.$today);
        }
      }
    }
  }
});
</script>

<style lang="scss">
.no-data {
  padding-top: 1em;
}
</style>
