import React from 'react'
import { LinkedinShareButton, BlueskyShareButton } from 'react-share'
import { cn } from '../../lib/utils'
import { getTextColor } from '@/utilities/getTextColor'

type Props = {
  url: string
  title: string
  color: string
  className?: string
}

export const Share: React.FC<Props> = ({ url, title, color, className }) => {
  return (
    <div className={cn('flex gap-4', className)}>
      <LinkedinShareButton url={url} title={title} summary={title}>
        <span className={`flex items-center gap-2 text-${color} hover:opacity-60 duration-300`}>
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
          </svg>
        </span>
      </LinkedinShareButton>

      {/* <TwitterShareButton url={url} title={title}>
        <span
          className={`flex items-center gap-2 text-${color}  hover:opacity-60 duration-300`}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </span>
      </TwitterShareButton> */}

      <BlueskyShareButton url={url} title={title}>
        <span className={`flex items-center gap-2 text-${color}  hover:opacity-60 duration-300`}>
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565C.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479c.815 2.736 3.713 3.66 6.383 3.364q.204-.03.415-.056q-.207.033-.415.056c-3.912.58-7.387 2.005-2.83 7.078c5.013 5.19 6.87-1.113 7.823-4.308c.953 3.195 2.05 9.271 7.733 4.308c4.267-4.308 1.172-6.498-2.74-7.078a9 9 0 0 1-.415-.056q.21.026.415.056c2.67.297 5.568-.628 6.383-3.364c.246-.828.624-5.79.624-6.478c0-.69-.139-1.861-.902-2.206c-.659-.298-1.664-.62-4.3 1.24C16.046 4.748 13.087 8.687 12 10.8"
            />
          </svg>
        </span>
      </BlueskyShareButton>

      {/* <InstapaperShareButton url={url} title={title}>
        <span className="flex items-center gap-2 text-${color}  hover:opacity-60 duration-300">
          <svg className="w-6 h-6" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M16 3a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8a5 5 0 0 1 5-5zm-4 5a4 4 0 0 0-3.995 3.8L8 12a4 4 0 1 0 4-4m4.5-1.5a1 1 0 0 0-.993.883l-.007.127a1 1 0 0 0 1.993.117L17.5 7.5a1 1 0 0 0-1-1"
            />
          </svg>
        </span>
      </InstapaperShareButton> */}
    </div>
  )
}
