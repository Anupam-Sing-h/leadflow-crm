'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Mail } from 'lucide-react'
import { getTemplates } from '@/app/actions/templates'
import { sendEmail } from '@/app/actions/emails'
import { useRouter } from 'next/navigation'

interface SendEmailModalProps {
    leadId: string
    leadName: string
}

export function SendEmailModal({ leadId, leadName }: SendEmailModalProps) {
    const [open, setOpen] = useState(false)
    const [templates, setTemplates] = useState<any[]>([])
    const [subject, setSubject] = useState('')
    const [body, setBody] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    useEffect(() => {
        if (open) {
            getTemplates().then(setTemplates)
        }
    }, [open])

    const handleTemplateSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const tId = e.target.value
        if (!tId) return

        const template = templates.find(t => t.id === tId)
        if (template) {
            setSubject(template.subject || '')
            // Optional: Replace {{name}} with leadName
            const parsedBody = (template.body || '').replace(/\{\{name\}\}/gi, leadName)
            setBody(parsedBody)
        }
    }

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const res = await sendEmail(leadId, subject, body)
        setLoading(false)

        if (res.error) {
            alert(`Error sending email: ${res.error}`)
        } else {
            setOpen(false)
            setSubject('')
            setBody('')
            alert("Email sent successfully! (Simulated)")
            router.refresh()
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <Mail className="mr-2 h-4 w-4" />
                    Send Email
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Send Email to {leadName}</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSend} className="space-y-4 pt-4">
                    <div className="space-y-2">
                        <Label>Use Template (Optional)</Label>
                        <select
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            onChange={handleTemplateSelect}
                            defaultValue=""
                        >
                            <option value="" disabled>Select a template...</option>
                            {templates.map(t => (
                                <option key={t.id} value={t.id}>{t.subject}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Input
                            id="subject"
                            required
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="body">Body</Label>
                        <Textarea
                            id="body"
                            required
                            rows={6}
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                        />
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <Button type="button" variant="ghost" onClick={() => setOpen(false)} disabled={loading}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Sending...' : 'Send'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
