import PasswordClient from './PasswordClient';

export const metadata = {
  title: 'Secure Password & Passphrase Generator Online',
  description: 'Generate cryptographically secure random passwords and readable Diceware passphrases with real-time entropy analysis.',
  keywords: ["password generator","passphrase generator","diceware generator","secure password tool","strong password maker"],
  openGraph: {
    title: 'Secure Password & Passphrase Generator Online',
    description: 'Generate cryptographically secure random passwords and readable Diceware passphrases with real-time entropy analysis.',
    type: 'website'
  }
};

export default function Page() {
  return <PasswordClient />;
}
