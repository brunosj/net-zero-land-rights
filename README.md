![TMG Logo](https://netzerolandrights.com/og-image.jpg)

## Description

This repo contains the website of [Net Zero & Land Rights](https://netzerolandrights.com).

## Technologies

This is a [Next.js](https://nextjs.org) app using the [App Router](https://nextjs.org/docs/app). Data is sourced from [Payload](https://payloadcms.com/) and the backend lives on the same server at /admin.

## Installation

1. Use the git CLI to close the repo

```
gh repo clone brunosj/net-zero-land-rights
```

2. Install dependencies

```bash
pnpm install
# or
yarn install
```

3. Navigate into the site's directory and start the development server

```bash
pnpm dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the frontend, and [http://localhost:3000/admin](http://localhost:3000/admin) for the backend.

## Structure

```
.
├── node_modules
├── public
└── src
    ├── app
    ├── payload
├── .eslintrc.json
├── .gitignore
├── next-i18next.config.js
├── next-config.js
├── pnpm-lock.yaml
├── package.json
├── postcss.config.js
├── README.md
├── tailwind.config.js
└── tsconfig.json


```

## Further development

This repository is maintained by [brunosj](https://github.com/brunosj).
