// Actual component entry for the self-contained review HTML. No successful AI responses are mocked.
import React from 'react';
import { createRoot } from 'react-dom/client';
import { ApexDemoShell } from '../../components/demo-journey/ApexDemoShell';
import { ActRoofingSite } from '../../components/demo-sites/act-roofing/act-roofing-site';
import { actRoofingSite } from '../../components/demo-sites/act-roofing/site-config';
import EstimateChoicePage from '../../app/demo/roofing-site/estimate/page';
import { ApexContentPage } from '../../components/demo-sites/apex-pages/ApexContentPage';
import { findApexPage } from '../../components/demo-sites/apex-pages/apex-page-content';
import { PriceListPage } from '../../components/demo-sites/act-roofing/PriceListPage';
import priceListConfig from '../../components/demo-sites/act-roofing/price-list.config';
import theme from '../../components/demo-sites/act-roofing/theme.config';
import { ApexToolHeader } from '../../components/demo-helper/ApexToolHeader';
import { QuickRoofEstimate } from '../../components/quick-estimate/QuickRoofEstimate';
import { SmartAssistantLauncher } from '../../components/assistant/SmartAssistantLauncher';
import { ToolShell } from '../../app/supplier-pricing-tool/ToolShell';
import { AdminPanel } from '../../app/supplier-pricing-tool/admin/AdminPanel';
import { SupplierConfigProvider } from '../../app/supplier-pricing-tool/supplierConfig';
import { FreeToolsAuthProvider } from '../../app/_components/FreeToolsAuthProvider';
import { usePathname } from 'next/navigation';
import SupplierQuotePage from '../../app/supplier-pricing-tool/quote/page';
function App() {
  const p = usePathname();
  const admin = p.endsWith('/admin');
  const contentPage = p.startsWith('/demo/roofing-site/') ? findApexPage(p.slice('/demo/roofing-site/'.length).split('/')) : null;
  if (p === '/supplier-pricing-tool/quote') return <SupplierQuotePage />;
  let content;
  if (p.endsWith('/quick-estimate')) content = <QuickRoofEstimate {...window.__APEX_DATA} />;
  else if (p.endsWith('/estimate')) content = <EstimateChoicePage />;
  else if (p.endsWith('/price-list')) content = <PriceListPage theme={theme} config={priceListConfig} />;
  else if (admin) content = <AdminPanel key={p} slug="apex-roofing" />;
  else if (p.startsWith('/supplier-pricing-tool/') || p.endsWith('/takeoff')) content = <FreeToolsAuthProvider><SupplierConfigProvider slug="apex-roofing"><ToolShell /></SupplierConfigProvider></FreeToolsAuthProvider>;
  else if (p === '/demo/roofing-site') content = <ActRoofingSite site={actRoofingSite} />;
  else if (contentPage) content = <ApexContentPage page={contentPage} />;
  else content = <><ApexToolHeader title="Website page" /><main className="at-choice-page"><h1>This page needs the running website.</h1><p>The homepage, service pages and local estimates in this preview use their actual source. Live chat, generated PDFs and the uploaded-plan workspace need the full app.</p><a href="/demo/roofing-site">Back to Apex Roofing</a></main></>;
  return <div id="act-demo-root"><ApexDemoShell>{content}</ApexDemoShell>{!admin && <SmartAssistantLauncher />}</div>;
}
class PreviewBoundary extends React.Component {
  state = { error: false };
  static getDerivedStateFromError() { return { error: true }; }
  componentDidCatch(error) { console.error('Apex preview error', error); }
  render() {
    if (this.state.error) return <div className="preview-fallback" role="alert"><h1>The preview could not start.</h1><p>Open the downloaded HTML in a browser with JavaScript enabled, or use the website ZIP in your application. No enquiry has been sent.</p><button onClick={() => window.location.reload()}>Reload preview</button></div>;
    return this.props.children;
  }
}
createRoot(document.getElementById('root')).render(<PreviewBoundary><App /></PreviewBoundary>);
