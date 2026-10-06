const test = require('node:test');
const assert = require('node:assert/strict');
const { QuoteGhostDetector } = require('../src/index.js');

test('QuoteGhost: flags quotes unattended for >= 48 hours', () => {
  const detector = new QuoteGhostDetector({ slaHours: 48 });
  const asOf = new Date('2026-10-05T12:00:00Z');

  const quotes = [
    {
      id: 'q1',
      clientName: 'Metro Logistics',
      amount: 14000,
      sentAt: '2026-10-02T12:00:00Z', // 72 hours ago
      lastFollowUpAt: null,
      status: 'SENT'
    },
    {
      id: 'q2',
      clientName: 'Sunrise Dental',
      amount: 4500,
      sentAt: '2026-10-04T18:00:00Z', // 18 hours ago
      lastFollowUpAt: null,
      status: 'SENT'
    },
    {
      id: 'q3',
      clientName: 'Won Deal',
      amount: 20000,
      sentAt: '2026-10-01T12:00:00Z',
      status: 'ACCEPTED'
    }
  ];

  const report = detector.auditQuotes(quotes, asOf);
  assert.equal(report.totalQuotes, 3);
  assert.equal(report.activeQuotesCount, 2);
  assert.equal(report.unattendedCount, 1);
  assert.equal(report.unattendedValue, 14000);
  assert.equal(report.quotes[0].isGhosted, true);
  assert.equal(report.quotes[0].status, 'CRITICAL_GHOST');
  assert.equal(report.quotes[1].isGhosted, false);
});
