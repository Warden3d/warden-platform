import test from 'node:test';
import assert from 'node:assert/strict';
import { mapRequestRecord } from '../src/lib/data/request-records.ts';

function persistedRequest() {
  return {
    id: 'request-1', reference: 'WDN-2026-000001',
    created_at: '2026-09-27T10:00:00Z', updated_at: '2026-09-27T10:01:00Z',
    locale: 'en', currency: 'EUR', status: 'received',
    first_name: 'Test', last_name: 'Customer', email: 'test@example.invalid',
    country: 'España', postal_code: '28001', city: 'Madrid',
    phone: null, company: null, region: null, notes: 'Please quote shipping',
    product_subtotal: 70, shipping_status: 'pending_calculation', shipping_cost: null,
    customer_email_status: 'sent', internal_email_status: 'failed', email_send_attempts: 2,
    internal_notes: 'Follow up manually', quote_reference: null, erpnext_reference: null,
    request_lines: ['product', 'bundle', 'drop'].map((type, i) => ({
      entity_id: `retired-${type}`, entity_type: type,
      name: `Historical ${type}`, sku: `OLD-${i}`, quantity: i + 1,
      configuration: i === 0 ? [{ capabilityId: 'finish', optionId: 'raw', label: 'Sin pintar' }] : null,
      unit_price: 10, line_subtotal: (i + 1) * 10,
      slug: null, image: null,
    })),
  };
}

test('reads the persisted customer and historical product, bundle and drop snapshots', () => {
  const row = persistedRequest();
  const req = mapRequestRecord(row);
  assert.equal(req.reference, 'WDN-2026-000001');
  assert.equal(req.client.firstName, 'Test');
  assert.equal(req.client.postalCode, '28001');
  assert.equal(req.client.notes, 'Please quote shipping');
  assert.deepEqual(req.lines.map(({ entityType, name, sku, quantity, unitPrice, lineSubtotal }) =>
    [entityType, name, sku, quantity, unitPrice, lineSubtotal]), [
    ['product', 'Historical product', 'OLD-0', 1, 10, 10],
    ['bundle', 'Historical bundle', 'OLD-1', 2, 10, 20],
    ['drop', 'Historical drop', 'OLD-2', 3, 10, 30],
  ]);
  assert.deepEqual(req.lines[0].configuration, row.request_lines[0].configuration);
  // Preserve recorded amounts even when they differ from a recomputed total.
  assert.equal(req.productSubtotal, 70);
});

test('a failed internal email does not hide the saved request or conflate customer status', () => {
  const req = mapRequestRecord(persistedRequest());
  assert.equal(req.status, 'received');
  assert.equal(req.internalEmailStatus, 'failed');
  assert.equal(req.customerEmailStatus, 'sent');
  assert.equal(req.emailSendAttempts, 2);
  assert.equal(req.lines.length, 3);
  assert.equal(req.internalNotes, 'Follow up manually');
});

test('keeps pending shipping distinct from a calculated zero and handles nullable columns', () => {
  const row = persistedRequest();
  const pending = mapRequestRecord(row);
  assert.equal(pending.shippingCost, null);
  assert.equal(pending.shippingStatus, 'pending_calculation');
  assert.equal(pending.client.phone, undefined);
  assert.equal(pending.lines[1].configuration, undefined);
  assert.equal(pending.quoteReference, null);
  const free = mapRequestRecord({ ...row, shipping_cost: 0, shipping_status: 'calculated' });
  assert.equal(free.shippingCost, 0);
  assert.equal(free.shippingStatus, 'calculated');
});
