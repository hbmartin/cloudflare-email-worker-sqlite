# Cloudflare email worker to SQLite D1

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/hbmartin/email-worker/blob/main/LICENSE)
[![Checked with Biome](https://img.shields.io/badge/Checked_with-Biome-60a5fa?style=flat&logo=biome)](https://biomejs.dev)

Send emails to Cloudflare and forward them to different channels using an email worker.



## Setup

#### Prerequisites

- Cloudflare [account](https://dash.cloudflare.com/sign-up) (free)
- Wrangler installed [globally](https://developers.cloudflare.com/workers/wrangler/install-and-update/#install-wrangler-globally)

#### Install dependencies

```bash
yarn install
```

#### Deploy the worker

```bash
wrangler publish
```

#### Set up a route

- Go to your [zone's Email Workers settings](https://dash.cloudflare.com/?to=/:account).
- Click the zone (e.g. `example.com`), then `Email`, `Email Routing`.
- On the `Email Workers` tab, register an email route.

[![Register an email route](./assets/email-routing.png)](./assets/email-routing.png)

#### Verify

- Send an email to the email address you registered.
- Check the channel you registered the webhook to.

## Tips

- Change the `name` field in `wrangler.toml` to deploy a separate worker with a separate secret (e.g. with a separate webhook for a test channel). 


## License

This package is [MIT](./LICENSE) licensed.
