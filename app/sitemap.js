export default function sitemap() {
  const baseUrl = 'https://minttools.net';
  const routes = [
    '',
    '/pdf',
    '/pdf-compress',
    '/pdf-merge',
    '/image-pdf',
    '/image',
    '/exif-cleaner',
    '/barcode',
    '/qr',
    '/qr-reader',
    '/markdown',
    '/password',
    '/converter',
    '/dev',
    '/privacy',
    '/terms',
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: route === '' ? 1.0 : (route === '/privacy' || route === '/terms' ? 0.4 : 0.8),
  }));
}
