# Quick Roof Estimate: build plan and measurement model

## Purpose and boundaries

Build a homeowner-friendly route to roof quantities first, then apply a business catalogue. This is the third tool alongside manual estimating and digital plan measurement. It is not a site survey, a structural design tool, a guaranteed quote or a replacement for the existing detailed estimator.

The broader guided sales demonstration is a subsequent phase. Its question is: "How would your customer get this answer from your website today?" The initial tool includes an optional example task, not a complete four-experience tour.

## Agreed rules

| Input | Configuration |
| --- | --- |
| Small footprint | 60-100 m² |
| Small to medium | 100-150 m² |
| Medium | 150-190 m² |
| Medium to large | 190-250 m² |
| Large | 250-300 m² |
| Low pitch | 5-15° |
| Typical pitch | 15-30° |
| Steep pitch | 30-50° |
| Storeys | Access and working cost only, never more roof area |
| Flat roof | Separate membrane category, no pitched-area conversion |
| Mixed roof | Optional additional flat section, measured separately |
| Price approaches | Component recipes or separately configured area rates |

The bands are horizontal roof footprints. The implementation treats these as including overhangs, avoiding a second hidden area uplift. This convention is stated in the interface. Size is not total internal floor area across storeys.

## Geometry

Each roof template consists of rectangular volumes with planar roof faces. Intersections are resolved into a non-overlapping visible roof surface. Internal coplanar seams are not measured. Shared edges are classified as ridges, hips or valleys; exterior edges become eaves, verges or high edges. Dormer height discontinuities generate flashing junctions.

The same mesh drives the SVG selection card and the quantity calculation. There is no separately maintained illustration with incompatible roof components.

For reference footprint A0 and requested footprint A:

- Linear scale s = sqrt(A / A0).
- Horizontal coordinates are multiplied by s.
- Roof height is multiplied by s * tan(pitch).
- Surface area for uniform-pitch faces is A / cos(pitch).
- Each component length is measured between its scaled 3D endpoints.
- Hips and valleys use their actual diagonal geometry, not the face-slope multiplier.

For a simple gable with length L and width W:

- Roof area = L * W / cos(pitch).
- Ridge = L.
- Eaves = 2 * L.
- Four verges together = 2 * W / cos(pitch).

Low uses minimum footprint and minimum pitch. High uses maximum footprint and maximum pitch. These are two coherent representative roofs at the same template aspect ratio, not independently selected minima and maxima. They are not statistically calibrated confidence bounds. Footprint/pitch bands and fixed proportions may produce a broad range; there is no additional arbitrary 25% price spread.

## Template library

| ID | Homeowner label | Reference plan envelope | Notes |
| --- | --- | --- | --- |
| mono | Single slope | 10 x 6 | One slope, high-edge detailing separate |
| gable | Simple gable | 10 x 6 | One ridge and four verge runs |
| hip | Hipped roof | 10 x 6 | Four hips and all-round eaves |
| l_gable | L-shaped roof | 10 x 10 | L footprint formed by overlapping wings |
| t_gable | T-shaped roof | 12 x 10 | Projecting gable and roof intersections |
| l_hip | Hip and valley | 10 x 10 | L-shaped hipped wings |
| u_gable | U-shaped roof | 14 x 12 | Two wings with recessed centre |
| dormer | Roof with dormers | 12 x 8 | Two representative dormers |
| complex | Multiple roof sections | 14 x 17 | Intersecting hip and gable volumes |
| flat | Flat membrane roof | 10 x 6 | Plan area and perimeter only |

Dimensions describe a reference bounding envelope, not the area of every irregular footprint. The engine uses the union footprint, not envelope length times width. These proportions are provisional design assumptions for expert review, not researched housing averages.

Additional provisional settings are extension bands 10-20, 20-35 and 35-50 m², a single-storey extension, and reference access heights of 3 m / 6 m. Height is metadata, not a scaffolding takeoff or an approved rate.

## Price boundary

Geometry knows nothing about material prices. Each endpoint is sent to the existing supplier estimator as actual surface measurements, preventing double pitch conversion. Each measurement retains its owning roof section.

Component mode applies configured area products and edge products through the existing priceOutput function. Existing product waste and labour rules remain authoritative. Optional complexity factors affect component labour only, not material totals.

Area mode takes business-provided material and labour rates per square metre, including the named component scope. An optional business-approved shape factor applies in this mode. It does not add component recipe lines again. There is no hardcoded all-in rate in this build.

Working height/access allowances are independent of geometry. A missing allowance is not represented as an included zero cost. Re-roof stripping uses actual surface area before product waste; disposal is added once per job. For a flat extension, an existing membrane covering is assumed and disclosed. If material-specific disposal allowances differ, the largest is used once and the mixed-waste specification is marked as needing confirmation.

Material pitch compatibility is separate from geometric validity. A roof can be measured even when its selected material has no compatible configured pitch. A partly compatible band is priced only over its valid subrange and clearly labelled. Measurements still show the full chosen band.

## Stages and current status

1. Inspect existing boundaries and establish baseline: complete. The assistant and supplier estimator use separate pricing models. This build integrates with the supplier engine; it does not falsely unify both catalogues.
2. Build price-independent templates, quantities and regression tests: complete.
3. Add business pricing adapter, two modes, eligibility and missing-rate reporting: complete. Only existing Apex tile/slate recipes are populated.
4. Build responsive homeowner flow, shared SVGs, results and explicit detailed-estimator import: complete.
5. Validate: automated geometry/pricing/API tests and standalone browser checks complete. Full dependency-backed Next build, lint, project-wide typecheck and deployed integration remain blocked by unavailable dependency installation in this environment.
6. Review roof templates and sample quantities with the business, then add approved missing products, access, waste, labour, tax and flat/metal systems.
7. Build the full guided sales journey, trade-account demonstration and genuine AI/MCP integrations as separate work. Public tool availability does not itself guarantee search discovery or recommendations.

## Review method

Run scripts/quick-roof-reference.mjs to regenerate docs/quick-roof-reference.json. It contains all 135 pitched combinations and five flat combinations, without prices. Compare these with representative real roofs before accepting the model for customer-facing quotations. Pay particular attention to complex/dormer layouts, footprint proportions, extension junctions and the wide steep-pitch band.
