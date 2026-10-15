const fs = require('fs');
const { execSync } = require('child_process');

const files = fs.readdirSync('tests').filter(f => f.endsWith('.ts'));
console.log(`=== RUNNING ALL ${files.length} TEST SUITES IN tests/ DIRECTORY ===\n`);
let passed = 0;
let failed = 0;

for (const f of files) {
  try {
    process.stdout.write(`• Testing ${f.padEnd(42, ' ')} ... `);
    execSync(`npx tsx tests/${f}`, { stdio: 'pipe' });
    console.log('PASSED ✅');
    passed++;
  } catch (e) {
    console.log('FAILED ❌');
    console.error(`\n--- ERROR IN ${f} ---\n` + (e.stdout ? e.stdout.toString() : e.message) + '\n');
    failed++;
  }
}

console.log('\n========================================');
console.log(`TOTAL SUITES: ${files.length}`);
console.log(`PASSED: ${passed}`);
console.log(`FAILED: ${failed}`);

if (failed > 0) {
  process.exit(1);
} else {
  console.log('🌟 ALL TEST SUITES PASSED 100%!');
}
