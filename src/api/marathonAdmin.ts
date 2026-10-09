import { callAPI } from "./crudFactory";

export type MarathonRow = {
  id: number;
  name: string;
  description?: string | null;
  status: string;
  fee: number | string;
  usd_fee?: number | string | null;
  paid_count?: number;
  confirmed_count?: number;
  participants?: { user_id: number; name: string; confirmed_at?: string | null }[];
  categories: string[];
  visible_from?: string | null;
  visible_until?: string | null;
  starts_at: string;
  ends_at: string;
  ended_at?: string | null;
  timezone?: string;
  booking_open: boolean;
  slots: {
    id: number;
    starts_at: string;
    ends_at: string;
    seat_count: number;
    seats_left: number;
    paid_count: number;
  }[];
  bookings: {
    id: number;
    status: string;
    user_name?: string;
    user_email?: string | null;
    starts_at?: string;
    ends_at?: string;
    astrologer_name?: string | null;
    meeting_link?: string | null;
    whatsapp_sent_at?: string | null;
    email_sent_at?: string | null;
  }[];
};

export const listMarathons = async () => {
  const res = await callAPI({ endpoint: "api/admin/marathons", method: "get" });
  return (res.data?.data ?? []) as MarathonRow[];
};

export const getMarathon = async (id: number) => {
  const res = await callAPI({ endpoint: `api/admin/marathons/${id}`, method: "get" });
  return res.data as MarathonRow;
};

export const createMarathon = async (data: object) => {
  const res = await callAPI({ endpoint: "api/admin/marathons", method: "post", data });
  return res.data;
};

export const updateMarathon = async (id: number, data: object) => {
  const res = await callAPI({ endpoint: `api/admin/marathons/${id}`, method: "put", data });
  return res.data;
};

export const deleteMarathon = async (id: number) => {
  const res = await callAPI({ endpoint: `api/admin/marathons/${id}`, method: "delete" });
  return res.data;
};

export const addMarathonSlot = async (id: number, data: object) => {
  const res = await callAPI({ endpoint: `api/admin/marathons/${id}/slots`, method: "post", data });
  return res.data;
};

export const publishMarathon = async (id: number) => {
  const res = await callAPI({ endpoint: `api/admin/marathons/${id}/publish`, method: "post" });
  return res.data;
};

export const endMarathon = async (id: number) => {
  const res = await callAPI({ endpoint: `api/admin/marathons/${id}/end`, method: "post" });
  return res.data;
};

export const resumeMarathon = async (id: number) => {
  const res = await callAPI({ endpoint: `api/admin/marathons/${id}/resume`, method: "post" });
  return res.data as MarathonRow;
};

export const updateMarathonSlot = async (
  slotId: number,
  data: { seat_count: number; starts_at?: string; ends_at?: string }
) => {
  const res = await callAPI({
    endpoint: `api/admin/marathons/slots/${slotId}`,
    method: "put",
    data,
  });
  return res.data;
};

export const deleteMarathonSlot = async (slotId: number) => {
  const res = await callAPI({
    endpoint: `api/admin/marathons/slots/${slotId}`,
    method: "delete",
  });
  return res.data;
};

export const retryMarathonLink = async (bookingId: number) => {
  const res = await callAPI({
    endpoint: `api/admin/marathons/bookings/${bookingId}/retry-link`,
    method: "post",
  });
  return res.data;
};

export const resendMarathonWhatsapp = async (bookingId: number) => {
  const res = await callAPI({
    endpoint: `api/admin/marathons/bookings/${bookingId}/resend-whatsapp`,
    method: "post",
  });
  return res.data;
};

export const resendMarathonEmail = async (bookingId: number) => {
  const res = await callAPI({
    endpoint: `api/admin/marathons/bookings/${bookingId}/resend-email`,
    method: "post",
  });
  return res.data;
};

export const assignMarathonSeat = async (bookingId: number, astrologerUserId: number) => {
  const res = await callAPI({
    endpoint: `api/admin/marathons/bookings/${bookingId}/assign`,
    method: "post",
    data: { astrologer_user_id: astrologerUserId },
  });
  return res.data;
};
