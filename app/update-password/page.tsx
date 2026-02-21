import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default async function UpdatePasswordPage({
    searchParams,
}: {
    searchParams: Promise<{ error?: string, message?: string }>
}) {
    const { error, message } = await searchParams

    const updatePassword = async (formData: FormData) => {
        'use server'

        const password = formData.get('password') as string
        const confirmPassword = formData.get('confirmPassword') as string

        if (!password || !confirmPassword) {
            return redirect('/update-password?error=Both+fields+are+required')
        }

        if (password !== confirmPassword) {
            return redirect('/update-password?error=Passwords+do+not+match')
        }

        const supabase = await createClient()

        const { error: updateError } = await supabase.auth.updateUser({
            password: password,
        })

        if (updateError) {
            return redirect(`/update-password?error=${encodeURIComponent(updateError.message)}`)
        }

        // Redirect to login (or dashboard) after successful update
        return redirect('/login?message=Password+updated+successfully.+Please+log+in+with+your+new+password.')
    }

    return (
        <div className="flex min-h-screen items-center justify-center p-4 bg-muted/30">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle className="text-2xl">Update Password</CardTitle>
                    <CardDescription>
                        Please enter your new password below.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={updatePassword} className="space-y-4">
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
                            <Label htmlFor="password">New Password</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                required
                                minLength={6}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <Input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                required
                                minLength={6}
                            />
                        </div>
                        <Button type="submit" className="w-full">
                            Update Password
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
