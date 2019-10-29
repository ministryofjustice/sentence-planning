const throng = require('throng')
const { readFileSync, unlink, writeFileSync } = require('fs')
const { join } = require('path')
const logger = require('./common/logging/logger')
const { start: _start } = require('./server')

const pidFile = join(__dirname, '/.start.pid')
const fileOptions = { encoding: 'utf-8' }
let pid

/**
 * Throng is a wrapper around node cluster
 * https://github.com/hunterloftis/throng
 */
function start() {
  throng({
    workers: process.env.NODE_WORKER_COUNT || 1,
    master: startMaster,
    start: startWorker,
  })
}

/**
 * Start master process
 */
function startMaster() {
  logger.info(`Master started. PID: ${process.pid}`)
  process.on('SIGINT', () => {
    logger.info(`Master exiting`)
    process.exit()
  })
}

/**
 * Start cluster worker. Log start and exit
 * @param  {Number} workerId
 */
function startWorker(workerId) {
  _start()

  logger.info(`Started worker ${workerId}, PID: ${process.pid}`)

  process.on('SIGINT', () => {
    logger.info(`Worker ${workerId} exiting...`)
    process.exit()
  })
}

/**
 * Make sure all child processes are cleaned up
 */
function onInterrupt() {
  pid = readFileSync(pidFile, fileOptions)
  unlink(pidFile, err => {
    if (err) throw err
    logger.info('File successfully deleted')
  })
  process.kill(pid, 'SIGTERM')
  process.exit()
}

/**
 * Keep track of processes, and clean up on SIGINT
 */
function monitor() {
  writeFileSync(pidFile, process.pid, fileOptions)
  process.on('SIGINT', onInterrupt)
}

monitor()

start()
