import React from 'react'
import { motion } from 'motion/react'
import RichText from '@/components/RichText'
import { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

interface FormHeaderProps {
  title: string
  content?: SerializedEditorState
  mainColor: string
}

const FormHeader: React.FC<FormHeaderProps> = ({ title, content, mainColor }) => {
  return (
    <motion.div
      className="container mx-auto mb-12"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <h2 className={`text-3xl md:text-5xl font-bold mb-4 text-${mainColor} relative`}>{title}</h2>
      {content && <RichText data={content} />}
    </motion.div>
  )
}

export default FormHeader
