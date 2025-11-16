#!/usr/bin/env node
import { Command } from "commander";
import { writeFile } from 'fs/promises'
import { json } from "stream/consumers";
import * as os from 'os';

const program = new Command()

program
  .name('conductor')
  .description('Conductor we have a problem!!!')
  .version('1.0.0')

program
  .command('info [category]')
  .description('Display system information')
  .option('-j, --json', 'output as JSON')
  .option('-v, --verbose', 'show detailed information')
  .option('-o, --output <file>', 'save to file')
  .action(async (category, options) => {
    // collect system information
    const info: any = {
      platform: os.platform(),
      arch: os.arch(),
      nodeVersion: process.version,
      totalMemory: os.totalmem(),
      freeMemory: os.freemem(),
      cpuCount: os.cpus().length,
      hostname: os.hostname(),
      uptime: os.uptime()
    };
    // add verbose information if requested
    if (options.verbose) {
      info.homeDir = os.homedir();  
      info.tmpDir = os.tmpdir();
      info.loadAvg = os.loadavg();
      info.networkInterfaces = os.networkInterfaces()
    }
    // filter by category if provided 
    let displayInfo = info

    if (category) {
      switch (category.toLowerCase()) {
        case 'memory':
          displayInfo = {
            totalMemory: info.totalMemory,
            freeMemory: info.freeMemory
          }
          break;
        case 'cpu': 
          displayInfo = {
            cpuCount: info.cpuCount,
            loadAvg: os.loadavg()
          }
          break;
        case 'system': 
          displayInfo = {
            platform: info.platform,
            arch: info.arch,
            nodeVersion: info.nodeVersion
          }
          break;
        case 'network': 
          displayInfo = {
            hostName: info.hostname,
            networkInterfaces: os.networkInterfaces()
          }
          break;
        default:
          console.error(`Unkown category ${category}`)
          console.error('Valid categories: memory, cpu, system, network')
          process.exit(1)
      }
    }
    // format output
    let output: string

    if (options.json) {
      output = JSON.stringify(displayInfo, null, 2)
    } else {
      // human readable output
      output = formatHumanReadable(displayInfo)
    }

    // output or save to file 
    if (options.output) {
      await writeFile(options.output, output, 'utf-8');
      console.log(`Saved to ${options.output}`)
    } else {
      console.log(output)
    }
  });

  // Helper function for human readable formatting
  function formatHumanReadable(info: any): string {
    let output = 'System Information:\n';
    output += '==================\n';

    for (const [key, value] of Object.entries(info)) {
      if (key === 'totalMemory' || key === 'freeMemory') {
        const gb = ((value as number) / 1024 / 1024 / 1024).toFixed(2);
        output += `${formatKey(key)}: ${gb} GB\n`;
      } else if (key === 'uptime') {
        const hours = ((value as number) / 3600).toFixed(1);
        output += `${formatKey(key)}: ${hours} hours\n`;
      } else if (typeof value === 'object') {
        output += `${formatKey(key)}: ${JSON.stringify(value, null, 2)}\n`;
      } else {
        output += `${formatKey(key)}: ${value}\n`;
      }
    }

    return output;
  }

  function formatKey(key: string): string {
    // Convert camelCase to Title Case
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  }

program.parse(process.argv)