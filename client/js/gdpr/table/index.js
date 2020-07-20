export class GdprTable {
  /**
   * @param {HTMLDivElement} chart The element that contains the chart.
   * @param {Map<string, number[]>} histories The ranking history for each
   * track.
   * @param {Date[]} dates The date of each history entry.
   */
  constructor(chart, histories, dates) {
    this.table = document.createElement('table');
    this.chart = chart;
    this.histories = histories;
    this.dates = dates;
    this.setup();
  }

  /**
   * Sets up the GDPR table by (attaching event handlers, etc.)
   *
   * @private
   */
  setup() {
    this.chart.addEventListener('series-hit', this.onSeriesHit.bind(this));
  }

  /**
   * Fires when the user hovers over a series on the chart.
   *
   * @param {CustomEvent} ev The 'series-hit' event object.
   * @private
   */
  onSeriesHit(ev) {
    const {x, y} = ev.detail;
    const ranking = [];

    for (const [key, history] of this.histories) {
      // song's rank at this x position (i.e., date)
      const rank = history[x];
      // true if this is the song the user hovered over
      const selected = rank === y;

      if (rank === undefined || rank === null) {
        continue;
      }

      ranking.push({key, rank, selected});
    }

    // sort by rank ascending
    ranking.sort((a, b) => a.rank < b.rank ? -1 : 1);

    // update the table
    this.table.innerHTML = '';

    for (const {key, rank, selected} of ranking) {
      const row = document.createElement('tr');
      const rankCell = document.createElement('td');
      const keyCell = document.createElement('td');

      row.classList.add('gdpr-track');
      row.classList.toggle('gdpr-track-selected', selected);

      rankCell.innerText = `#${rank}`;
      keyCell.innerText = key;

      row.append(rankCell, keyCell);

      this.table.append(row);
    }
  }

  /**
   * Places this table in `container`.
   *
   * @param {HTMLElement} container The container for this GDPR table.
   * @public
   */
  mount(container) {
    container.append(this.table);
  }
}
