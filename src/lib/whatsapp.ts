type TemplateData = Record<string, string | number | undefined | null>;

/** Replace template variables like {customer_name} with order/customer data. */
export function renderMessageTemplate(template: string, data: TemplateData) {
  return template.replace(/\{([^}]+)\}/g, (_, key: string) => String(data[key] ?? ""));
}

/** Create WhatsApp web URL with country-code cleanup. */
export function buildWhatsAppUrl(phone: string, message: string) {
  const normalized = phone.replace(/[^0-9]/g, "");
  return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`;
}
