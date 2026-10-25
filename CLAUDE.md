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

## Skills learn

A lesson lands here in the same commit as the fix: a sign-in or CLI behaviour, a Proton library
change that broke something. Never general advice, and never anything personal.
