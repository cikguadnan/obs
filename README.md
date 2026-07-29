# OBS Afterglow

A mobile-friendly post-OBS reflection website with:

- Student reflection form
- Browser autosave
- Google Sheets submission through Google Apps Script
- Teacher dashboard
- Class filters
- Moderation controls
- Word clouds
- Random anonymous answer sharing
- Full-screen reflection wall

## Files

- `index.html` — student form
- `dashboard.html` — teacher dashboard and presentation mode
- `styles.css` — visual design
- `app.js` — student form logic
- `dashboard.js` — dashboard, moderation and presentation logic
- `config.js` — paste your Apps Script URL here
- `google-apps-script/Code.gs` — Google Sheets backend

## Quick preview

Open `index.html` and `dashboard.html` locally. If `APPS_SCRIPT_URL` is blank, the project uses local demo mode.

## Connect to Google Sheets

1. Create a new Google Sheet.
2. Open **Extensions → Apps Script**.
3. Replace the default code with `google-apps-script/Code.gs`.
4. Click **Deploy → New deployment**.
5. Choose **Web app**.
6. Execute as: **Me**
7. Who has access: choose the option permitted by your school account.
8. Deploy and copy the Web App URL.
9. Open `config.js`.
10. Paste the URL:

```js
window.OBS_CONFIG = {
  APPS_SCRIPT_URL: "YOUR_WEB_APP_URL",
  TEACHER_PIN: "2468"
};
```

11. Upload the website files to GitHub Pages or your preferred host.

## Suggested classroom workflow

1. Students open `index.html`.
2. Responses are saved into the `Responses` sheet.
3. Teacher opens `dashboard.html`.
4. Review and hide unsuitable responses.
5. Press **Show Class**.
6. Choose a question.
7. Display a random answer, reflection wall or word cloud.

## Privacy

- Student names are visible only in the teacher dashboard.
- Presentation mode shows answers anonymously.
- Review responses before classroom display.
- Use only a school-approved hosting and data workflow.
- Do not collect highly sensitive personal information.

## GitHub Pages

Upload all files while preserving the folder structure. In repository settings, enable GitHub Pages from the main branch root.

Student page:
`https://YOUR-USERNAME.github.io/REPOSITORY/`

Teacher dashboard:
`https://YOUR-USERNAME.github.io/REPOSITORY/dashboard.html`
