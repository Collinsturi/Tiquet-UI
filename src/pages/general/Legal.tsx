import {Navbar} from "../../components/shared/navBar/Navbar.tsx";
import {Footer} from "../../components/shared/footer/Footer.tsx";

export const Legal = () => {
    return (
        <div className="min-h-screen flex flex-col bg-base-200 font-sans">
         <Navbar />

            <main className="flex-grow container mx-auto px-4 py-8 md:px-8 lg:px-12">
                <h1 className="text-4xl md:text-5xl font-extrabold text-center text-primary mb-10 mt-6 animate-fade-in-down">
                    Legal Information
                </h1>

                <p className="text-lg text-center text-base-content max-w-3xl mx-auto mb-12">
                    Welcome to our legal hub. Here you'll find important information regarding our Terms of Service, Privacy Policy, and Cookie Policy. Please review these documents carefully as they govern your use of our ticketing platform.
                </p>

                {/* Legal Sections Container */}
                <div className="space-y-6 max-w-4xl mx-auto">

                    {/* Terms of Service Section */}
                    <div className="collapse collapse-plus bg-base-100 rounded-lg shadow-xl border border-base-300">
                        <input type="checkbox" className="peer" />
                        <div className="collapse-title text-xl font-bold text-secondary peer-checked:bg-primary peer-checked:text-primary-content transition-all duration-300 rounded-t-lg">
                            1. Terms of Service
                        </div>
                        <div className="collapse-content bg-base-100 p-6 text-base-content text-justify">
                            <h3 className="text-2xl font-semibold mb-4 text-primary">1.1 Introduction</h3>
                            <p className="mb-4">
                                Welcome to Tikti! These Terms of Service ("Terms") govern your use of our website, services, and applications (collectively, the "Platform"). By accessing or using the Platform, you agree to be bound by these Terms and our Privacy Policy. If you do not agree to these Terms, please do not use the Platform.
                            </p>

                            <h3 className="text-2xl font-semibold mb-4 text-primary">1.2 Account Registration</h3>
                            <p className="mb-4">
                                To access certain features of the Platform, you may be required to register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete. You are responsible for safeguarding your password and for all activities that occur under your account.
                            </p>

                            <h3 className="text-2xl font-semibold mb-4 text-primary">1.3 Ticketing Services</h3>
                            <p className="mb-4">
                                We act as a platform for event organizers ("Organizers") to list and sell tickets for their events. We are not responsible for the content, quality, or cancellation of any event. All ticket sales are final unless otherwise stated by the Organizer or required by law.
                            </p>
                            <ul className="list-disc list-inside mb-4 space-y-2">
                                <li><strong>Ticket Purchase:</strong> When you purchase a ticket through our Platform, you are entering into a contract with the Organizer.</li>
                                <li><strong>Refunds and Exchanges:</strong> Refund and exchange policies are determined by the Organizer. Please review the Organizer's policy before purchasing.</li>
                                <li><strong>Event Cancellation:</strong> In the event of a cancellation, postponement, or significant change to an event, the Organizer is solely responsible for issuing refunds or offering alternative arrangements.</li>
                            </ul>

                            <h3 className="text-2xl font-semibold mb-4 text-primary">1.4 Prohibited Conduct</h3>
                            <p className="mb-4">
                                You agree not to:
                            </p>
                            <ul className="list-disc list-inside mb-4 space-y-2">
                                <li>Use the Platform for any unlawful purpose.</li>
                                <li>Engage in any activity that interferes with or disrupts the Platform.</li>
                                <li>Attempt to gain unauthorized access to any part of the Platform or its systems.</li>
                                <li>Resell tickets at a price higher than the face value (scalping) where prohibited by law.</li>
                                <li>Distribute viruses or any other harmful computer code.</li>
                            </ul>

                            <h3 className="text-2xl font-semibold mb-4 text-primary">1.5 Intellectual Property</h3>
                            <p className="mb-4">
                                All content on the Platform, including text, graphics, logos, and software, is the property of Tkti or its licensors and is protected by intellectual property laws.
                            </p>

                            <h3 className="text-2xl font-semibold mb-4 text-primary">1.6 Disclaimer of Warranties</h3>
                            <p className="mb-4">
                                The Platform is provided "as is" and "as available" without warranties of any kind, either express or implied, including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, and non-infringement.
                            </p>

                            <h3 className="text-2xl font-semibold mb-4 text-primary">1.7 Limitation of Liability</h3>
                            <p className="mb-4">
                                To the fullest extent permitted by law, Tkti shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses, resulting from (a) your access to or use of or inability to access or use the Platform; (b) any conduct or content of any third party on the Platform.
                            </p>

                            <h3 className="2xl font-semibold mb-4 text-primary">1.8 Governing Law</h3>
                            <p className="mb-4">
                                These Terms shall be governed by and construed in accordance with the laws of Kenya, without regard to its conflict of law principles.
                            </p>

                            <h3 className="2xl font-semibold mb-4 text-primary">1.9 Changes to Terms</h3>
                            <p className="mb-4">
                                We reserve the right to modify these Terms at any time. We will notify you of any changes by posting the new Terms on this page. Your continued use of the Platform after any such changes constitutes your acceptance of the new Terms.
                            </p>

                            <p className="text-sm text-right text-gray-500 mt-6">Last updated: June 28, 2025</p>
                        </div>
                    </div>

                    {/* Privacy Policy Section */}
                    <div className="collapse collapse-plus bg-base-100 rounded-lg shadow-xl border border-base-300">
                        <input type="checkbox" className="peer" />
                        <div className="collapse-title text-xl font-bold text-secondary peer-checked:bg-primary peer-checked:text-primary-content transition-all duration-300 rounded-t-lg">
                            2. Privacy Policy
                        </div>
                        <div className="collapse-content bg-base-100 p-6 text-base-content text-justify">
                            <h3 className="text-2xl font-semibold mb-4 text-primary">2.1 Introduction</h3>
                            <p className="mb-4">
                                Your privacy is important to us. This Privacy Policy explains how Tkti ("we," "us," or "our") collects, uses, discloses, and safeguards your information when you visit our website and use our services.
                            </p>

                            <h3 className="text-2xl font-semibold mb-4 text-primary">2.2 Information We Collect</h3>
                            <p className="mb-4">
                                We may collect personal information that you voluntarily provide to us when you register on the Platform, make a purchase, or contact us. This includes:
                            </p>
                            <ul className="list-disc list-inside mb-4 space-y-2">
                                <li><strong>Personal Identification Information:</strong> Name, email address, phone number, physical address.</li>
                                <li><strong>Payment Information:</strong> Credit card details (processed securely by third-party payment processors; we do not store full card details).</li>
                                <li><strong>Transaction Data:</strong> Details about purchases and ticket bookings.</li>
                                <li><strong>Technical Data:</strong> IP address, browser type, operating system, unique device identifiers, and other technical information when you visit our Platform.</li>
                                <li><strong>Usage Data:</strong> Information about how you use our Platform, such as pages visited, time spent on pages, and clickstream data.</li>
                            </ul>

                            <h3 className="text-2xl font-semibold mb-4 text-primary">2.3 How We Use Your Information</h3>
                            <p className="mb-4">
                                We use the information we collect for various purposes, including:
                            </p>
                            <ul className="list-disc list-inside mb-4 space-y-2">
                                <li>To provide and maintain our services.</li>
                                <li>To process transactions and deliver tickets.</li>
                                <li>To improve our Platform and user experience.</li>
                                <li>To communicate with you about your account, transactions, and events.</li>
                                <li>To send you marketing and promotional communications (with your consent).</li>
                                <li>To detect and prevent fraud and other illegal activities.</li>
                                <li>To comply with legal obligations.</li>
                            </ul>

                            <h3 className="text-2xl font-semibold mb-4 text-primary">2.4 Disclosure of Your Information</h3>
                            <p className="mb-4">
                                We may share your information with:
                            </p>
                            <ul className="list-disc list-inside mb-4 space-y-2">
                                <li><strong>Event Organizers:</strong> To facilitate event management and communication related to your tickets.</li>
                                <li><strong>Service Providers:</strong> Third-party vendors who perform services on our behalf, such as payment processing, data analysis, email delivery, hosting services, and customer service.</li>
                                <li><strong>Legal Requirements:</strong> If required to do so by law or in response to valid requests by public authorities (e.g., a court order or government agency).</li>
                                <li><strong>Business Transfers:</strong> In connection with any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.</li>
                            </ul>

                            <h3 className="text-2xl font-semibold mb-4 text-primary">2.5 Data Security</h3>
                            <p className="mb-4">
                                We implement a variety of security measures to maintain the safety of your personal information. However, no method of transmission over the Internet or method of electronic storage is 100% secure.
                            </p>

                            <h3 className="text-2xl font-semibold mb-4 text-primary">2.6 Your Data Protection Rights</h3>
                            <p className="mb-4">
                                Depending on your location, you may have the following rights regarding your personal data:
                            </p>
                            <ul className="list-disc list-inside mb-4 space-y-2">
                                <li>The right to access, update, or delete the information we have on you.</li>
                                <li>The right of rectification.</li>
                                <li>The right to object.</li>
                                <li>The right of restriction.</li>
                                <li>The right to data portability.</li>
                                <li>The right to withdraw consent.</li>
                            </ul>
                            <p className="mb-4">
                                To exercise any of these rights, please contact us at [Your Contact Email].
                            </p>

                            <h3 className="text-2xl font-semibold mb-4 text-primary">2.7 Third-Party Websites</h3>
                            <p className="mb-4">
                                Our Platform may contain links to third-party websites. We are not responsible for the privacy practices or the content of such websites.
                            </p>

                            <h3 className="text-2xl font-semibold mb-4 text-primary">2.8 Changes to This Privacy Policy</h3>
                            <p className="mb-4">
                                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
                            </p>

                            <p className="text-sm text-right text-gray-500 mt-6">Last updated: June 28, 2025</p>
                        </div>
                    </div>

                    {/* Cookie Policy Section */}
                    <div className="collapse collapse-plus bg-base-100 rounded-lg shadow-xl border border-base-300">
                        <input type="checkbox" className="peer" />
                        <div className="collapse-title text-xl font-bold text-secondary peer-checked:bg-primary peer-checked:text-primary-content transition-all duration-300 rounded-b-lg">
                            3. Cookie Policy
                        </div>
                        <div className="collapse-content bg-base-100 p-6 text-base-content text-justify">
                            <h3 className="text-2xl font-semibold mb-4 text-primary">3.1 What are Cookies?</h3>
                            <p className="mb-4">
                                Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently, as well as to provide information to the owners of the site.
                            </p>

                            <h3 className="text-2xl font-semibold mb-4 text-primary">3.2 How We Use Cookies</h3>
                            <p className="mb-4">
                                We use cookies for various purposes, including:
                            </p>
                            <ul className="list-disc list-inside mb-4 space-y-2">
                                <li><strong>Essential Cookies:</strong> Necessary for the operation of our Platform (e.g., to enable you to log in, add items to your cart, or access secure areas).</li>
                                <li><strong>Analytical/Performance Cookies:</strong> Allow us to recognize and count the number of visitors and see how visitors move around our Platform when they are using it. This helps us to improve the way our Platform works.</li>
                                <li><strong>Functionality Cookies:</strong> Used to recognize you when you return to our Platform. This enables us to personalize our content for you.</li>
                                <li><strong>Targeting Cookies:</strong> Record your visit to our Platform, the pages you have visited, and the links you have followed. We will use this information to make our Platform and the advertising displayed on it more relevant to your interests.</li>
                            </ul>

                            <h3 className="text-2xl font-semibold mb-4 text-primary">3.3 Third-Party Cookies</h3>
                            <p className="mb-4">
                                In addition to our own cookies, we may also use various third-parties cookies to report usage statistics of the Platform, deliver advertisements on and through the Platform, and so on.
                            </p>

                            <h3 className="text-2xl font-semibold mb-4 text-primary">3.4 Your Cookie Choices</h3>
                            <p className="mb-4">
                                You have the ability to accept or decline cookies. Most web browsers automatically accept cookies, but you can usually modify your browser setting to decline cookies if you prefer. If you choose to decline cookies, you may not be able to fully experience the interactive features of our services or websites you visit.
                            </p>
                            <p className="mb-4">
                                For more information on how to manage cookies in your browser, please refer to your browser's help documentation.
                            </p>

                            <h3 className="text-2xl font-semibold mb-4 text-primary">3.5 Changes to This Cookie Policy</h3>
                            <p className="mb-4">
                                We may update our Cookie Policy from time to time. We will notify you of any changes by posting the new Cookie Policy on this page.
                            </p>

                            <p className="text-sm text-right text-gray-500 mt-6">Last updated: June 28, 2025</p>
                        </div>
                    </div>

                    <div className="alert alert-info shadow-lg mt-8 text-center max-w-4xl mx-auto">
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current flex-shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            <span>
                                For any questions regarding these legal documents, please contact us at <a href="mailto:support@yourticketingplatform.com" className="link link-hover text-info-content font-bold">support@yourticketingplatform.com</a>.
                            </span>
                        </div>
                    </div>
                </div>
            </main>

             <Footer />
        </div>
    );
};
