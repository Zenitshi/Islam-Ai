declare module 'react-markdown' {
  import { ReactNode } from 'react'

  interface ReactMarkdownProps {
    children: string
    remarkPlugins?: any[]
    rehypePlugins?: any[]
    components?: Record<string, React.ComponentType<any>>
  }

  export interface Components {
    [key: string]: React.ComponentType<any>
  }

  const ReactMarkdown: React.FC<ReactMarkdownProps>
  export default ReactMarkdown
}

declare module 'remark-gfm' {
  const remarkGfm: any
  export default remarkGfm
}

declare module 'rehype-raw' {
  const rehypeRaw: any
  export default rehypeRaw
} 