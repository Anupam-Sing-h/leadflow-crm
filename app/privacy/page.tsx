import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-sm border">
                <div className="mb-8">
                    <Link href="/" className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Home
                    </Link>
                </div>

                <h1 className="text-3xl font-bold mb-6 text-gray-900">Privacy Policy</h1>

                <div className="prose max-w-none text-gray-600 space-y-6">
                    <p>
                        At LeadFlow CRM, we are committed to protecting your privacy and ensuring the security of your personal information.
                    </p>

                    <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">1. Project Disclaimer</h2>
                    <p>
                        This application is developed as an assignment by <strong>Anupam Singh</strong>. Any data collected during the use of this demonstration application is strictly for functional testing and evaluation purposes.
                    </p>

                    <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">2. Information Collection</h2>
                    <p>
                        We may collect basic information required for authentication and core CRM functionalities, such as email addresses and user-provided lead data, solely for demonstrating the application&apos;s capabilities.
                    </p>

                    <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">3. Data Usage &amp; Protection</h2>
                    <p>
                        Your information will not be sold, distributed, or used for commercial purposes. Data is stored securely in accordance with standard best practices for educational projects.
                    </p>

                    <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">4. Contact Information</h2>
                    <p>
                        For any inquiries regarding this Privacy Policy or data handling within this project, please contact:
                    </p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>Developer: Anupam Singh</li>
                        <li>Email: <a href="mailto:jgkvb@gmail.com" className="text-blue-600 hover:underline">jgkvb@gmail.com</a></li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
