<template>
  <q-card class="calendar-card dashboard-card">
    <q-card-section class="card-title">
      <q-icon
        name="fas fa-calendar"
        class="big-icon" />
      {{ $t('calendar.title') }}
    </q-card-section>
    <q-card-section class="row justify-around">
      <!-- YEARS -->
      <div
        v-for="year in years"
        :key="year.year"
        :class="'row justify-evenly year-tile' + (year.expanded ? ' expanded' : '')">
        <div
          class="date"
          @click="toggleExpanded(year, !year.expanded)">
          <h1>
            {{ year.year }}
          </h1>
          <hr width="100%" />
          <p v-if="!year.expanded">
            {{
              year.numberOfEntries +
              ' ' +
              (year.numberOfEntries === 1 ? $t('calendar.entryLabel') : $t('calendar.entriesLabel'))
            }}
          </p>
        </div>
        <div
          v-if="year.expanded"
          class="row justify-around full-width">
          <!-- MONTHS -->
          <div
            v-for="month in year.months"
            :key="year.year + '/' + month.month"
            :class="'month-tile' + (month.expanded ? ' expanded' : '')">
            <div
              class="date"
              @click="toggleExpanded(month, !month.expanded)">
              <h1>
                {{
                  month.expanded || $t('common.month' + month.month).length <= 4
                    ? $t('common.month' + month.month)
                    : $t('common.month' + month.month).substring(0, 3) + '.'
                }}
              </h1>
              <hr />
              <p v-if="!month.expanded">
                {{
                  month.numberOfEntries +
                  ' ' +
                  (month.numberOfEntries === 1 ? $t('calendar.entryLabel') : $t('calendar.entriesLabel'))
                }}
              </p>
            </div>

            <!-- DAYS -->
            <div
              v-if="month.expanded"
              class="row justify-start full-width">
              <div
                v-for="day in getDayArray(year.year, month.month)"
                :key="year.year + '/' + month.month + '/' + day"
                :class="'day-entry' + (numberOfDayEntries(month.days, Number(day)) > 0 ? ' with-entries' : '')"
                @click="() => showDayPopup(month.days.find((d) => d.day.toString() === day))">
                {{ day }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <p
        v-if="years.length === 0"
        class="no-data-text">
        {{ $t('diary.noData') }}
      </p>
    </q-card-section>
  </q-card>

  <q-dialog v-model="dayDialog">
    <DiaryEntryCard
      v-if="selectedDay?.entries.length === 1"
      :entry="selectedDay?.entries[0]"
      @close="dayDialog = false"
      @created-entry="() => {}" />
    <q-card v-if="selectedDay && selectedDay?.entries.length > 1">
      <q-card-section class="card-title with-close-icon">
        {{
          $t('calendar.entriesFrom') +
          ' ' +
          new Intl.DateTimeFormat($i18n.locale, {dateStyle: 'long'}).format(selectedDay.fullDate)
        }}
        <q-icon
          @click="dayDialog = false"
          name="fas fa-times"
          class="close-icon"
          flat
          round
          dense
          v-close-popup />
      </q-card-section>
      <q-card-section>
        <ul class="day-entry-list">
          <li
            v-for="(entry, i) in selectedDay.entries"
            :key="'entry' + i"
            @click="
              () => {
                subDayDialog = true;
                subDayEntry = entry;
              }
            ">
            {{
              $t('calendar.entryTimeLabel1') +
              new Intl.DateTimeFormat($i18n.locale, {
                timeStyle: 'short'
              }).format(entry.date) +
              $t('calendar.entryTimeLabel2')
            }}
          </li>
        </ul>
      </q-card-section>
    </q-card>
  </q-dialog>
  <q-dialog v-model="subDayDialog">
    <DiaryEntryCard
      :entry="subDayEntry"
      @close="subDayDialog = false" />
  </q-dialog>
</template>

<script lang="ts">
import {defineComponent, PropType} from 'vue';
import {DiaryEntry} from '../model/interfaces';
import DiaryEntryCard from './DiaryEntryCard.vue';

interface Day {
  day: number;
  fullDate: Date;
  entries: DiaryEntry[];
  expanded: boolean;
}

interface Month {
  month: number;
  numberOfEntries: number;
  days: Day[];
  expanded: boolean;
}

interface Year {
  year: number;
  numberOfEntries: number;
  months: Month[];
  expanded: boolean;
}

/**
 * Mocks the login to the platform with a token displayed in the UI.
 */
export default defineComponent({
  name: 'CalendarCard',
  components: {DiaryEntryCard},
  data() {
    return {
      years: new Array<Year>(),
      dayDialog: false,
      subDayDialog: false,
      selectedDay: undefined as Day | undefined,
      subDayEntry: undefined as DiaryEntry | undefined,
      lang: this.$i18n.locale
    };
  },
  /**
   *
   */
  emits: {},
  props: {
    /**
     * The DiaryEntries to display.
     */
    diary: {
      type: Array as PropType<Array<DiaryEntry>>,
      required: true
    }
  },
  mounted() {
    this.buildDataStructure(this.$props.diary);
  },
  methods: {
    toggleExpanded(element: Year | Month | Day, expanded: boolean) {
      element.expanded = expanded;
      if (!expanded && element.hasOwnProperty('months')) {
        (element as Year).months.forEach((month) => {
          if (month.expanded) {
            this.toggleExpanded(month, false);
          }
        });
      }
    },
    numberOfDayEntries(days: Day[], day: number): number {
      const index = days.findIndex((d) => d.day === day);
      return index === -1 ? 0 : days[index].entries.length;
    },
    showDayPopup(day: Day | undefined) {
      this.selectedDay = day;
      this.dayDialog = true;
    },
    getMonthLength(year: number, month: number): number {
      if ((month === 1 && year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
        // february in leap year
        return 29;
      }
      return [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
    },
    getDayOfFirstDay(year: number, month: number): number {
      const date = new Date(year.toString() + '/' + (month + 1).toString() + '/' + '1');
      return date.getDay();
    },
    getDayArray(year: number, month: number): string[] {
      const firstDay = this.getDayOfFirstDay(year, month);
      const numberOfDays = this.getMonthLength(year, month);
      const dayArray = new Array(firstDay === 0 ? 6 : firstDay - 1).map(() => ' ');
      for (let i = 1; i <= numberOfDays; i++) {
        dayArray.push(i.toString());
      }
      return dayArray;
    },
    buildDataStructure(entries: DiaryEntry[]) {
      this.years = [];
      entries.forEach((diaryEntry) => {
        const entryYear = diaryEntry.date.getFullYear();
        const entryMonth = diaryEntry.date.getMonth();
        const entryDay = diaryEntry.date.getDate();
        const yearEntry = {
          year: entryYear,
          numberOfEntries: 1,
          expanded: false,
          months: [
            {
              month: entryMonth,
              numberOfEntries: 1,
              expanded: false,
              days: [
                {
                  day: entryDay,
                  fullDate: new Date(`${entryYear}/${entryMonth + 1}/${entryDay}`),
                  expanded: false,
                  entries: [diaryEntry]
                }
              ]
            }
          ]
        };
        let foundYear = false;
        this.years.forEach((year) => {
          if (!foundYear && year.year === entryYear) {
            // we have already a entry for the year
            foundYear = true;
            let foundMonth = false;
            year.months.forEach((month) => {
              if (!foundMonth && month.month === entryMonth) {
                // we have already a entry for the month
                foundMonth = true;
                let foundDay = false;
                month.days.forEach((day) => {
                  if (!foundDay && day.day === entryDay) {
                    // we have already a entry for the exact day
                    foundDay = true;
                    day.entries.push(diaryEntry);
                    month.numberOfEntries++;
                    year.numberOfEntries++;
                  }
                });
                if (!foundDay) {
                  // create new day entry
                  month.days.push(yearEntry.months[0].days[0]);
                  month.days.sort((a, b) => a.day - b.day);
                  month.numberOfEntries++;
                  year.numberOfEntries++;
                }
              }
            });
            if (!foundMonth) {
              // create new month entry
              year.months.push(yearEntry.months[0]);
              year.months.sort((a, b) => a.month - b.month);
              year.numberOfEntries++;
            }
          }
        });
        if (!foundYear) {
          // create new year entry
          this.years.push(yearEntry);
          this.years.sort((a, b) => a.year - b.year);
        }
      });
    }
  },
  watch: {
    diary(diary: DiaryEntry[]): void {
      this.buildDataStructure(diary);
    }
  }
});
</script>

<style scoped lang="scss">
.year-tile {
  border-radius: 5px;
  border: 1px $text solid;
  padding: 1em;
  cursor: pointer;
  width: 45%;
  margin-bottom: 1em;
}
.year-tile .date {
  width: 100%;
  align-content: center;
}
.year-tile.expanded,
.month-tile.expanded {
  width: 100%;
  cursor: unset;
}
.year-tile.expanded {
  background-color: $lightGray;
}
.month-tile.expanded:hover {
  background-color: $lightText;
}
.year-tile.expanded .date {
  width: 100%;
  cursor: pointer;
  font-size: 0.6em;
}
.year-tile:hover,
.month-tile:hover {
  background-color: $lightGray;
}
.year-tile h1 {
  font-size: 2em;
  margin: 0;
  font-weight: bold;
  line-height: unset;
  text-align: center;
}
hr {
  margin: 1em 0;
  width: 100%;
  height: 1px;
  background-color: $gray;
  border-width: 0;
}
.year-tile p {
  text-align: center;
}
.month-tile {
  border-radius: 4px;
  border: 1px $text solid;
  padding: 0.5em;
  margin-bottom: 1em;
  width: 30%;
  background-color: $lightText;
}
.month-tile p {
  font-size: 1.5em;
}

.day-entry {
  width: 11%;
  height: 2vw;
  margin: 1.6%;
  min-width: 1.8em;
  min-height: 2em;
  line-height: 2em;
  color: $gray;
  text-align: center;
}
.day-entry.with-entries {
  font-weight: bold;
  border: 1px solid $primary;
  background-color: $primary;
  color: $text;
  border-radius: 20%;
  cursor: pointer;
}
.card-title.with-close-icon {
  padding-right: 2em;
}
.close-icon {
  cursor: pointer;
  color: #000000;
  right: 0.5em;
  top: 0.5em;
  position: absolute;
}
.day-entry-list {
  list-style: none;
  padding: 0;
}
.day-entry-list li {
  cursor: pointer;
  padding: 0.3em 0.5em;
  margin: 0.8em 1em;
  border-radius: 0.3em;
  text-align: center;
  border: 1px solid $text;
}
.day-entry-list li:hover {
  background-color: $primary;
}
</style>
