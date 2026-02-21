import { getTemplate } from '@/app/actions/templates'
import { TemplateForm } from '@/components/TemplateForm'
import { notFound } from 'next/navigation'

export default async function EditTemplatePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const template = await getTemplate(id)

    if (!template) return notFound()

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Edit Template</h1>
                <p className="text-muted-foreground mt-1">Update this email template.</p>
            </div>

            <TemplateForm template={template} />
        </div>
    )
}
