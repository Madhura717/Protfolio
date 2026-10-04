# Editable Portfolio Builder

## Product direction

An independent replacement for the Lovable portfolio page: a dark, modern, single-page portfolio preview paired with a practical editor. The editor is the primary differentiator, so every visible portfolio section is editable without code or a Lovable account.

## Design

- **Design movement:** dark editorial tech portfolio with subtle glass panels and electric-blue highlights.
- **Core principles:** readable hierarchy, generous spacing, immediate feedback, and calm utility over decoration.
- **Color philosophy:** near-black surfaces keep the content focused; cool blue gradients communicate technical confidence; warm coral accents make action states feel human and approachable.
- **Layout paradigm:** a sticky command bar and split workspace: controls on the left, the portfolio canvas on the right. On small screens, the editor and preview stack vertically.
- **Signature elements:** a glowing initials mark, thin ruled section labels, and compact pill tags for skills and project technology.
- **Interaction philosophy:** typing should update the preview immediately; save state should be visible but quiet; export/import makes the content portable.
- **Animation:** small fades and lift-on-hover only; no motion should block editing or reading.
- **Typography system:** system sans for clarity, with bold condensed-feeling headings through weight and tracking rather than an external dependency.
- **Brand essence:** a no-code personal site editor for people who want a polished portfolio without Lovable credits; practical, polished, portable.
- **Brand voice:** direct and encouraging. Example lines: “Make the work easy to find.” and “Your portfolio, in your words.”
- **Wordmark & logo:** a compact “PK” monogram in a rounded square, paired with the wordmark “Portfolio Kit”.
- **Signature brand color:** electric blue `#6ea8ff`.

## Implementation

- `index.html` contains the app shell and accessible regions.
- `styles.css` owns the responsive split-workspace design and portfolio presentation.
- `app.js` owns the default content, repeatable editor fields, live preview renderer, localStorage persistence, photo upload, reset, and JSON export/import.
- `server.mjs` serves the static app on the Webdev runtime port.
- `public/manus-routes.json` declares the single-page route.

The first version intentionally uses browser-local persistence rather than a database: it works immediately, needs no account, and matches the user's need to continue after Lovable credits are exhausted.
