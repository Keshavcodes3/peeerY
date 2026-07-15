import { Helmet } from 'react-helmet-async';

export const JsonLd = ({ data }: { data: object }) => (
  <Helmet>
    <script type="application/ld+json">
      {JSON.stringify({
        "@context": "https://schema.org",
        ...data,
      })}
    </script>
  </Helmet>
);