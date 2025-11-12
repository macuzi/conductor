#!/usr/bin/env node
import { Command } from "commander";
import * as os from 'os'

const program = new Command()

program
  .name('conductor')
  .description('Diagnostic bundle generator CLI')
  .version('1.0.0')

program
  .command('info')
  .description('Display system information')
  .action(() => {
    // collect system information 
    const platform = os.platform()
    const arch = os.arch()
    const nodeVersion = process.version
    const totalMemoryGB = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2)
    const freeMemoryGB = (os.freemem() / 1024 / 1024 / 1024).toFixed(2)
    const cpuCount = os.cpus().length
    const hostname = os.hostname()
    const uptimeHours = (os.uptime() / 3600).toFixed(1)
    // display formatted output
    console.log('System Information:');
    console.log('==================');
    console.log(`Platform: ${platform}`);
    console.log(`Architecture: ${arch}`);
    console.log(`Node.js: ${nodeVersion}`);
    console.log(`Total Memory: ${totalMemoryGB} GB`);
    console.log(`Free Memory: ${freeMemoryGB} GB`);
    console.log(`CPUs: ${cpuCount}`);
    console.log(`Hostname: ${hostname}`);
    console.log(`Uptime: ${uptimeHours} hours`);
  })

program.parse(process.argv)