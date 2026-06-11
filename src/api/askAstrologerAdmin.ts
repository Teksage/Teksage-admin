import { callAPI } from "./crudFactory";

export type AskAstrologerItem = {
  id: number;
  status: string;
  customer_name: string | null;
  date_of_birth: string | null;
  time_of_birth: string | null;
  place_of_birth: string | null;
  rashi: string | null;
  nakshatra: string | null;
  preferred_languages: string[] | null;
  user_question: string;
  ai_response: string;
  answer_text: string | null;
  answer_voice_url: string | null;
  answered_at: string | null;
  base_price: number | null;
  currency: string | null;
  paid_at: string | null;
  astrologer_id: number | null;
  assigned_at: string | null;
  created_at: string | null;
  customer_whatsapp_opted_in?: boolean;
};

export async function fetchAskRequests(page = 1, status?: string) {
  const params: Record<string, unknown> = { page, page_size: 20 };
  if (status) params.status = status;
  const res = await callAPI({
    endpoint: "api/admin/ask-astrologer",
    method: "get",
    params,
  });
  return res.data as { total: number; page: number; page_size: number; requests: AskAstrologerItem[] };
}

export async function fetchAskRequestDetail(id: number) {
  const res = await callAPI({
    endpoint: `api/admin/ask-astrologer/${id}`,
    method: "get",
  });
  return res.data as AskAstrologerItem;
}

export async function assignAstrologer(id: number, astrologer_id: number) {
  const res = await callAPI({
    endpoint: `api/admin/ask-astrologer/${id}/assign`,
    method: "put",
    data: { astrologer_id },
  });
  return res.data as { status: string; request_id: number; astrologer_id: number };
}

export async function sendWhatsAppStatus(
  id: number,
  payload: { message_mode: string; template_id?: number; custom_text?: string }
) {
  const res = await callAPI({
    endpoint: `api/admin/ask-astrologer/${id}/whatsapp-status`,
    method: "post",
    data: payload,
  });
  return res.data;
}
