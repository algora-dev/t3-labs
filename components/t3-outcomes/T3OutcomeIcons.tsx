// Lucide icons, vendored under ISC/MIT; see ICONS-LICENSE.txt.
import { createElement, type SVGProps } from "react";
type IconProps = SVGProps<SVGSVGElement> & { size?: number };
type IconNode = [string, Record<string, string>];
function icon(nodes: IconNode[]) {
  return function Icon({ size = 24, strokeWidth = 2, ...props }: IconProps) {
    return createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true, ...props }, ...nodes.map(([tag, attrs]) => createElement(tag, attrs)));
  };
}
export const ArrowUpRight = icon([["path",{"d":"M7 7h10v10","key":"1tivn9"}],["path",{"d":"M7 17 17 7","key":"1vkiza"}]]);
export const Search = icon([["path",{"d":"m21 21-4.34-4.34","key":"14j7rj"}],["circle",{"cx":"11","cy":"11","r":"8","key":"4ej97u"}]]);
export const ChartNoAxesCombined = icon([["path",{"d":"M12 16v5","key":"zza2cw"}],["path",{"d":"M16 14.639V21","key":"1s85h0"}],["path",{"d":"M20 10.656V21","key":"q45596"}],["path",{"d":"m22 3-8.646 8.646a.5.5 0 0 1-.708 0L9.354 8.354a.5.5 0 0 0-.707 0L2 15","key":"1fw8x9"}],["path",{"d":"M4 18.463V21","key":"1otddq"}],["path",{"d":"M8 14.656V21","key":"1t2idw"}]]);
export const MousePointer2 = icon([["path",{"d":"M4.037 4.688a.495.495 0 0 1 .651-.651l16 6.5a.5.5 0 0 1-.063.947l-6.124 1.58a2 2 0 0 0-1.438 1.435l-1.579 6.126a.5.5 0 0 1-.947.063z","key":"edeuup"}]]);
export const MessagesSquare = icon([["path",{"d":"M16 10a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 14.286V4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z","key":"1n2ejm"}],["path",{"d":"M20 9a2 2 0 0 1 2 2v10.286a.71.71 0 0 1-1.212.502l-2.202-2.202A2 2 0 0 0 17.172 19H10a2 2 0 0 1-2-2v-1","key":"1qfcsi"}]]);
export const Workflow = icon([["rect",{"width":"8","height":"8","x":"3","y":"3","rx":"2","key":"by2w9f"}],["path",{"d":"M7 11v4a2 2 0 0 0 2 2h4","key":"xkn7yn"}],["rect",{"width":"8","height":"8","x":"13","y":"13","rx":"2","key":"1cgmvn"}]]);
export const ListFilter = icon([["path",{"d":"M2 5h20","key":"1fs1ex"}],["path",{"d":"M6 12h12","key":"8npq4p"}],["path",{"d":"M9 19h6","key":"456am0"}]]);
export const UsersRound = icon([["path",{"d":"M18 21a8 8 0 0 0-16 0","key":"3ypg7q"}],["circle",{"cx":"10","cy":"8","r":"5","key":"o932ke"}],["path",{"d":"M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3","key":"10s06x"}]]);
export const Zap = icon([["path",{"d":"M15.914 4a1.5 1.5 0 00-2.474-1.561l-9 9A1.5 1.5 0 005.5 14h4.002a.5.5 0 01.471.666L8.086 20a1.5 1.5 0 002.475 1.56l9-9A1.5 1.5 0 0018.5 10h-3.997a.5.5 0 01-.472-.667z","key":"1v7up4"}]]);
export const Play = icon([["path",{"d":"M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z","key":"10ikf1"}]]);
export const Pause = icon([["rect",{"x":"14","y":"3","width":"5","height":"18","rx":"1","key":"kaeet6"}],["rect",{"x":"5","y":"3","width":"5","height":"18","rx":"1","key":"1wsw3u"}]]);
export const RotateCcw = icon([["path",{"d":"M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8","key":"1357e3"}],["path",{"d":"M3 3v5h5","key":"1xhq8a"}]]);
export const Maximize = icon([["path",{"d":"M8 3H5a2 2 0 0 0-2 2v3","key":"1dcmit"}],["path",{"d":"M21 8V5a2 2 0 0 0-2-2h-3","key":"1e4gt3"}],["path",{"d":"M3 16v3a2 2 0 0 0 2 2h3","key":"wsl5sc"}],["path",{"d":"M16 21h3a2 2 0 0 0 2-2v-3","key":"18trek"}]]);
export const X = icon([["path",{"d":"M18 6 6 18","key":"1bl5f8"}],["path",{"d":"m6 6 12 12","key":"d8bk6v"}]]);
