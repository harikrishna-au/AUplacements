import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  {
    question: 'How do I update my profile information?',
    answer: 'Go to the Profile page from the dashboard. Your profile is currently read-only, but you can contact the placement cell to update your information.',
    category: 'Account'
  },
  {
    question: 'How do I track my placement applications?',
    answer: 'Visit the Pipeline page to see the status of all your applications. Each company shows your current stage in their recruitment process.',
    category: 'Features'
  },
  {
    question: 'Where can I find company-specific resources?',
    answer: 'Check the Resources page where you\'ll find study materials, interview guides, and preparation resources organized by company.',
    category: 'Resources'
  },
  {
    question: 'How do I join company discussions?',
    answer: 'Go to the Forum page and select any company channel to read discussions and post messages. You can search for specific topics too.',
    category: 'Forum'
  },
  {
    question: 'Can I download placement calendar events?',
    answer: 'Currently, the calendar is view-only. We\'re working on adding export and notification features soon.',
    category: 'Calendar'
  },
  {
    question: 'Who can I contact for placement-related queries?',
    answer: 'Use the contact information below to reach the Placement Cell. You can also submit a query through this support form.',
    category: 'Support'
  }
];

export default function SupportFAQ() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Frequently Asked Questions</CardTitle>
        <CardDescription>Quick answers to common questions</CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900">{faq.question}</span>
                  <span className="text-xs text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                    {faq.category}
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-gray-600">{faq.answer}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
