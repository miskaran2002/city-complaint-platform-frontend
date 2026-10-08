// app/privacy/page.tsx
import type { Metadata } from 'next';
import { Navbar } from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import LegalLayout, { LegalSection } from '@/components/shared/LegalLayout';

export const metadata: Metadata = {
  title: 'Privacy Policy | SmartCity Barishal',
  description: 'How SmartCity Barishal collects, uses and protects your information.',
};

const sections: LegalSection[] = [
  {
    id: 'overview',
    title: 'Overview',
    paragraphs: [
      'SmartCity Barishal ("we", "us") runs a platform where citizens report civic issues and follow them until they are resolved. This policy explains what information we collect, why we collect it and the choices you have.',
      'By creating an account or submitting a complaint, you agree to the practices described here.',
    ],
  },
  {
    id: 'information-we-collect',
    title: 'Information we collect',
    list: [
      'Account details: your name, email address, phone number and password (stored in hashed form).',
      'Complaint content: the category, description, attached photos or files, and the status history of each report.',
      'Location: the pin you drop on the map, or your device location if you choose to allow it.',
      'Payment information: if you pay for a priority service, the payment is handled by bKash or Stripe. We receive a payment confirmation and transaction reference. We do not store your full card number or wallet PIN.',
      'Usage data: basic device, browser and log information, and cookies that keep you signed in.',
    ],
  },
  {
    id: 'how-we-use-it',
    title: 'How we use your information',
    list: [
      'To create and secure your account.',
      'To send your complaint to the right department and keep you updated on its progress.',
      'To process payments and confirm priority services.',
      'To send notifications about status changes, deadlines and responses.',
      'To measure service quality, such as response times and citizen feedback, and to improve the platform.',
      'To detect abuse, fraud and false reports, and to keep the platform safe.',
    ],
  },
  {
    id: 'sharing',
    title: 'Who we share it with',
    paragraphs: ['We do not sell your personal information. We share it only where needed:'],
    list: [
      'City departments, staff, technicians and managers who are assigned to handle your complaint.',
      'Payment providers (bKash and Stripe) to complete a payment you choose to make.',
      'Service providers that help us run the platform, such as hosting, image storage and notification delivery, under confidentiality obligations.',
      'Authorities, when we are required to do so by law or to protect people from harm.',
    ],
  },
  {
    id: 'public-statistics',
    title: 'Public statistics',
    paragraphs: [
      'We may publish combined statistics, such as the number of complaints per category or area and average resolution times. These figures do not identify you.',
    ],
  },
  {
    id: 'retention',
    title: 'How long we keep it',
    paragraphs: [
      'We keep complaint records for as long as they are needed to resolve the issue, meet reporting requirements and handle disputes. Account details are kept while your account is active. When data is no longer needed, we delete it or remove anything that identifies you.',
    ],
  },
  {
    id: 'security',
    title: 'Security',
    paragraphs: [
      'We use access controls, encrypted connections and role-based permissions so that staff only see what they need for their work. No system is completely secure, so please use a strong, unique password and keep it private.',
    ],
  },
  {
    id: 'your-rights',
    title: 'Your choices and rights',
    list: [
      'View and correct the details in your account.',
      'Ask us to delete your account and the personal data linked to it, except records we must keep.',
      'Turn off location access in your device or browser settings at any time.',
      'Opt out of non-essential notifications. Service messages about your complaints may still be sent.',
    ],
    after: ['To make a request, contact us using the details at the end of this page.'],
  },
  {
    id: 'cookies',
    title: 'Cookies',
    paragraphs: [
      'We use cookies and similar technology to keep you signed in and remember preferences such as light or dark mode. You can block cookies in your browser, but parts of the platform may stop working.',
    ],
  },
  {
    id: 'children',
    title: "Children's privacy",
    paragraphs: [
      'The platform is meant for adults. If you are under 18, please use it together with a parent or guardian. If you believe a child has given us personal information without consent, contact us and we will remove it.',
    ],
  },
  {
    id: 'changes',
    title: 'Changes to this policy',
    paragraphs: [
      'We may update this policy from time to time. When we make important changes, we will update the date at the top of this page and, where appropriate, notify you.',
    ],
  },
  {
    id: 'contact',
    title: 'Contact us',
    paragraphs: [
      'Questions about this policy or your data? Email support@smartbarishal.gov.bd or write to us at Fazlul Huq Avenue, Barishal 8200, Bangladesh.',
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Navbar />
      <LegalLayout
        eyebrow="Legal"
        title="Privacy Policy"
        intro="Your reports help fix the city. This page explains how we handle the information you share while doing that."
        updated="October 8, 2026"
        sections={sections}
        other={{ label: 'Read Terms of Service', href: '/terms' }}
      />
      <Footer />
    </div>
  );
}