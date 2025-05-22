// storage-adapter-import-placeholder
import { mongooseAdapter } from '@payloadcms/db-mongodb'

import sharp from 'sharp'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import { KeyMessages } from './collections/KeyMessages'
import { Categories } from './collections/Categories'
import { ChaptersPage } from './collections/ChaptersPage'
import { Homepage } from './collections/Homepage'
import { Chapters } from './collections/Chapters'
import { Resources } from './collections/Resources'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Users } from './collections/Users'
import { ContactSubmissions } from './collections/ContactSubmissions'
import { Footer } from './Footer/config'
import { Header } from './Header/config'
import { Publication } from './Publication/config'
import { plugins } from './plugins'
import { defaultLexical } from '@/fields/defaultLexical'
import { getServerSideURL } from './utilities/getURL'
import { About } from './collections/About'
import { Contact } from './collections/Contact'
import { Newsletter } from './collections/Newsletter'
import { MediaItems } from './collections/MediaItems'
import { MediaCenter } from './collections/MediaCenter'
import nodemailer from 'nodemailer'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    components: {
      graphics: {
        Logo: { path: 'src/components/Logo/AdminLogo.tsx' },
        Icon: { path: 'src/components/Logo/AdminLogo.tsx' },
      },
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: Users.slug,
    livePreview: {
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 375,
          height: 667,
        },
        {
          label: 'Tablet',
          name: 'tablet',
          width: 768,
          height: 1024,
        },
        {
          label: 'Desktop',
          name: 'desktop',
          width: 1440,
          height: 900,
        },
      ],
    },
  },
  // This config helps us configure global or default features that the other editors can inherit
  editor: defaultLexical,
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  collections: [
    Homepage,
    About,
    ChaptersPage,
    Resources,
    Contact,
    Newsletter,
    Pages,
    Chapters,
    KeyMessages,
    MediaItems,
    MediaCenter,
    ContactSubmissions,
    Media,
    Users,
  ],
  cors: [getServerSideURL()].filter(Boolean),
  globals: [Header, Footer, Publication],
  plugins: [...plugins],
  secret: process.env.PAYLOAD_SECRET,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  email: nodemailerAdapter({
    defaultFromAddress: 'info@tmg-thinktank.com',
    defaultFromName: 'TMG Think Tank',
    transport: nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: 587,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    }),
  }),
})
