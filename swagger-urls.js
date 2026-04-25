#!/usr/bin/env node

/**
 * Swagger URLs Display Utility
 * Displays all available Swagger API documentation URLs in a formatted console output
 * Usage: node swagger-urls.js
 */

// Try to use chalk for colors, fallback to simple formatting
let chalk;
try {
  chalk = require('chalk');
} catch (e) {
  // Fallback without chalk
  chalk = {
    bold: (str) => str,
    green: (str) => str,
    red: (str) => str,
    yellow: (str) => str,
    cyan: (str) => str,
    gray: (str) => str,
    bgGreen: (str) => str,
    bgRed: (str) => str,
    white: (str) => str,
  };
}

// Service configurations
const services = [
  {
    name: 'Event Service',
    port: 4000,
    hasSwagger: true,
    path: '/api-docs',
  },
  {
    name: 'Booking Service',
    port: 4001,
    hasSwagger: true,
    path: '/api-docs',
  },
  {
    name: 'Review Service',
    port: 4002,
    hasSwagger: true,
    path: '/api-docs',
  },
  {
    name: 'User Service',
    port: 4003,
    hasSwagger: true,
    path: '/api-docs',
  },
  {
    name: 'Notification Service',
    port: 4004,
    hasSwagger: false,
  },
  {
    name: 'API Gateway',
    port: 3001,
    hasSwagger: false,
  },
];

// Display header
console.log('\n' + chalk.bgGreen(chalk.white('  📚 MICROSERVICE SWAGGER DOCUMENTATION URLS  ')) + '\n');

// Create table-like display
const withSwagger = services.filter((s) => s.hasSwagger);
const withoutSwagger = services.filter((s) => !s.hasSwagger);

// Display services WITH Swagger documentation
console.log(chalk.bold(chalk.green('✓ Services with Swagger Documentation:')));
console.log(chalk.gray('─'.repeat(80)));

withSwagger.forEach((service, index) => {
  const url = `http://localhost:${service.port}${service.path}`;
  console.log(
    chalk.cyan(`  ${index + 1}. ${service.name}`),
    chalk.gray('│'),
    chalk.yellow(`Port: ${service.port}`)
  );
  console.log(chalk.gray(`     └─ URL: `) + chalk.white(chalk.bold(url)));
  console.log();
});

// Display services WITHOUT Swagger documentation
if (withoutSwagger.length > 0) {
  console.log(chalk.bold(chalk.red('✗ Services without Swagger Documentation:')));
  console.log(chalk.gray('─'.repeat(80)));

  withoutSwagger.forEach((service) => {
    console.log(chalk.cyan(`  • ${service.name}`) + chalk.gray(` (Port: ${service.port})`));
  });
  console.log();
}

// Summary section
console.log(chalk.gray('─'.repeat(80)));
console.log(chalk.bold('Summary:'));
console.log(
  `  ${chalk.green(`✓ ${withSwagger.length}`)} services with documentation | ${chalk.red(`✗ ${withoutSwagger.length}`)} without`
);
console.log();

// Quick links section
console.log(chalk.bold(chalk.cyan('Quick Copy-Paste URLs:')));
console.log(chalk.gray('─'.repeat(80)));
withSwagger.forEach((service) => {
  const url = `http://localhost:${service.port}${service.path}`;
  console.log(`  ${chalk.gray(service.name.padEnd(25))} ${chalk.cyan(url)}`);
});
console.log();

// Docker note
console.log(chalk.gray('📌 Note: Ensure services are running via `docker compose up` before accessing URLs.'));
console.log(chalk.gray('🌐 Open any URL in your browser to view the Swagger documentation.\n'));

// Export for programmatic use if needed
module.exports = {
  services,
  getSwaggerUrls: () =>
    services.filter((s) => s.hasSwagger).map((s) => ({
      name: s.name,
      url: `http://localhost:${s.port}${s.path}`,
      port: s.port,
    })),
  getAllServices: () => services,
};
