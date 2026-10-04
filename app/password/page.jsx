import PasswordClient from './PasswordClient';
import ToolSeoSection from '../components/ToolSeoSection';

export const metadata = {
  title: 'Free Strong Password Generator – Cryptographically Secure & Random | MintTools',
  description: 'Generate uncrackable, cryptographically secure random passwords, memorable Diceware passphrases, and PINs with entropy analysis. 100% private, zero network requests.',
  keywords: ['password generator', 'strong password generator', 'random password generator', 'passphrase generator', 'secure password maker', 'diceware generator', 'entropy calculator'],
  openGraph: {
    title: 'Free Strong Password Generator – Cryptographically Secure & Random | MintTools',
    description: 'Create high-entropy passwords, memorably phrased keys, and PINs generated with browser Web Cryptography APIs.',
    type: 'website'
  }
};

const passwordFeatures = [
  {
    title: 'CSPRNG Cryptographic Entropy',
    desc: 'Uses the browser-native Web Cryptography API (crypto.getRandomValues) to produce true cryptographic randomness immune to PRNG predictability.'
  },
  {
    title: 'Customizable Rules & Formats',
    desc: 'Customize character lengths, toggle uppercase, lowercase, digits, and symbols, or generate human-memorable multi-word passphrases.'
  },
  {
    title: 'Zero Network Leakage',
    desc: 'Passwords are generated strictly in local browser memory and never transmitted over the internet or logged to any database.'
  }
];

const passwordSteps = [
  { title: 'Select Password Style', desc: 'Choose between Random Characters (high complexity), Memorable Passphrase (easy to remember), or PIN.' },
  { title: 'Configure Length & Rules', desc: 'Adjust password length slider and toggle special symbol categories or exclude confusing characters.' },
  { title: 'Copy with One Click', desc: 'Click the copy button to transfer your secure credential directly to your password manager.' }
];

const passwordFaqs = [
  {
    q: 'How does MintTools guarantee generated passwords are truly random?',
    a: 'We use the Web Cryptography API (window.crypto.getRandomValues), a cryptographically secure pseudorandom number generator (CSPRNG) seeded by your device hardware entropy (thermal noise, CPU timing), ensuring true cryptographic unpredictability.'
  },
  {
    q: 'Does MintTools or anyone else see my generated passwords?',
    a: 'No. The generator runs completely on client-side JavaScript. Not a single byte is ever sent over the network, making it impossible for servers or third parties to intercept.'
  },
  {
    q: 'What is a Diceware passphrase and why is it recommended?',
    a: 'A passphrase strings together random dictionary words (e.g. "correct-horse-battery-staple"). They provide equivalent or superior cryptographic entropy to random characters while being dramatically easier for humans to memorize and type on mobile devices.'
  },
  {
    q: 'What password length is recommended by modern cybersecurity standards?',
    a: 'Security standards like NIST recommend a minimum of 16 characters for critical accounts, combining mixed-case letters, numbers, and symbols to resist brute-force dictionary attacks.'
  },
  {
    q: 'Can I generate multiple passwords at once?',
    a: 'Yes. MintTools allows you to batch-generate lists of passwords for provisioning multiple users, accounts, or service credentials quickly.'
  }
];

export default function Page() {
  return (
    <>
      <PasswordClient />
      <ToolSeoSection
        heading="Enterprise-Grade Cryptographic Password Generator"
        subheading="Arm your digital security with mathematically robust credentials generated purely on your local device."
        features={passwordFeatures}
        steps={passwordSteps}
        faqs={passwordFaqs}
      />
    </>
  );
}
