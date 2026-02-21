'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { createTemplate, updateTemplate } from '@/app/actions/templates'

interface Template {
    id: string
    name: string
    subject: string
    body: string
}

interface TemplateFormProps {
    template?: Template
}

export function TemplateForm({ template }: TemplateFormProps) {
    const isEdit = !!template
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        const formData = new FormData(e.currentTarget)
        const res = isEdit
            ? await updateTemplate(template.id, formData)
            : await createTemplate(formData)

        if (res.error) {
            setError(res.error)
            setLoading(false)
        } else {
            router.push('/admin/templates')
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl bg-card border rounded-lg p-6 shadow-sm">
            {error && <div className="text-red-500 text-sm">{error}</div>}

            <div className="space-y-2">
                <Label htmlFor="name">Template Name</Label>
                <Input
                    id="name"
                    name="name"
                    required
                    defaultValue={template?.name}
                    placeholder="E.g., Initial Follow-up"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                    id="subject"
                    name="subject"
                    required
                    defaultValue={template?.subject}
                    placeholder="E.g., Follow up on our meeting"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="body">Email Body</Label>
                <Textarea
                    id="body"
                    name="body"
                    required
                    rows={10}
                    defaultValue={template?.body}
                    placeholder="Hello {{name}}, I'm following up..."
                />
                <p className="text-xs text-muted-foreground mt-1">Note: Templates support basic text for now. (Feature enhancement: add variables like {'{{name}}'})</p>
            </div>

            <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => router.back()} disabled={loading}>
                    Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                    {loading ? 'Saving...' : 'Save Template'}
                </Button>
            </div>
        </form>
    )
}
