// console.log(`You can write scripts here that will be browserfied`)
const { initAll } = require('govuk-frontend')

window.initAll = initAll
window.accessibleAutocomplete = require('accessible-autocomplete')

window.initReorderList = require('../templates/components/reorder-list/reorder-list.js')
