import { getRoofPlanView, PLAN_VIEWBOX } from '../../lib/quick-estimate/plan-view';
import type { ShapeId, SizeId } from '../../lib/quick-estimate/types';

/** Decorative plan view. The surrounding radio label supplies the accessible name. */
export function RoofPlanIllustration({ shape, size }: { shape: ShapeId; size: SizeId }) {
  const plan = getRoofPlanView(shape, size);
  return <svg className="qr-roof-plan" viewBox={`0 0 ${PLAN_VIEWBOX.width} ${PLAN_VIEWBOX.height}`} aria-hidden="true" focusable="false" data-roof-shape={shape} data-roof-size={size} data-plan-scale={plan.relativeScale}>
    <g className="qr-plan-faces">{plan.faces.map((f, i) => <path key={i} d={f.path} className={`qr-plan-${f.tone}`} strokeWidth=".4" strokeLinejoin="round" />)}</g>
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      {plan.edges.map((e, i) => <line key={i} className={`qr-plan-edge qr-plan-${e.kind}`} x1={e.start[0]} y1={e.start[1]} x2={e.end[0]} y2={e.end[1]} vectorEffect="non-scaling-stroke" />)}
      {plan.slopeArrow && <g className="qr-plan-direction">
        <line x1={plan.slopeArrow[0][0]} y1={plan.slopeArrow[0][1]} x2={plan.slopeArrow[1][0]} y2={plan.slopeArrow[1][1]} vectorEffect="non-scaling-stroke" />
        <path d={`M${plan.slopeArrow[1][0] - 3},${plan.slopeArrow[1][1] + 4} L${plan.slopeArrow[1][0]},${plan.slopeArrow[1][1]} L${plan.slopeArrow[1][0] + 3},${plan.slopeArrow[1][1] + 4}`} vectorEffect="non-scaling-stroke" />
      </g>}
    </g>
  </svg>;
}
