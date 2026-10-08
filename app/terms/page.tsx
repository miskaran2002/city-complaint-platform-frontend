// app/terms/page.tsx
import type { Metadata } from 'next';
import { Navbar } from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import LegalLayout, { LegalSection } from '@/components/shared/LegalLayout';

export const metadata: Metadata = {
  title: 'Terms of Service | SmartCity Barishal',
  description: 'The rules for using the SmartCity Barishal complaint and service request platform.',
};

const sections: LegalSection[] = [
  {
    id: 'acceptance',
    title: 'Acceptance of these terms',
    paragraphs: [
      'These terms govern your use of SmartCity Barishal. By creating an account or using the platform, you agree to them. If you do not agree, please do not use the service.',
    ],
  },
  {
    id: 'accounts',
    title: 'Your account',
    list: [
      'Give accurate information when you register and keep it up to date.',
      'Keep your password private. You are responsible for activity under your account.',
      'Tell us straight away if you think someone else has accessed your account.',
    ],
  },
  {
    id: 'submitting-complaints',
    title: 'Submitting complaints',
    paragraphs: ['When you submit a complaint or service request, you agree that:'],
    list: [
      'The information, location and photos you provide are truthful and relate to a real civic issue.',
      'You will not include other people’s private details, such as phone numbers or faces, unless it is necessary.',
      'You have the right to share any photo or file you upload.',
    ],
  },
  {
    id: 'prohibited-use',
    title: 'What you must not do',
    list: [
      'Submit false, duplicate or abusive reports, or reports meant to harass someone.',
      'Upload unlawful, hateful or explicit content.',
      'Try to access other users’ data, break the platform’s security or overload the service.',
      'Use the platform to advertise, or to impersonate a citizen, staff member or official.',
    ],
  },
  {
    id: 'how-complaints-are-handled',
    title: 'How complaints are handled',
    paragraphs: [
      'We route each complaint to the relevant department. Response and resolution targets (SLA) are goals, not guarantees, and the time needed depends on the issue, resources and conditions on the ground. Departments decide how and when to carry out the work.',
      'The platform is not an emergency service. In an emergency involving danger to life, call the national emergency number 999 first.',
    ],
  },
  {
    id: 'payments',
    title: 'Payments and priority services',
    list: [
      'Some premium or priority services are paid. The price is shown before you pay.',
      'Payments are processed by bKash or Stripe, and their own terms and fees apply to your payment.',
      'Paying for a priority service gives your request faster handling where available. It does not guarantee a particular outcome.',
      'Refunds are handled according to the refund conditions shown at checkout and the rules of the payment provider.',
    ],
  },
  {
    id: 'your-content',
    title: 'Your content',
    paragraphs: [
      'You keep ownership of what you submit. You give us permission to store, display and share it with the departments and people who need it to handle your complaint, and to use it in combined, non-identifying statistics.',
    ],
  },
  {
    id: 'staff-and-technicians',
    title: 'Staff, technicians and managers',
    paragraphs: [
      'People with staff, technician, manager or admin roles must use their access only for official work, keep citizen information confidential and post accurate status updates. Misuse can lead to removal of access and further action.',
    ],
  },
  {
    id: 'suspension',
    title: 'Suspension and termination',
    paragraphs: [
      'We may limit, suspend or close an account that breaks these terms, harms others or puts the platform at risk. You can stop using the service or ask us to delete your account at any time.',
    ],
  },
  {
    id: 'disclaimers',
    title: 'Disclaimers and liability',
    paragraphs: [
      'The platform is provided "as is" and "as available". We work to keep it running and accurate, but we cannot promise it will always be uninterrupted or error free.',
      'To the extent allowed by law, we are not liable for indirect or consequential losses arising from your use of the platform, or for delays and decisions made by departments in handling a complaint.',
    ],
  },
  {
    id: 'changes',
    title: 'Changes to these terms',
    paragraphs: [
      'We may update these terms from time to time. If you keep using the platform after an update, you accept the new terms. The date at the top of this page shows the latest version.',
    ],
  },
  {
    id: 'governing-law',
    title: 'Governing law',
    paragraphs: ['These terms are governed by the laws of Bangladesh.'],
  },
  {
    id: 'contact',
    title: 'Contact us',
    paragraphs: [
      'Questions about these terms? Email support@smartbarishal.gov.bd or write to us at Fazlul Huq Avenue, Barishal 8200, Bangladesh.',
    ],
  },
];

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <LegalLayout
        eyebrow="Legal"
        title="Terms of Service"
        intro="A few simple rules that keep the platform fair, safe and useful for everyone in Barishal."
        updated="October 8, 2026"
        sections={sections}
        other={{ label: 'Read Privacy Policy', href: '/privacy' }}
      />
      <Footer />
    </>
  );
}