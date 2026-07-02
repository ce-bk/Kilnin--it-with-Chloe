import ScrollReveal from "@/components/ScrollReveal";

const PrivacyPolicy = () => (
  <main className="container py-12 md:py-16 max-w-3xl">
    <ScrollReveal direction="up">
      <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-2">Privacy Policy</h1>
      <p className="text-sm text-muted-foreground mb-10">Last updated: 2nd July 2026</p>
    </ScrollReveal>

    <ScrollReveal direction="up" delay={100}>
      <div className="space-y-8 text-muted-foreground leading-relaxed">
        <p>
          This site is a personal website operated by Chloe. This policy explains what
          information is collected when you visit kilninit.com and how it's used.
        </p>

        <section>
          <h2 className="font-serif text-2xl text-foreground mb-3">
            Information collected via the contact form
          </h2>
          <p>
            When you use the contact form on this site, the information you submit (such as
            your name, email address, and message) is processed by Formspree, a third-party
            form service, and forwarded to my inbox. I do not share this information with
            anyone else. Formspree's own privacy policy governs their handling of this data:{" "}
            <a
              href="https://formspree.io/legal/privacy-policy/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground transition-colors"
            >
              https://formspree.io/legal/privacy-policy/
            </a>
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-foreground mb-3">Analytics</h2>
          <p>
            This site uses Netlify Analytics, which collects aggregate, anonymized traffic
            data (such as page views and visitor counts) directly from server logs. This
            does not use cookies or track individual visitors, and no personal data is
            shared with third parties for this purpose.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-foreground mb-3">How your information is used</h2>
          <p>
            Contact form submissions are used solely to respond to your inquiry. They are
            not used for marketing, sold, or shared with third parties.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-foreground mb-3">Your rights</h2>
          <p>
            If you'd like your contact form information deleted or have questions about how
            it's used, contact me at{" "}
            <a
              href="mailto:hello@kilninit.com"
              className="underline hover:text-foreground transition-colors"
            >
              hello@kilninit.com
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-foreground mb-3">Changes to this policy</h2>
          <p>This policy may be updated occasionally. Changes will be posted on this page.</p>
        </section>
      </div>
    </ScrollReveal>
  </main>
);

export default PrivacyPolicy;
