import { getRepDashboardMetrics } from '@/app/actions/dashboard'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default async function RepDashboard() {
    const metrics = await getRepDashboardMetrics()

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Sales Dashboard</h1>
                <p className="text-muted-foreground">
                    Overview of your assigned leads and upcoming tasks.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            My Active Leads
                        </CardTitle>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-muted-foreground"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /></svg>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{metrics.assignedLeadsCount}</div>
                    </CardContent>
                </Card>
                <Card className="shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Deals Won
                        </CardTitle>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-muted-foreground"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600 dark:text-green-500">{metrics.wonDeals}</div>
                    </CardContent>
                </Card>
                <Card className="shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Hit Rate
                        </CardTitle>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-muted-foreground"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{metrics.conversionRate}%</div>
                    </CardContent>
                </Card>
            </div>

            <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4 tracking-tight">Auto-Reminders</h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {/* Overdue */}
                    <Card className="shadow-sm border-red-200 dark:border-red-900/50">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-red-600 dark:text-red-500 flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                                Overdue ({metrics.reminders.overdue.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {metrics.reminders.overdue.length === 0 ? (
                                <p className="text-sm text-muted-foreground">No overdue follow-ups.</p>
                            ) : (
                                metrics.reminders.overdue.map((rem: any) => (
                                    <div key={rem.id} className="text-sm border-l-2 border-red-500 pl-3 py-1">
                                        <p className="font-medium">{rem.leads?.name} <span className="text-muted-foreground font-normal">({rem.leads?.company})</span></p>
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>

                    {/* Today */}
                    <Card className="shadow-sm border-blue-200 dark:border-blue-900/50">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-blue-600 dark:text-blue-500 flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                                Due Today ({metrics.reminders.today.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {metrics.reminders.today.length === 0 ? (
                                <p className="text-sm text-muted-foreground">Clear for today.</p>
                            ) : (
                                metrics.reminders.today.map((rem: any) => (
                                    <div key={rem.id} className="text-sm border-l-2 border-blue-500 pl-3 py-1">
                                        <p className="font-medium">{rem.leads?.name} <span className="text-muted-foreground font-normal">({rem.leads?.company})</span></p>
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>

                    {/* Upcoming */}
                    <Card className="shadow-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-muted-foreground flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /></svg>
                                Upcoming ({metrics.reminders.upcoming.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {metrics.reminders.upcoming.length === 0 ? (
                                <p className="text-sm text-muted-foreground">No upcoming follow-ups.</p>
                            ) : (
                                metrics.reminders.upcoming.slice(0, 5).map((rem: any) => (
                                    <div key={rem.id} className="text-sm border-l-2 border-muted pl-3 py-1">
                                        <p className="font-medium">{rem.leads?.name}</p>
                                        <p className="text-xs text-muted-foreground mt-0.5">{new Date(rem.due_date).toLocaleDateString()}</p>
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
