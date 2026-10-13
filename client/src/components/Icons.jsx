import React from 'react'

const paths = {
  ArrowUpRight: <><path d="M7 17 17 7" /><path d="M7 7h10v10" /></>,
  CalendarDays: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 17h.01M12 17h.01" /></>,
  CheckCircle2: <><circle cx="12" cy="12" r="9" /><path d="m8 12 2.5 2.5L16.5 9" /></>,
  Clock3: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.5 2" /></>,
  MapPin: <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
  QrCode: <><path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3z" /><path d="M14 14h3v3h-3zM20 14v3M14 20h3M20 20h1" /></>,
  ShieldCheck: <><path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" /><path d="m9 12 2 2 4-4" /></>,
  Ticket: <><path d="M3 8a2 2 0 0 0 0 4v4a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4a2 2 0 0 1 0-4V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2Z" /><path d="M13 5v2M13 11v2M13 17v2" /></>,
  MessageCircle: <><path d="M21 11.5a8.5 8.5 0 0 1-12.3 7.6L3 21l1.9-5.7A8.5 8.5 0 1 1 21 11.5Z" /></>,
  Send: <><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></>,
  X: <><path d="m18 6-12 12M6 6l12 12" /></>,
}

function Icon({ name, size = 20, className = '', ...props }) {
  return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>{paths[name]}</svg>
}

export const ArrowUpRight = (props) => <Icon name="ArrowUpRight" {...props} />
export const CalendarDays = (props) => <Icon name="CalendarDays" {...props} />
export const CheckCircle2 = (props) => <Icon name="CheckCircle2" {...props} />
export const Clock3 = (props) => <Icon name="Clock3" {...props} />
export const MapPin = (props) => <Icon name="MapPin" {...props} />
export const QrCode = (props) => <Icon name="QrCode" {...props} />
export const ShieldCheck = (props) => <Icon name="ShieldCheck" {...props} />
export const Ticket = (props) => <Icon name="Ticket" {...props} />
export const MessageCircle = (props) => <Icon name="MessageCircle" {...props} />
export const Send = (props) => <Icon name="Send" {...props} />
export const X = (props) => <Icon name="X" {...props} />
