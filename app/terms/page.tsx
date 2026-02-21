import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsOfService() {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-sm border">
                <div className="mb-8">
                    <Link href="/" className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Home
                    </Link>
                </div>

                <h1 className="text-3xl font-bold mb-6 text-gray-900">Terms of Service</h1>

                <div className="prose max-w-none text-gray-600 space-y-6">
                    <p>
                        Welcome to LeadFlow CRM. These Terms of Service govern your use of our website and services.
                    </p>

                    <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">1. Project Information</h2>
                    <p>
                        Please note that LeadFlow CRM is developed as an assignment by <strong>Anupam Singh</strong>.
                        It is provided &quot;as is&quot; for demonstration and educational purposes.
                    </p>

                    <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">2. Use of Service</h2>
                    <p>
                        You agree to use the service only for lawful purposes and in accordance with these Terms. You are responsible for ensuring your use of the service complies with applicable laws.
                    </p>

                    <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">3. Contact Information</h2>
                    <p>
                        If you have any questions or concerns about these Terms or the project, please reach out via the following contact information:
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
