import { NextResponse } from "next/server";
import { Client } from "@hubspot/api-client";

const hubspot = new Client({ accessToken: process.env.HUBSPOT_ACCESS_TOKEN });

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { waId, text, senderName } = body;

    console.log("Processing:", senderName);

    // 1. Search for Contact
    const searchResponse = await hubspot.crm.contacts.searchApi.doSearch({
      filterGroups: [
        {
          filters: [{ propertyName: "phone", operator: "EQ", value: waId }],
        },
      ],
      properties: ["id"],
      limit: 1,
    });

    let contactId;

    if (searchResponse.results.length > 0) {
      contactId = searchResponse.results[0].id;
    } else {
      // 2. Create Contact
      const createResponse = await hubspot.crm.contacts.basicApi.create({
        properties: { firstname: senderName, phone: waId },
      });
      contactId = createResponse.id;
    }

    // 3. Create Note (If this fails due to permissions, check terminal)
    await hubspot.crm.objects.notes.basicApi.create({
      properties: {
        hs_timestamp: Date.now().toString(),
        hs_note_body: `<b>📩 Incoming WhatsApp:</b><br/>${text}`,
      },
      associations: [
        {
          to: { id: contactId },
          types: [{ associationCategory: "HUBSPOT_DEFINED", associationTypeId: 202 }],
        },
      ],
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("HubSpot API Error:", error);
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
