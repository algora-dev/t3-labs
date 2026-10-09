/** Browser-only enquiry previews. No transport, persistence or credentials. */
export interface DemoContact { name: string; email: string; phone: string; address?: string; postcode?: string; notes?: string; contactPreference?: string }
export interface DemoFile { name: string; sizeBytes: number; contentType: string }
export function validateDemoContact(contact: DemoContact): string | null {
  if (!contact.name.trim()) return 'Please enter a name, or use the example details.';
  if (!contact.email.trim() && !contact.phone.trim()) return 'Add an email address or phone number.';
  if (contact.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(contact.email.trim())) return 'Please check the email address.';
  if (contact.phone.trim() && contact.phone.replace(/\D/g, '').length < 7) return 'Please check the phone number.';
  if (contact.contactPreference === 'call' && !contact.phone.trim()) return 'Add a phone number, or select email as your preferred contact method.';
  return null;
}
export function describeDemoFile(file: { name: string; type: string; size: number }): DemoFile | null {
  if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf', 'text/plain'].includes(file.type)
    || !file.size || file.size > 2500000 || !file.name || file.name.length > 200) return null;
  return { name: file.name, sizeBytes: file.size, contentType: file.type };
}
