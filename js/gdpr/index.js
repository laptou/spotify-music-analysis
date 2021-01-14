/**
 * @file This file currently works on mock data, just to make sure that the
 * chart works.
 */
// @ts-check
// eslint-disable-next-line max-len
/** @typedef {import('./analysis.js').CollatedGDPRRecords} CollatedGDPRRecords */

import {
  collateStreamingData, getStreamingData, getStreamingHistory,
} from './analysis.js';
import './chart.js';
import './table.js';
import './time-stats.js';
import {BASE_URL} from '../util.js';

const {zip} = window;

zip.workerScriptsPath = new URL('js/zip/', BASE_URL).toString();

/** @type {import('./chart.js').GdprChart} */
const chart = document.getElementById('gdpr-chart');

/** @type {import('./table.js').GdprTable} */
const table = document.getElementById('gdpr-table');

/** @type {import('./time-stats.js').GdprTimeStats} */
const timeStats = document.getElementById('gdpr-time-stats');

const btnUploadFile =
  /** @type {HTMLButtonElement} */
  (document.getElementById('btn-data-upload'));

btnUploadFile.addEventListener('click', async () => {
  const inputUpload =
      /** @type {HTMLInputElement} */
      (document.getElementById('input-data-upload'));

  inputUpload.click();

  await new Promise(
      (resolve) => inputUpload.addEventListener(
          'change',
          resolve,
          {once: true},
      ),
  );

  if (!inputUpload.files) return;

  const fileUpload = inputUpload.files.item(0);
  if (!fileUpload) return;

  await processUpload(fileUpload);
});

/**
 * Processes a GPDR data file uploaded by the user and displays the
 * visualization.
 *
 * @param {Blob} blob The file that was uploaded.
 */
async function processUpload(blob) {
  const records = await getStreamingData(blob);

  const collatedRecords = collateStreamingData(records);

  const rankings = getStreamingHistory(collatedRecords);

  timeStats.load(records);
  chart.load(rankings.history, rankings.dates);
  table.load(rankings.history, rankings.dates);
}
