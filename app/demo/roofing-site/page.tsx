import { ActRoofingSite, createActRoofingMetadata } from "@/components/demo-sites/act-roofing/act-roofing-site";
import { actRoofingSite } from "@/components/demo-sites/act-roofing/site-config";

export const metadata = createActRoofingMetadata(actRoofingSite);

export default function ActRoofingDemoHomePage() {
  return <ActRoofingSite site={actRoofingSite} />;
}
