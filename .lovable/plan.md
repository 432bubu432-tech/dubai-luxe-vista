Google Drive is not available as an MCP connector for Lovable chat context, so it cannot be permanently "connected" to the agent workflow. However, your workspace has Google Drive App connectors available, which gives us two practical paths.

### Option A: One-off agent access while building (recommended for now)
Use the Google Drive App connector via the Lovable gateway to read files during our chat sessions without linking it to the generated app. This lets me inspect spreadsheets, PDFs, brand assets, or property data from your Drive and use them as context while building.

- No code changes to the app.
- No secrets injected into the project.
- You pick which files or folders I access on each turn.

### Option B: Runtime App connector for the generated app
Link a Google Drive App connector to the project so the published app can read or write files at runtime (e.g., pulling property brochures, syncing investor documents, or uploading reports). This requires:

1. Selecting one of your existing Google Drive workspace connections.
2. Linking it to the project with `standard_connectors--connect`.
3. Writing server code that calls the Google Drive API through the Lovable connector gateway.
4. Adding the appropriate env vars and grants.

### Next step needed
Tell me which option you want, and if you have specific files in mind, share the Google Drive URL(s) or folder names. If you choose Option B, I can also ask what the app should do with Drive files (display, download, upload, sync, etc.) so the implementation matches your goal.

### Technical details
- App connector ID: `google_drive`
- Gateway base URL: `https://connector-gateway.lovable.dev/google_drive/drive/v3`
- Common endpoints: list files, get metadata, download file content, search files, list folder contents.
- No MCP connector exists for Google Drive, so chat context access must be handled through one-off gateway calls.