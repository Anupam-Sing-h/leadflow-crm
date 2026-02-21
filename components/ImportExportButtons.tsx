'use client'

import React, { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Upload, Download } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { bulkInsertLeads } from '@/app/actions/import'

interface Lead {
    id: string
    [key: string]: any
}

interface ImportExportButtonsProps {
    leads: Lead[]
    onExportComplete?: () => void
}

export function ImportExportButtons({ leads }: ImportExportButtonsProps) {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [isImporting, setIsImporting] = useState(false)
    const router = useRouter()

    const handleExport = () => {
        if (!leads || leads.length === 0) {
            alert("No leads to export!")
            return
        }

        // Basic fields to export
        const headers = ['Name', 'Email', 'Phone', 'Company', 'Location', 'Source', 'Status', 'Expected Value', 'Notes']

        const sanitizeField = (val: any) => {
            if (val === null || val === undefined) return ''
            const strVal = String(val).replace(/"/g, '""')
            // Wrap in quotes if there is a comma, newline, or quote
            if (strVal.search(/([",\n])/g) >= 0) {
                return `"${strVal}"`
            }
            return strVal
        }

        const csvContent = [
            headers.join(','),
            ...leads.map(lead => {
                return [
                    lead.name,
                    lead.email,
                    lead.phone,
                    lead.company,
                    lead.location,
                    lead.source,
                    lead.status,
                    lead.expected_value,
                    lead.notes
                ].map(sanitizeField).join(',')
            })
        ].join('\n')

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const link = document.createElement('a')

        const url = URL.createObjectURL(blob)
        link.setAttribute('href', url)
        link.setAttribute('download', 'leads_export.csv')
        link.style.visibility = 'hidden'

        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    const parseCSV = (text: string) => {
        const result: Record<string, string>[] = []
        const lines = text.split(/\r?\n/)
        if (lines.length < 2) return result

        const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/ /g, '_'))

        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim()
            if (!line) continue

            // A somewhat naïve split that respects quotes to some degree
            const values: string[] = []
            let inQuotes = false
            let currentValue = ''

            for (let j = 0; j < line.length; j++) {
                const char = line[j]
                if (char === '"') {
                    inQuotes = !inQuotes
                } else if (char === ',' && !inQuotes) {
                    values.push(currentValue.replace(/(^"|"$)/g, '').replace(/""/g, '"').trim())
                    currentValue = ''
                } else {
                    currentValue += char
                }
            }
            // push last value
            values.push(currentValue.replace(/(^"|"$)/g, '').replace(/""/g, '"').trim())

            const obj: Record<string, string> = {}
            headers.forEach((header, index) => {
                obj[header] = values[index] || ''
            })
            result.push(obj)
        }
        return result
    }

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        setIsImporting(true)
        try {
            const text = await file.text()
            const parsedData = parseCSV(text)

            if (parsedData.length === 0) {
                alert("The CSV file appears to be empty or misformatted.")
                setIsImporting(false)
                if (fileInputRef.current) fileInputRef.current.value = ''
                return
            }

            const res = await bulkInsertLeads(parsedData)

            if (res.error) {
                alert(`Error: ${res.error}`)
            } else {
                alert(`Successfully imported ${res.count} leads.`)
                router.refresh()
            }
        } catch (error) {
            console.error("Failed to read CSV", error)
            alert("Failed to read the file. Ensure it is a valid CSV.")
        } finally {
            setIsImporting(false)
            if (fileInputRef.current) fileInputRef.current.value = ''
        }
    }

    return (
        <div className="flex gap-2">
            <input
                type="file"
                accept=".csv"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
            />

            <Button variant="outline" onClick={() => fileInputRef.current?.click()} disabled={isImporting}>
                <Upload className="mr-2 h-4 w-4" />
                {isImporting ? 'Importing...' : 'Import'}
            </Button>

            <Button variant="outline" onClick={handleExport}>
                <Download className="mr-2 h-4 w-4" />
                Export
            </Button>
        </div>
    )
}
