# omaproton-vpn (fork): notes for Claude

This is a **fork** of grichard99's OmaProton VPN widget for the Omarchy bar, maintained by its owner
as his own. Upstream closes every pull request as policy (`CONTRIBUTING.md`: one person writes every
line of a VPN widget), so this fork is where changes live.

**The fork is public**: keep this file and every commit free of personal or account details.

## Rules

- **Never open a pull request upstream.** An upstream *issue* describing a bug fixed here is welcome
  there and gets credited, but only with the owner's yes.
- **Push straight to `origin/main`** (`lancefaul/omaproton-vpn`). `upstream` is grichard99's repo:
  take updates with `git fetch upstream && git merge upstream/main`, keeping the fork's changes
  (sign-in from the panel, and its fixes), then test before pushing.
- **It is live from this checkout**: the installed plugin
  (`~/.config/omarchy/plugins/io.github.grichard99.omaproton-vpn`) is a symlink to this repo. Work in
  a worktree; QML changes need `omarchy-restart-shell` (say so when you run it). The plugin id stays
  upstream's, so settings in `shell.json` don't move.
- **Never change the VPN's state to test something** — connect, disconnect, the Kill Switch, split
  tunneling, NetShield, port forwarding — without the owner's yes. The Kill Switch can cut the
  network.
- **Sign-in rules** (from the fork's own fixes): pass `--totp` only when a code was typed (it broke
  security-key and no-2FA accounts when hardcoded), and an exit code of 0 is not "signed in" until an
  `info` probe confirms an account; until then the panel holds `_confirmingSignIn`. Passwords never go
  on a command line where other processes can read them.
- **No test suite.** Check with `omarchy-shell io.github.grichard99.omaproton-vpn debug` (state as
  JSON, no account details) and `protonvpn info`; read the panel's own status line. Upstream's
  `RELEASING.md` describes their branches, not this fork's.
- Plugin-wide lessons (reloading, settings, testing a shell plugin) are in the user-level
  `omarchy-plugin-dev` skill.

## Colour and contrast

- **The panel is one ink**: everything is the theme foreground, dimmed with `Qt.darker` or an
  opacity. `Qt.darker` gets *more* readable on a light theme (dark text, darker still) and less on a
  dark one (Tokyo Night's `dim` was 3.1:1); an opacity fails on light themes (Catppuccin Latte's info
  labels, fg at 0.6, were 2.8:1). So never add a new dimmed colour or opacity on text or an icon:
  route it through `Contrast.js` the way `Panel.qml`'s Contrast block does (composite with
  `Contrast.over` onto the surface under it, then `ensureContrastOn` to 4.5:1 for text, 3:1 for icons,
  map dots and state marks). Decorative fills (land, chart area, baselines) stay as they are.
- **The surfaces**: the panel is `Color.popups.background`; a row under the cursor adds the hover
  fill, the nudge and the profile editor add the normal control fill (`textSurfaces`). The map's dots
  sit on land, the foreground at 0.10 over the panel. The bar icon sits on `bar.background`.
- **Errors use `root.danger`, never `root.urgent`**: the theme's urgent is green on Hackerman,
  magenta on Lupine and grey on White; `danger` falls back to a real red and holds 4.5:1.
- **Check with** a throwaway script computing each colour on the light themes (catppuccin-latte,
  flexoki-light, lupine, rose-pine, white) and on hackerman and tokyo-night; drive the real
  `Contrast.js` through `node` (strip the `.pragma library` line) so the numbers are the code's. The
  shell's own controls (cursor ring, toggles, dropdowns) are the shell's and aren't fixed here.

## Review

Before merging or shipping: the user-level `pre-merge-review` skill — `/code-review` on the
diff in a fresh context, and `/security-review` on any change to sign-in or to commands run through `protonvpn`, findings as Important / Nit / Pre-existing with file and line, every
finding answered, at most three rounds.

**Always needs the owner's eyes:** sign-in and password handling, connect, disconnect and the Kill Switch, split tunneling, anything run through the `protonvpn` CLI.

**How to undo:** `git revert` on `main` and `omarchy-restart-shell`.

## Skills learn

A lesson lands here in the same commit as the fix: a sign-in or CLI behaviour, a Proton library
change that broke something. Never general advice, and never anything personal.
