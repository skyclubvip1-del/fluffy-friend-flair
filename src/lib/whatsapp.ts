// Centralised WhatsApp helpers for SKY CLUB
export const WHATSAPP_PHONE = "34677263672";

export const buildWhatsAppUrl = (message: string) =>
  `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;

export const reserveServiceMessage = (service: string, price: string) =>
  `Hola SKY CLUB 👋, me gustaría reservar: ${service} (${price}). ¿Qué disponibilidad tenéis?`;

export const generalReserveMessage = () =>
  `Hola SKY CLUB 👋, me gustaría reservar una cita en la barbería. ¿Qué disponibilidad tenéis?`;
