const test = require('node:test');
const assert = require('node:assert/strict');
const { QuoteGhostDetector } = require('../src/index.js');

test('QuoteGhost Edge Cases: handles empty quotes array without throwing', () => {
  const detector = new QuoteGhostDetector();
  const res = detector.auditQuotes([]);
  assert.equal(res.totalQuotes, 0);
  assert.equal(res.unattendedCount, 0);
  assert.equal(res.unattendedValue, 0);
});

test('QuoteGhost Edge Cases: ignores rejected/declined quotes', () => {
  const detector = new QuoteGhostDetector();
  const res = detector.auditQuotes([{ id: 'q_lost', sentAt: '2026-09-01T00:00:00Z', status: 'REJECTED' }]);
  assert.equal(res.activeQuotesCount, 0);
  assert.equal(res.unattendedCount, 0);
});
