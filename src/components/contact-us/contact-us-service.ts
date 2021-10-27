import { ContactForm, ContactUsServiceInterface } from "./types";
import { Client } from "node-zendesk";
import { zendeskAPIClient } from "../../utils/zendesk";
import { getZendeskGroupIdPublic } from "../../config";

export function contactUsService(
  zendeskClient: Client = zendeskAPIClient
): ContactUsServiceInterface {
  const contactUsSubmitForm = async function (
    contactForm: ContactForm
  ): Promise<void> {
    const payload: any = {
      ticket: {
        subject: contactForm.subject,
        comment: { body: contactForm.comment },
        group_id: getZendeskGroupIdPublic(),
        tags: ["govuk_sign_in"],
      },
    };

    if (contactForm.email && contactForm.name) {
      payload.ticket.requester = {
        email: contactForm.email,
        name: contactForm.name,
      };
    }

    await zendeskClient.tickets.create(payload);
  };

  return {
    contactUsSubmitForm,
  };
}
