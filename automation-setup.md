# Cypress Pup Co. — Calendly, Google Sheets, and Make Setup

## What I can and cannot do directly

I can build the website integration code, write the Google Apps Script endpoint, design the Google Sheet columns, map the automation steps, and generate Make/Zapier logic.

I cannot directly log into your Calendly, Google, or Make accounts from this environment unless you provide authenticated access through a supported tool/session. You should not paste account passwords. For security, you will create the accounts/deployments and paste only public deployment URLs into the website code.

## Recommended Flow

Website inquiry form → Google Apps Script Web App → Google Sheet row → email notification to Michael → auto-reply to client → Calendly booking link.

Calendly handles appointment selection. Google Sheets stores every lead. Make can be added later for SMS, CRM, review requests, and reminders.

---

## Step 1 — Calendly

Create a Calendly event:

- Event name: Free Meet & Greet — Cypress Pup Co.
- Duration: 15 or 20 minutes
- Location: Phone call, Google Meet, or custom note such as “We’ll confirm details by text.”
- Availability: your preferred dog-care admin hours
- Invitee questions:
  - Pet name/breed/size
  - Service needed
  - City/neighborhood
  - Ideal start date
  - Anything important about behavior, leash walking, feeding, medication, or access

Suggested URL:

```text
https://calendly.com/mjmorrisonusa/free-meet-greet
```

If Calendly gives you a different URL, update these places:

1. `index.html` → `CONFIG.calendlyUrl`
2. `index.html` → the “Open Calendly” button href
3. `google-apps-script.js` → `CALENDLY_URL`

---

## Step 2 — Google Sheets

1. Create a Google Sheet named:

```text
Cypress Pup Co Leads
```

2. Open the sheet.
3. Go to Extensions → Apps Script.
4. Paste the contents of `google-apps-script.js` into `Code.gs`.
5. Save.
6. Click Deploy → New deployment.
7. Select type: Web app.
8. Execute as: Me.
9. Who has access: Anyone.
10. Deploy.
11. Copy the Web App URL.

Then paste the Web App URL into `index.html`:

```js
googleScriptUrl: 'PASTE_YOUR_SCRIPT_URL_HERE',
```

Once connected, form submissions will create rows with:

- Received At
- Submitted At
- Source
- Name
- Phone
- Email
- City / Neighborhood
- Service
- Pet Details
- Status
- Notes

---

## Step 3 — Make.com Optional Upgrade

You do not need Make for the first working version. Google Apps Script can already save leads and send emails.

Use Make when you want more operational automation, such as:

- Send yourself an SMS when a lead submits
- Add the lead to Airtable/HubSpot
- Create a Google Calendar task
- Send a Gmail follow-up if they do not book within 24 hours
- Send a review request after completed services
- Notify you in Slack/Discord

### Make Scenario Option A — Watch Google Sheets

Trigger:

- Google Sheets → Watch New Rows

Actions:

1. Gmail → Send owner notification
2. Twilio or ClickSend → Send SMS to Michael
3. Gmail → Send client auto-reply
4. Google Calendar / Tasks → Create follow-up reminder

### Make Scenario Option B — Custom Webhook

Trigger:

- Webhooks → Custom webhook

Then update `index.html` to post directly to the Make webhook URL instead of Google Apps Script.

This is powerful, but I recommend Google Sheets first because it is simpler, cheaper, and easier to debug.

---

## Best Launch Recommendation

Use this order:

1. Calendly event link
2. Google Sheet + Apps Script endpoint
3. Website form connected to Apps Script
4. Later: Make scenario watching the lead sheet

This gives you a professional operating system without overbuilding too early.
