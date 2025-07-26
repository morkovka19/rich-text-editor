
import('./heavy-module.js').then(module => {
  module.init();
});



export async function getServerSideProps() {
  const res = await fetch('https://api.example.com/data');
  const data = await res.json();
  return { props: { data } };
}

function Page({ data }) {
  return <div>{data}</div>;
}


import { Helmet } from 'react-helmet';

function ProductPage({ product }) {
  return (
    <>
      <Helmet>
        <title>{product.name}</title>
        <meta name="description" content={product.description} />
      </Helmet>
      {/* Контент страницы */}
    </>
  );
}


const start = performance.now();
window.addEventListener('load', () => {
  const loadTime = performance.now() - start;
  console.log(`Время загрузки: ${loadTime} мс`);
  // Отправка в аналитику
});


