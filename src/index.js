/**
 * @gideon/quote-ghost-detector
 * Project #05 in the Master 50 Business Problem & Revenue Leak Weapons
 * 
 * Commercial Mission:
 * Tracks outstanding quotes and proposals, triggers automated alerts when
 * a quote crosses 48h without follow-up, and quantifies unattended pipeline value.
 */

class QuoteGhostDetector {
  constructor(options = {}) {
    this.slaHours = options.slaHours || 48; // Standard 48-hour follow-up SLA
  }

  auditQuotes(quotes, asOfTime = new Date()) {
    const now = new Date(asOfTime).getTime();
    const audited = [];

    quotes.forEach(quote => {
      const sentTime = new Date(quote.sentAt).getTime();
      const lastFollowUp = quote.lastFollowUpAt ? new Date(quote.lastFollowUpAt).getTime() : null;
      const isAccepted = ['ACCEPTED', 'PAID', 'WON'].includes(quote.status);
      const isRejected = ['REJECTED', 'DECLINED', 'LOST'].includes(quote.status);

      if (isAccepted || isRejected) return;

      const elapsedHours = Math.floor((now - (lastFollowUp || sentTime)) / (1000 * 60 * 60));
      const isGhosted = elapsedHours >= this.slaHours;

      let status = 'HEALTHY';
      if (elapsedHours >= 72) status = 'CRITICAL_GHOST';
      else if (elapsedHours >= this.slaHours) status = 'NEEDS_FOLLOW_UP';
      else if (elapsedHours >= 24) status = 'PENDING_SLA';

      audited.push({
        quoteId: quote.id,
        clientName: quote.clientName,
        amount: Number(quote.amount || 0),
        sentAt: new Date(sentTime).toISOString(),
        lastFollowUpAt: lastFollowUp ? new Date(lastFollowUp).toISOString() : null,
        elapsedHours,
        isGhosted,
        status,
        rep: quote.assignedRep || 'Unassigned'
      });
    });

    const totalQuotedValue = quotes.reduce((sum, q) => sum + Number(q.amount || 0), 0);
    const unattendedQuotes = audited.filter(q => q.isGhosted);
    const unattendedValue = unattendedQuotes.reduce((sum, q) => sum + q.amount, 0);

    return {
      totalQuotes: quotes.length,
      activeQuotesCount: audited.length,
      unattendedCount: unattendedQuotes.length,
      totalQuotedValue,
      unattendedValue,
      unattendedRatio: audited.length > 0 ? Math.round((unattendedQuotes.length / audited.length) * 100) : 0,
      quotes: audited
    };
  }
}

module.exports = {
  QuoteGhostDetector
};
