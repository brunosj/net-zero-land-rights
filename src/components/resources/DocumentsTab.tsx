'use client'

import React from 'react'
import Link from 'next/link'
import { FileText, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface DocumentsTabProps {
  documents: any[]
}

const DocumentsTab: React.FC<DocumentsTabProps> = ({ documents }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {documents.map((resource, idx) => (
        <div
          key={idx}
          className="bg-white rounded-md overflow-hidden shadow-xs border border-gray-100"
        >
          <div className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <FileText size={18} />
              <h3 className="text-lg font-medium">{resource.title}</h3>
            </div>
            {resource.description && (
              <p className="text-sm text-gray-600 mb-4">{resource.description}</p>
            )}
            <Link
              href={typeof resource.file === 'string' ? resource.file : resource.file.url || '#'}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="sm" asChild className="flex items-center space-x-1">
                <Download size={16} />
                <span>Download</span>
              </Button>
            </Link>
          </div>
        </div>
      ))}
    </div>
  )
}

export default DocumentsTab
