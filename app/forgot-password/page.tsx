import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import Link from 'next/link'

export default async function ForgotPasswordPage({
    searchParams,
}: {
    searchParams: Promise<{ error?: string, message?: string }>
}) {
    const { error, message } = await searchParams

    const resetPassword = async (formData: FormData) => {
        'use server'

        const email = formData.get('email') as string

        if (!email) {
            return redirect('/forgot-password?error=Email+is+required')
        }

        const supabase = await createClient()

        const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback?next=/update-password`, // Next can be customized to change-password route in real app
        })

        if (resetError) {
            return redirect(`/forgot-password?error=${encodeURIComponent(resetError.message)}`)
        }

        return redirect('/forgot-password?message=Check+your+email+for+a+password+reset+link')
    }

    return (
        <div className="flex min-h-screen items-center justify-center p-4 bg-muted/30">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle className="text-2xl">Forgot Password</CardTitle>
                    <CardDescription>
                        Enter your email to receive a password reset link.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={resetPassword} className="space-y-4">
                        {error && (
                            <div className="p-3 text-sm text-destructive border border-destructive/20 bg-destructive/10 rounded-md">
                                {error}
                            </div>
                        )}
                        {message && (
                            <div className="p-3 text-sm text-green-700 border border-green-200 bg-green-50 rounded-md">
                                {message}
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="m@example.com"
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full">
                            Reset Password
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                    <div className="text-center text-sm text-muted-foreground w-full">
                        Remember your password?{' '}
                        <Link href="/login" className="text-primary hover:underline">
                            Log in
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}
