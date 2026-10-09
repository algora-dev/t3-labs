/** Test-only persistence boundary. Imported exclusively by the isolated route test. */
export const NextResponse = { json: (body, init) => Response.json(body, init) };
export const fixtureSession = {
  facts: { projectType: 'reroof', roofArea: 120, areaType: 'actual_roof_area', roofShape: 'gable', pitchDegrees: 25, material: 'Concrete tile', location: 'Leeds', estimateScope: 'specified_components', components: [], extras: [] },
  lead: { name: null, email: null, phone: null },
  estimateFlow: { latestEstimateId: 'test-estimate' },
  estimates: { 'test-estimate': { id: 'test-estimate', catalogVersion: 'test-fixture', total: 1000, currency: 'GBP', symbol: '£', status: 'indicative', project: { componentScope: 'specified_components' }, lineItems: [{ label: 'Test fixture', subtotal: 1000 }], assumptions: ['Test fixture, not a live price'], disclaimer: 'Test only' } },
  draft: null, messages: [], inquiries: [],
};
export async function getOrCreateSession() { return fixtureSession; }
export async function saveSession() { throw new Error('Demo preview must not write to session storage'); }
