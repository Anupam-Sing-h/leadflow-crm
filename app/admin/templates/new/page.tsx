import { TemplateForm } from '@/components/TemplateForm'

export default function NewTemplatePage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Create Template</h1>
                <p className="text-muted-foreground mt-1">Add a new email template for sales reps to use.</p>
            </div>

            <TemplateForm />
        </div>
    )
}
