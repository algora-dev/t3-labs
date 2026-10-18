import { RooflineSite, createRooflineMetadata } from "@/components/demo-sites/roofline/roofline-site";
import { rooflineSite } from "@/components/demo-sites/roofline/site-config";

export const metadata = createRooflineMetadata(rooflineSite);

export default function RooflineDemoHomePage() {
  return <RooflineSite site={rooflineSite} />;
}
