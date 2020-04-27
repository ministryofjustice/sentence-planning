module.exports = rootElementClass => {
  const rootElement = $(`.${rootElementClass}`)
  const updateRow = row => {
    row.find('.reorder-up').prop('hidden', row.prev('.govuk-summary-list__row').length === 0)
    row.find('.reorder-down').prop('hidden', row.next('.govuk-summary-list__row').length === 0)
  }
  const updateRows = (current, swap) => {
    const currentPriority = current.find('.reorder-priority')
    const currentPriorityValue = currentPriority.val()
    const swapPriority = swap.find('.reorder-priority')
    const swapPriorityValue = swapPriority.val()
    currentPriority.val(swapPriorityValue)
    swapPriority.val(currentPriorityValue)
    updateRow(current)
    updateRow(swap)
  }
  rootElement.find('.reorder-up').click(({ target }) => {
    const current = $(target).closest('.govuk-summary-list__row')
    const previous = current.prev('.govuk-summary-list__row')
    if (previous.length !== 0) {
      current.insertBefore(previous)
      updateRows(current, previous)
    }
    return false
  })

  rootElement.find('.reorder-down').click(({ target }) => {
    const current = $(target).closest('.govuk-summary-list__row')
    const next = current.next('.govuk-summary-list__row')
    if (next.length !== 0) {
      current.insertAfter(next)
      updateRows(current, next)
    }
    return false
  })
}
