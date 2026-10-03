import ExifClient from './ExifClient';

export const metadata = {
  title: 'EXIF Metadata Cleaner — Remove GPS & Camera Details',
  description: 'Inspect and purge hidden GPS coordinates, camera model, date taken, and sensitive metadata from photos before sharing online.',
  keywords: ["remove exif","exif cleaner","remove gps from photo","strip metadata","photo privacy","clean exif online"],
  openGraph: {
    title: 'EXIF Metadata Cleaner — Remove GPS & Camera Details',
    description: 'Inspect and purge hidden GPS coordinates, camera model, date taken, and sensitive metadata from photos before sharing online.',
    type: 'website'
  }
};

export default function Page() {
  return <ExifClient />;
}
