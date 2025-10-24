import { Link } from "react-router-dom";
import { categories } from "../data/products.js";

function Home() {
  return (
    <main>
      <section className="hero-text">
        <h2>Escolha seu estilo</h2>
        <p>Confira as últimas tendências</p>
      </section>

      <section className="categories">
        {categories.map((category) => (
          <Link key={category.slug} to={`/${category.slug}`} className="category">
            <img src={category.heroImage} alt={category.title} loading="lazy" />
            <h3>MODA {category.name.toUpperCase()}</h3>
          </Link>
        ))}
      </section>
    </main>
  );
}

export default Home;
